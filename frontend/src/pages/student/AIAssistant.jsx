import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import {
  FiBookOpen,
  FiFileText,
  FiMic,
  FiPlus,
  FiSave,
  FiSend,
  FiTrash2,
  FiUpload,
  FiZap,
} from 'react-icons/fi';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useAuth } from '../../contexts/AuthContext';

const noteColors = [
  { id: 'yellow', label: 'Yellow', className: 'bg-yellow-100 border-yellow-300 text-yellow-950' },
  { id: 'pink', label: 'Pink', className: 'bg-pink-100 border-pink-300 text-pink-950' },
  { id: 'blue', label: 'Blue', className: 'bg-blue-100 border-blue-300 text-blue-950' },
  { id: 'green', label: 'Green', className: 'bg-green-100 border-green-300 text-green-950' },
  { id: 'purple', label: 'Purple', className: 'bg-purple-100 border-purple-300 text-purple-950' },
  { id: 'orange', label: 'Orange', className: 'bg-orange-100 border-orange-300 text-orange-950' },
];

const getColorClass = (color) => (
  noteColors.find((item) => item.id === color)?.className || noteColors[0].className
);

const defaultNoteDraft = {
  title: '',
  content: '',
  page_number: '',
  color: 'yellow',
  pinned: false,
  tags: '',
};

function AIAssistant() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [availableModels, setAvailableModels] = useState(['llama3', 'mistral']);
  const [selectedModel, setSelectedModel] = useState('llama3');
  const [notes, setNotes] = useState([]);
  const [noteDraft, setNoteDraft] = useState(defaultNoteDraft);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const selectedDocument = useMemo(
    () => documents.find((doc) => doc._id === selectedDocumentId),
    [documents, selectedDocumentId]
  );

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return;

      try {
        const [modelsResponse, documentsResponse] = await Promise.all([
          axios.get(`${API_URL}/ai/models`, { headers: authHeaders }),
          axios.get(`${API_URL}/student/documents`, { headers: authHeaders }),
        ]);

        setAvailableModels(modelsResponse.data.models || ['llama3', 'mistral']);
        setSelectedModel(modelsResponse.data.default_model || 'llama3');

        const userDocuments = documentsResponse.data.documents || [];
        setDocuments(userDocuments);
        if (userDocuments.length > 0) {
          setSelectedDocumentId(userDocuments[0]._id);
        }
      } catch (error) {
        console.error('Study workspace load error:', error);
      }
    };

    fetchInitialData();
  }, [token, authHeaders]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!selectedDocumentId || !token) {
        setNotes([]);
        return;
      }

      try {
        setNotesLoading(true);
        const response = await axios.get(
          `${API_URL}/student/document/${selectedDocumentId}/notes`,
          { headers: authHeaders }
        );
        setNotes(response.data.notes || []);
      } catch (error) {
        console.error('Sticky notes load error:', error);
      } finally {
        setNotesLoading(false);
      }
    };

    fetchNotes();
  }, [selectedDocumentId, token, authHeaders]);

  const appendChat = (...items) => {
    setChatHistory((prev) => [...prev, ...items]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/student/document/upload`, formData, {
        headers: {
          ...authHeaders,
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedDocument = {
        _id: response.data.document_id,
        filename: response.data.filename,
        file_type: file.name.split('.').pop()?.toLowerCase() || 'pdf',
        content_length: response.data.content_length,
      };

      setDocuments((prev) => [uploadedDocument, ...prev.filter((doc) => doc._id !== uploadedDocument._id)]);
      setSelectedDocumentId(uploadedDocument._id);
      setNotes([]);
      appendChat({
        type: 'ai',
        content: `${response.data.filename} is ready. Add sticky notes, summarize it, or ask questions while you study.`,
        model: 'system',
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!selectedDocumentId) {
      alert('Please upload or select a document first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/ai/summarize`, {
        document_id: selectedDocumentId,
        model: selectedModel,
      }, {
        headers: authHeaders,
      });

      appendChat({
        type: 'user',
        content: `Summarize ${selectedDocument?.filename || 'this document'}`,
      }, {
        type: 'ai',
        content: response.data.summary,
        model: response.data.model,
      });
    } catch (error) {
      console.error('Summarize error:', error);
      alert('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDocumentId) {
      alert('Please upload or select a document first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/ai/quiz`, {
        document_id: selectedDocumentId,
        num_questions: 5,
        model: selectedModel,
      }, {
        headers: authHeaders,
      });

      const quizText = response.data.questions.map((q, i) =>
        `Q${i + 1}: ${q.question}\nA) ${q.options.A}\nB) ${q.options.B}\nC) ${q.options.C}\nD) ${q.options.D}\nCorrect: ${q.correct_answer}`
      ).join('\n\n');

      appendChat({
        type: 'user',
        content: `Generate a quiz from ${selectedDocument?.filename || 'this document'}`,
      }, {
        type: 'ai',
        content: quizText || response.data.raw_quiz,
        model: response.data.model,
      });
    } catch (error) {
      console.error('Quiz error:', error);
      alert('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage('');
    resetTranscript();
    appendChat({ type: 'user', content: userMessage });

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/ai/chat`, {
        message: userMessage,
        document_id: selectedDocumentId,
        model: selectedModel,
      }, {
        headers: authHeaders,
      });

      appendChat({
        type: 'ai',
        content: response.data.response,
        model: response.data.model,
      });
    } catch (error) {
      console.error('Chat error:', error);
      appendChat({
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        model: selectedModel,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const createNotePayload = (draft) => ({
    title: draft.title || 'Untitled note',
    content: draft.content,
    color: draft.color,
    page_number: draft.page_number ? Number(draft.page_number) : null,
    pinned: draft.pinned,
    tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
  });

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!selectedDocumentId) {
      alert('Please upload or select a document first');
      return;
    }
    if (!noteDraft.title.trim() && !noteDraft.content.trim()) {
      alert('Write a title or note before saving');
      return;
    }

    try {
      setNoteSaving(true);
      const response = await axios.post(
        `${API_URL}/student/document/${selectedDocumentId}/notes`,
        createNotePayload(noteDraft),
        { headers: authHeaders }
      );
      setNotes((prev) => [response.data.note, ...prev]);
      setNoteDraft(defaultNoteDraft);
    } catch (error) {
      console.error('Create note error:', error);
      alert('Failed to create sticky note');
    } finally {
      setNoteSaving(false);
    }
  };

  const updateNoteInState = (noteId, field, value) => {
    setNotes((prev) => prev.map((note) => (
      note._id === noteId ? { ...note, [field]: value } : note
    )));
  };

  const handleSaveNote = async (note) => {
    try {
      setNoteSaving(true);
      const response = await axios.patch(
        `${API_URL}/student/notes/${note._id}`,
        {
          title: note.title,
          content: note.content,
          color: note.color,
          page_number: note.page_number ? Number(note.page_number) : null,
          pinned: note.pinned,
          tags: note.tags || [],
        },
        { headers: authHeaders }
      );
      setNotes((prev) => prev.map((item) => (
        item._id === note._id ? response.data.note : item
      )));
    } catch (error) {
      console.error('Save note error:', error);
      alert('Failed to save sticky note');
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this sticky note?')) return;

    try {
      await axios.delete(`${API_URL}/student/notes/${noteId}`, {
        headers: authHeaders,
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error('Delete note error:', error);
      alert('Failed to delete sticky note');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
              <FiBookOpen />
              <span>Study Workspace</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              Learn from documents with AI and sticky notes
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Upload a PDF, DOCX, or TXT file, then pin page-specific notes while you summarize, quiz, and ask questions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-96">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Model
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="input-field mt-1"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Study document
              <select
                value={selectedDocumentId || ''}
                onChange={(e) => setSelectedDocumentId(e.target.value || null)}
                className="input-field mt-1"
              >
                <option value="">Select a document</option>
                {documents.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.filename}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload material</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">PDF notes become a study board immediately.</p>
              </div>
              <FiUpload className="text-2xl text-blue-600" />
            </div>

            <div className="mt-4 space-y-3">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="input-field"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  <FiFileText />
                  <span className="truncate">{selectedFile.name}</span>
                </div>
              )}
            </div>

            {selectedDocumentId && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleSummarize}
                  disabled={loading}
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FiZap />
                  Summarize
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <FiBookOpen />
                  Generate Quiz
                </button>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">New sticky note</h2>
            <form onSubmit={handleCreateNote} className="mt-4 space-y-4">
              <input
                type="text"
                value={noteDraft.title}
                onChange={(e) => setNoteDraft({ ...noteDraft, title: e.target.value })}
                className="input-field"
                placeholder="Topic, formula, doubt..."
              />

              <textarea
                value={noteDraft.content}
                onChange={(e) => setNoteDraft({ ...noteDraft, content: e.target.value })}
                className="input-field min-h-28 resize-y"
                placeholder="Write the sticky note you want to remember."
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="number"
                  min="1"
                  value={noteDraft.page_number}
                  onChange={(e) => setNoteDraft({ ...noteDraft, page_number: e.target.value })}
                  className="input-field"
                  placeholder="Page number"
                />
                <input
                  type="text"
                  value={noteDraft.tags}
                  onChange={(e) => setNoteDraft({ ...noteDraft, tags: e.target.value })}
                  className="input-field"
                  placeholder="Tags: exam, doubt"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {noteColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setNoteDraft({ ...noteDraft, color: color.id })}
                    className={`h-8 w-8 rounded-full border-2 ${color.className} ${
                      noteDraft.color === color.id ? 'ring-2 ring-gray-900 ring-offset-2' : ''
                    }`}
                    title={color.label}
                    aria-label={color.label}
                  />
                ))}
                <label className="ml-auto flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={noteDraft.pinned}
                    onChange={(e) => setNoteDraft({ ...noteDraft, pinned: e.target.checked })}
                  />
                  Pin
                </label>
              </div>

              <button
                type="submit"
                disabled={noteSaving || !selectedDocumentId}
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-60"
              >
                <FiPlus />
                Add Sticky Note
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sticky note board</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDocument ? selectedDocument.filename : 'Select a document to begin.'}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {notes.length} notes
              </span>
            </div>

            <div className="mt-5 min-h-72 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              {notesLoading ? (
                <p className="text-sm text-gray-500">Loading notes...</p>
              ) : notes.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center text-center text-gray-500">
                  <FiFileText className="mb-3 text-3xl" />
                  <p className="font-medium">No sticky notes yet</p>
                  <p className="mt-1 text-sm">Capture definitions, page doubts, formulas, and revision cues here.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {notes.map((note) => (
                    <article
                      key={note._id}
                      className={`rounded-lg border p-4 shadow-sm ${getColorClass(note.color)}`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          value={note.title}
                          onChange={(e) => updateNoteInState(note._id, 'title', e.target.value)}
                          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base font-bold outline-none"
                          placeholder="Untitled note"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNote({ ...note, pinned: !note.pinned })}
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            note.pinned ? 'bg-gray-900 text-white' : 'bg-white/70 text-gray-700'
                          }`}
                          title={note.pinned ? 'Unpin note' : 'Pin note'}
                        >
                          {note.pinned ? 'Pinned' : 'Pin'}
                        </button>
                      </div>

                      <textarea
                        value={note.content}
                        onChange={(e) => updateNoteInState(note._id, 'content', e.target.value)}
                        className="mt-3 min-h-28 w-full resize-y border-0 bg-transparent p-0 text-sm outline-none"
                        placeholder="Write what matters..."
                      />

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <input
                          type="number"
                          min="1"
                          value={note.page_number || ''}
                          onChange={(e) => updateNoteInState(note._id, 'page_number', e.target.value)}
                          className="rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none"
                          placeholder="Page"
                        />
                        <input
                          type="text"
                          value={(note.tags || []).join(', ')}
                          onChange={(e) => updateNoteInState(
                            note._id,
                            'tags',
                            e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
                          )}
                          className="rounded-md border border-black/10 bg-white/70 px-3 py-2 text-sm outline-none"
                          placeholder="Tags"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {noteColors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => updateNoteInState(note._id, 'color', color.id)}
                            className={`h-6 w-6 rounded-full border ${color.className} ${
                              note.color === color.id ? 'ring-2 ring-gray-900 ring-offset-1' : ''
                            }`}
                            title={color.label}
                            aria-label={color.label}
                          />
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveNote(note)}
                          disabled={noteSaving}
                          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white/80 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-white disabled:opacity-60"
                        >
                          <FiSave />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note._id)}
                          className="flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                          title="Delete note"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ask while studying</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Questions use the selected document as context when one is selected.
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {selectedModel}
              </span>
            </div>

            <div className="mt-4 h-80 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-900/40">
              {chatHistory.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-gray-500">
                  <p>Ask for examples, explain a marked page, or turn a sticky note into a revision cue.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={`${msg.type}-${index}`}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xl rounded-lg px-4 py-3 text-sm ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
                        }`}
                      >
                        {msg.model && msg.type === 'ai' && (
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">
                            {msg.model}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <p className="mt-4 text-sm text-gray-500">Thinking with {selectedModel}...</p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about this document..."
                className="input-field flex-1"
                disabled={loading}
              />

              {isSupported && (
                <button
                  onClick={handleVoiceInput}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    isListening
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  <FiMic />
                </button>
              )}

              <button
                onClick={handleSendMessage}
                disabled={loading || !message.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <FiSend />
                Send
              </button>
            </div>

            {isListening && (
              <p className="mt-2 text-sm text-red-600">Listening... speak now.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AIAssistant;

// Made with Bob
