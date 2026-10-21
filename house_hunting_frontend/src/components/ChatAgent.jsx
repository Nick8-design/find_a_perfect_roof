import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import { getRandomHouseImage } from '../assets/placeholders';

export default function ChatAgent({ isOpen, onClose, onBookHouse, initialPrompt = '' }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Hi there! I'm your Gemini AI House Hunting Assistant. I can search listings by budget, neighborhood, or bedrooms, tell you about caretakers, and help you book. What kind of house are you looking for today?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Format conversation history for Gemini API: [{ role: 'user'|'model', parts: [{ text }] }]
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      const res = await sendChatMessage(text, conversationHistory);

      const botMessage = {
        role: 'model',
        text: res.reply || 'Here is what I found for you:',
        action: res.action,
        data: res.data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'Sorry, I had trouble communicating with the server. Please verify your backend server is running on http://localhost:5000.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPills = [
    'Houses under $600 in Westlands',
    '2 bedroom apartments with parking',
    'What is the deposit policy?',
    'Show all available houses',
  ];

  if (!isOpen) return null;

  return (
    <div className="chat-drawer-container position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 overflow-hidden d-flex flex-column bg-white">
      {/* Header */}
      <div className="chat-header bg-primary text-white p-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-white text-primary p-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: 36, height: 36 }}>
            <i className="bi bi-robot fs-5"></i>
          </div>
          <div>
            <div className="fw-bold d-flex align-items-center gap-2">
              Gemini AI Agent
              <span className="badge bg-success bg-opacity-75 text-white" style={{ fontSize: '0.65rem' }}>Active</span>
            </div>
            <div className="extra-small text-white-50">Smart Real Estate & Booking Assistant</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-link text-white p-1"
          onClick={onClose}
          title="Minimize Chat"
        >
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-body p-3 flex-grow-1 overflow-auto bg-light">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`d-flex flex-column mb-3 ${isUser ? 'align-items-end' : 'align-items-start'}`}>
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  isUser
                    ? 'bg-primary text-white text-end rounded-bottom-end-0'
                    : 'bg-white text-dark rounded-bottom-start-0 border'
                }`}
                style={{ maxWidth: '85%', fontSize: '0.9rem', lineHeight: '1.45' }}
              >
                {!isUser && (
                  <div className="d-flex align-items-center gap-1 text-primary fw-semibold extra-small mb-1">
                    <i className="bi bi-stars"></i> Gemini Assistant
                  </div>
                )}
                <div>{msg.text}</div>

                {/* Render interactive cards if Gemini executed searchHouses */}
                {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                  <div className="chat-cards-grid mt-3 d-flex flex-column gap-2">
                    {msg.data.map((item, idx) => {
                      const image = (Array.isArray(item.images) && item.images[0]) || getRandomHouseImage(idx);
                      const rent = item.monthly_rent || item.monthlyRent || 0;
                      return (
                        <div key={idx} className="card border bg-white rounded-3 shadow-none overflow-hidden p-2">
                          <div className="d-flex gap-2">
                            <img
                              src={image}
                              alt={item.title}
                              className="rounded-2 object-fit-cover"
                              style={{ width: 70, height: 70 }}
                            />
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="fw-semibold text-truncate small text-dark">{item.title}</div>
                              <div className="text-muted extra-small d-flex align-items-center">
                                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                {item.location} • {item.bedrooms} Bed{item.bedrooms > 1 ? 's' : ''}
                              </div>
                              <div className="fw-bold text-primary small mt-1">
                                ${rent} <span className="text-muted extra-small">/mo</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 pt-1 border-top d-flex gap-1 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary py-0 px-2 extra-small"
                              onClick={() => {
                                if (onBookHouse) onBookHouse(item);
                              }}
                            >
                              <i className="bi bi-paypal me-1"></i> Book Now
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="d-flex align-items-center gap-2 text-muted extra-small ms-1 mb-2">
            <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
            <span>Gemini is thinking and finding the best match...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Pills */}
      <div className="p-2 bg-white border-top border-bottom overflow-x-auto d-flex gap-1 text-nowrap">
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-outline-secondary btn-sm rounded-pill extra-small py-1 px-2"
            onClick={() => handleSendMessage(pill)}
            disabled={loading}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control border-end-0 rounded-start-pill ps-3"
            placeholder="Ask about listings, locations, prices..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="btn btn-primary rounded-end-pill px-3"
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

