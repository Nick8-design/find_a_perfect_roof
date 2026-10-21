import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExplorePage from './pages/ExplorePage';
import MyBookingsPage from './pages/MyBookingsPage';

import LoginPage from './pages/LoginPage';
import BookingModal from './components/BookingModal';
import ChatAgent from './components/ChatAgent';
import ProfileModal from './components/ProfileModal';
import { getMyBookings } from './services/api';

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const { currentPath, navigate } = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState('');
  const [selectedHouseForBooking, setSelectedHouseForBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Derive activePage directly from current URL pathname
  const activePage = (() => {
    if (currentPath === '/bookings' || currentPath === '/my-bookings') return 'bookings';
    if (currentPath === '/add-house' || currentPath === '/list-property' || currentPath === '/list-house') return 'add-house';
    return 'explore';
  })();

  const handleNavigatePage = (page) => {
    if (page === 'bookings') {
      navigate('/bookings');
    } else if (page === 'add-house') {
      navigate('/add-house');
    } else {
      navigate('/explore');
    }
  };

  // Route Guard: If not logged in, enforce URL redirect to /login (or /register /forgot-password)
  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/forgot-password') {
        navigate('/login', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, currentPath, navigate]);

  // Route Guard: If logged in, redirect away from /login, /register, /forgot-password or root / to /explore
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (currentPath === '/login' || currentPath === '/register' || currentPath === '/forgot-password' || currentPath === '/') {
        navigate('/explore', { replace: true });
      }
    }
  }, [loading, isAuthenticated, user, currentPath, navigate]);

  // Sync bookings count from backend API or local storage
  const updateBookingsCount = async () => {
    try {
      if (user?.id) {
        const res = await getMyBookings(user.id);
        if (res.success && Array.isArray(res.bookings)) {
          setBookingsCount(res.bookings.length);
          return;
        }
      }
      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      setBookingsCount(stored.length);
    } catch {
      const stored = JSON.parse(localStorage.getItem('confirmed_bookings') || '[]');
      setBookingsCount(stored.length);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      updateBookingsCount();
    }
  }, [user, isAuthenticated]);

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
    showToast(`🎉 Reservation confirmed for ${receipt.house_title || 'house'}!`);
  };

  const handleHouseAdded = (newHouse) => {
    showToast(`Listing "${newHouse.title}" published!`);
    handleNavigatePage('explore');
  };

  // 1. Initial Auth Loading Screen
  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="fw-semibold text-secondary">Loading ...</div>
      </div>
    );
  }

  // 2. Strict Authentication Gate: If unauthenticated, render dedicated LoginPage (no dashboard / exploration)
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

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

      {/* Top Navbar with Sidebar Toggle and User Controls */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
        activePage={activePage}
        setActivePage={handleNavigatePage}
        bookingsCount={bookingsCount}
        onOpenChat={() => handleOpenChat()}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main App Layout: Collapsible Sidebar + Content */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={handleNavigatePage}
          bookingsCount={bookingsCount}
          onOpenChat={() => handleOpenChat()}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="main-content-area flex-grow-1 overflow-y-auto">
          {activePage === 'explore' && (
            <ExplorePage
              onBookHouse={handleBookHouse}
              onAskAI={(house) => handleOpenChat(typeof house === 'string' ? house : `Tell me more about ${house.title} in ${house.location}`)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activePage === 'bookings' && (
            <MyBookingsPage
              onNavigateExplore={() => handleNavigatePage('explore')}
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

      {/* Gemini AI Conversational Assistant Drawer (Expandable / Minimized) */}
      <ChatAgent
        isOpen={chatOpen}
        onClose={handleCloseChat}
        onBookHouse={(house) => {
          handleBookHouse(house);
        }}
        initialPrompt={initialChatPrompt}
      />

      {/* User Profile Modal (View & Edit) */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenBookings={() => handleNavigatePage('bookings')}
      />

    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}
