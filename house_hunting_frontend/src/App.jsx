import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExplorePage from './pages/ExplorePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AddHousePage from './pages/AddHousePage';
import BookingModal from './components/BookingModal';
import ChatAgent from './components/ChatAgent';

export default function App() {
  const [activePage, setActivePage] = useState('explore');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');
  const [selectedHouseForBooking, setSelectedHouseForBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync bookings count from localStorage
  const updateBookingsCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      setBookingsCount(stored.length);
    } catch {
      setBookingsCount(0);
    }
  };

  useEffect(() => {
    updateBookingsCount();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenChat = (prompt = '') => {
    setInitialChatPrompt(prompt);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setInitialChatPrompt('');
  };

  const handleBookHouse = (house) => {
    setSelectedHouseForBooking(house);
  };

  const handleBookingSuccess = (receipt) => {
    updateBookingsCount();
    showToast(`🎉 Reservation confirmed for ${receipt.house_title}!`);
    // Optionally stay on modal or let user close
  };

  const handleHouseAdded = (newHouse) => {
    showToast(`Listing "${newHouse.title}" published!`);
    setActivePage('explore');
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100 bg-light">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="position-fixed top-0 start-50 translate-middle-x mt-3 toast-notification alert alert-success shadow-lg rounded-pill py-2 px-4 d-flex align-items-center gap-2"
          style={{ zIndex: 2000 }}
        >
          <i className="bi bi-check-circle-fill fs-5"></i>
          <span className="fw-semibold">{toastMessage}</span>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => setToastMessage(null)}
          ></button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
        bookingsCount={bookingsCount}
        onOpenChat={() => handleOpenChat()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Layout: Sidebar + Content */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          bookingsCount={bookingsCount}
          onOpenChat={() => handleOpenChat()}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Page Views */}
        <main className="main-content-area flex-grow-1 overflow-y-auto">
          {activePage === 'explore' && (
            <ExplorePage
              onBookHouse={handleBookHouse}
              onAskAI={handleOpenChat}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activePage === 'bookings' && (
            <MyBookingsPage
              onNavigateExplore={() => setActivePage('explore')}
            />
          )}

          {activePage === 'add-house' && (
            <AddHousePage
              onHouseAdded={handleHouseAdded}
            />
          )}
        </main>
      </div>

      {/* Floating Gemini AI Launcher Button (when chat is closed) */}
      {!chatOpen && (
        <button
          type="button"
          className="btn btn-primary btn-lg rounded-circle shadow-lg floating-ai-btn d-flex align-items-center justify-content-center"
          onClick={() => handleOpenChat()}
          title="Chat with Gemini AI Agent"
        >
          <i className="bi bi-stars fs-3"></i>
        </button>
      )}

      {/* Booking Modal with Date Picker, Lease Duration & PayPal Buttons */}
      <BookingModal
        house={selectedHouseForBooking}
        isOpen={Boolean(selectedHouseForBooking)}
        onClose={() => setSelectedHouseForBooking(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Gemini AI Conversational Assistant Drawer */}
      <ChatAgent
        isOpen={chatOpen}
        onClose={handleCloseChat}
        onBookHouse={(house) => {
          handleCloseChat();
          handleBookHouse(house);
        }}
        initialPrompt={initialChatPrompt}
      />

    </div>
  );
}
