import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getRandomHouseImage } from '../assets/placeholders';
import GoogleMapEmbed from './GoogleMapEmbed';

export default function ChatAgent({ isOpen, onClose, onBookHouse, initialPrompt = '' }) {
  const { user } = useAuth();
  const userFirstName = user?.name ? user.name.split(' ')[0] : '';

  const getWelcomeMessage = () => {
    return userFirstName
      ? `Hi ${userFirstName}! I'm Nixy. What kind of home are you looking for today?`
      : `Hi! I'm Nixy. What kind of home are you looking for today?`;
  };

  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: getWelcomeMessage(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMapHouseId, setActiveMapHouseId] = useState(null);

  const messagesEndRef = useRef(null);

  // Update greeting if user logs in while window is open
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', text: getWelcomeMessage() }]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isExpanded]);

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
      const conversationHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }));

      // Pass user info so the backend Gemini prompt knows the user's name
      const res = await sendChatMessage(text, conversationHistory, user?.id || null);

      const botMessage = {
        role: 'model',
        text: res.reply || 'Here are properties that match your search:',
        action: res.action,
        data: res.data,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'I could not reach the server. Please check your backend connection.',
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
    '2 bedroom in Westlands under $800',
    'Studios in Kilimani',
    'Villas in Karen with garden',
    'How do I pay with PayPal?',
  ];

  if (!isOpen) return null;

  // Minimized Pill Bar
  if (isMinimized) {
    return (
      <div
        className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-pill text-white py-2 px-3 d-flex align-items-center gap-2"
        style={{ zIndex: 1050, cursor: 'pointer', backgroundColor: '#001C3D' }}
        onClick={() => setIsMinimized(false)}
      >
        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white"
          style={{ width: 26, height: 26, backgroundColor: '#0070BA' }}
        >
          <i className="bi bi-chat-dots-fill" style={{ fontSize: '12px' }}></i>
        </div>
        <span className="small fw-semibold">Nixy</span>
        <button
          type="button"
          className="btn-close btn-close-white p-1 ms-1"
          style={{ fontSize: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        ></button>
      </div>
    );
  }

  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 overflow-hidden d-flex flex-column bg-white border"
      style={{
        zIndex: 1050,
        width: isExpanded ? 'min(880px, 94vw)' : 'min(420px, 94vw)',
        height: isExpanded ? 'min(760px, 86vh)' : 'min(600px, 80vh)',
        transition: 'width 0.25s ease, height 0.25s ease',
      }}
    >
      {/* Header */}
      <div
        className="p-3 text-white d-flex align-items-center justify-content-between"
        style={{ backgroundColor: '#001C3D' }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{ width: 34, height: 34, backgroundColor: '#0070BA' }}
          >
            <i className="bi bi-chat-dots-fill" style={{ fontSize: '15px' }}></i>
          </div>
          <div>
            <div className="fw-semibold d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
              Nixy
              <span className="badge rounded-pill bg-success" style={{ fontSize: '9px', padding: '2px 6px' }}>
                Online
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: '11px', color: '#A6B6C8' }}>
              Property search & PayPal booking
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-link text-white p-1"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <i className={`bi ${isExpanded ? 'bi-arrows-angle-contract' : 'bi-arrows-angle-expand'}`} style={{ fontSize: '13px' }}></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-link text-white p-1"
            onClick={() => setIsMinimized(true)}
            title="Minimize"
          >
            <i className="bi bi-dash-lg" style={{ fontSize: '15px' }}></i>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-link text-white p-1"
            onClick={onClose}
            title="Close"
          >
            <i className="bi bi-x-lg" style={{ fontSize: '13px' }}></i>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-3 flex-grow-1 overflow-auto" style={{ backgroundColor: '#F8FAFC' }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div key={index} className={`d-flex flex-column mb-3 ${isUser ? 'align-items-end' : 'align-items-start'}`}>
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  isUser
                    ? 'text-white'
                    : 'bg-white text-dark border'
                }`}
                style={{
                  maxWidth: isExpanded ? '90%' : '88%',
                  fontSize: '13.5px',
                  lineHeight: '1.45',
                  backgroundColor: isUser ? '#0070BA' : '#FFFFFF',
                }}
              >
                {!isUser && (
                  <div className="fw-semibold small mb-1" style={{ color: '#0070BA', fontSize: '12px' }}>
                    Nixy
                  </div>
                )}
                <div>{msg.text}</div>

                {/* 1. RENDER INITIATED BOOKING CARD */}
                {msg.action === 'initiateBooking' && msg.data && (
                  <div className="mt-3 p-3 rounded-3 bg-white border text-start">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge rounded-pill bg-success" style={{ fontSize: '10px' }}>
                        15-min Hold Active
                      </span>
                      <span className="font-monospace text-muted" style={{ fontSize: '11px' }}>
                        {msg.data.bookingId}
                      </span>
                    </div>

                    <h6 className="fw-bold text-dark mb-1">{msg.data.house?.title}</h6>
                    <div className="text-muted small mb-2">
                      <i className="bi bi-geo-alt me-1"></i>
                      {msg.data.house?.location}
                    </div>

                    <div className="p-2 rounded-2 small mb-3 border" style={{ backgroundColor: '#F8FAFC' }}>
                      <div className="d-flex justify-content-between mb-1 text-muted">
                        <span>Duration:</span>
                        <strong className="text-dark">{msg.data.monthsPaid} month(s)</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1 text-muted">
                        <span>Move-in:</span>
                        <strong className="text-dark">{msg.data.startDate}</strong>
                      </div>
                      <div className="d-flex justify-content-between border-top pt-1 fw-bold text-dark">
                        <span>Total Due:</span>
                        <span style={{ color: '#0070BA' }}>${Number(msg.data.totalAmount).toFixed(2)}</span>
                      </div>
                    </div>

                    {msg.data.approveUrl && (
                      <a
                        href={msg.data.approveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm text-white w-100 py-2 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 mb-2"
                        style={{ backgroundColor: '#0070BA' }}
                      >
                        <i className="bi bi-paypal"></i>
                        <span>Pay with PayPal</span>
                      </a>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary w-100 rounded-pill"
                      onClick={() => onBookHouse && onBookHouse(msg.data.house)}
                    >
                      Open Booking Form
                    </button>
                  </div>
                )}

                {/* 2. RENDER LISTING PREVIEWS */}
                {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                  <div className={`mt-3 ${isExpanded ? 'row g-2 row-cols-1 row-cols-md-2' : 'd-flex flex-column gap-2'}`}>
                    {msg.data.map((item, idx) => {
                      const image = (Array.isArray(item.images) && item.images[0]) || getRandomHouseImage(idx);
                      const rent = item.monthly_rent || item.monthlyRent || 0;
                      const deposit = item.deposit_amount || item.depositAmount || 0;

                      return (
                        <div key={item.id || idx} className={isExpanded ? 'col' : ''}>
                          <div className="card border rounded-3 bg-white overflow-hidden text-start shadow-none">
                            <div className="position-relative" style={{ height: isExpanded ? 140 : 90 }}>
                              <img src={image} alt={item.title} className="w-100 h-100 object-fit-cover" />
                              <div className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white" style={{ fontSize: '11px' }}>
                                ${rent}/mo
                              </div>
                            </div>

                            <div className="p-2">
                              <div className="fw-semibold text-truncate text-dark" style={{ fontSize: '13px' }}>
                                {item.title}
                              </div>
                              <div className="text-muted small d-flex justify-content-between mb-1" style={{ fontSize: '11px' }}>
                                <span>{item.location} • {item.bedrooms} bed</span>
                                <span>Deposit: ${deposit}</span>
                              </div>

                              {activeMapHouseId === item.id && (
                                <GoogleMapEmbed location={item.location} title={item.title} height={120} />
                              )}
                            </div>

                            <div className="p-2 pt-0 d-flex justify-content-between align-items-center border-top bg-light">
                              <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{ color: '#0070BA', fontSize: '11px' }}
                                onClick={() => setActiveMapHouseId(activeMapHouseId === item.id ? null : item.id)}
                              >
                                {activeMapHouseId === item.id ? 'Hide map' : 'Map'}
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm text-white rounded-pill px-3 py-0"
                                style={{ backgroundColor: '#0070BA', fontSize: '12px' }}
                                onClick={() => onBookHouse && onBookHouse(item)}
                              >
                                Book
                              </button>
                            </div>

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

        {loading && (
          <div className="d-flex align-items-center gap-2 text-muted small ms-1 mb-2" style={{ fontSize: '12px' }}>
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span>Nixy is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Quick Pills */}
      <div className="p-2 bg-white border-top border-bottom overflow-x-auto d-flex gap-1 text-nowrap">
        {quickPills.map((pill, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-sm btn-outline-secondary rounded-pill py-0 px-2"
            style={{ fontSize: '11px' }}
            onClick={() => handleSendMessage(pill)}
            disabled={loading}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2 bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control rounded-pill-start border-end-0 px-3"
            style={{ borderColor: '#CBD5E1', fontSize: '13.5px' }}
            placeholder={userFirstName ? `Ask Nixy anything, ${userFirstName}...` : "Ask Nixy anything..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="btn text-white rounded-pill-end px-3"
            style={{ backgroundColor: '#0070BA' }}
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputText.trim()}
          >
            <i className="bi bi-send-fill" style={{ fontSize: '12px' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
