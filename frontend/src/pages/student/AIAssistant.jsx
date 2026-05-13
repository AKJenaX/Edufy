import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useAuth } from '../../contexts/AuthContext';

function AIAssistant() {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedDocId, setUploadedDocId] = useState(null);

  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Update message when transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/student/document/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedDocId(response.data.document_id);
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!uploadedDocId) {
      alert('Please upload a document first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/ai/summarize', {
        document_id: uploadedDocId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setChatHistory([...chatHistory, {
        type: 'user',
        content: 'Summarize this document'
      }, {
        type: 'ai',
        content: response.data.summary
      }]);
    } catch (error) {
      console.error('Summarize error:', error);
      alert('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!uploadedDocId) {
      alert('Please upload a document first');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/ai/quiz', {
        document_id: uploadedDocId,
        num_questions: 5,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const quizText = response.data.questions.map((q, i) => 
        `Q${i + 1}: ${q.question}\nA) ${q.options.A}\nB) ${q.options.B}\nC) ${q.options.C}\nD) ${q.options.D}\nCorrect: ${q.correct_answer}`
      ).join('\n\n');
      
      setChatHistory([...chatHistory, {
        type: 'user',
        content: 'Generate quiz from document'
      }, {
        type: 'ai',
        content: quizText
      }]);
    } catch (error) {
      console.error('Quiz error:', error);
      alert('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    resetTranscript();

    setChatHistory([...chatHistory, {
      type: 'user',
      content: userMessage
    }]);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/ai/chat', {
        message: userMessage,
        document_id: uploadedDocId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: response.data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900">AI Learning Assistant</h1>
        <p className="text-gray-600 mt-1">Upload documents and get AI-powered help</p>
      </div>

      {/* Document Upload */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="flex-1 input-field"
          />
          {selectedFile && (
            <span className="text-sm text-green-600">✓ {selectedFile.name}</span>
          )}
        </div>
        
        {uploadedDocId && (
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleSummarize}
              disabled={loading}
              className="btn-primary"
            >
              Summarize
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="btn-secondary"
            >
              Generate Quiz
            </button>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chat with AI</h2>
        
        {/* Chat History */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-center">Start a conversation with the AI assistant</p>
          ) : (
            chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message or use voice input..."
            className="flex-1 input-field"
            disabled={loading}
          />
          
          {isSupported && (
            <button
              onClick={handleVoiceInput}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Send
          </button>
        </div>
        
        {isListening && (
          <p className="text-sm text-red-600 mt-2 animate-pulse">
            🎤 Listening... Speak now
          </p>
        )}
      </div>
    </div>
  );
}

export default AIAssistant;

// Made with Bob
