import React, { useState } from 'react';

export default function SentimentFeedback() {
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, text: "Micro-lessons helped a lot — thanks!", score: 0.8, date: "2025-06-01", sentiment: 'positive' },
    { id: 2, text: "Feeling pressured before exams", score: 0.35, date: "2025-06-10", sentiment: 'negative' },
    { id: 3, text: "Practice questions were very helpful", score: 0.75, date: "2025-06-15", sentiment: 'positive' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    const newFeedback = {
      id: Date.now(),
      text: feedback,
      score: Math.random() * 0.6 + 0.2,
      date: new Date().toISOString().slice(0, 10),
      sentiment: Math.random() > 0.5 ? 'positive' : 'negative'
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setFeedback('');
    alert('Feedback submitted successfully!');
  };

  const getSentimentColor = (sentiment) => {
    return sentiment === 'positive' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getSentimentIcon = (sentiment) => {
    return sentiment === 'positive' ? '😊' : '😟';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-3">
            <span className="text-xs font-bold text-purple-600">💬 Insights</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">Sentiment & Feedback</h3>
          <p className="text-base text-gray-600">Share your feelings and reflections</p>
        </div>
        <div className="icon-container w-16 h-16 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">💬</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="How are you feeling about your studies today?"
          className="input-modern w-full resize-none"
          rows={3}
          required
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={() => setFeedback('')}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition font-bold hover-scale"
          >
            Clear
          </button>
          <button
            type="submit"
            className="btn-gradient-primary px-8 py-2.5 text-white rounded-xl font-bold shadow-lg glow-hover"
          >
            Submit Feedback →
          </button>
        </div>
      </form>

      <div>
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📝</span> Recent Feedback
        </h4>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {feedbacks.map((item) => (
            <div key={item.id} className="card-advanced p-5 bg-gradient-to-br from-gray-50 to-white hover-scale">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge-gradient ${getSentimentColor(item.sentiment)} badge-gradient text-xs font-bold`}>
                  {getSentimentIcon(item.sentiment)} {item.sentiment}
                </span>
                <span className="text-xs text-gray-500 font-semibold">{item.date}</span>
              </div>
              <p className="text-sm text-gray-800 mb-3 leading-relaxed">{item.text}</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" 
                    style={{ width: `${(item.score || 0) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-600">{Math.round((item.score || 0) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
