import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { forgotPassword, resetPassword } from '../services/api';

export default function LoginPage() {
  const { login, register } = useAuth();
  const { currentPath, navigate } = useRouter();

  const getTabFromPath = (path) => {
    if (path === '/register') return 'register';
    if (path === '/forgot-password') return 'forgot';
    return 'login';
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(currentPath));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setActiveTab(getTabFromPath(currentPath));
  }, [currentPath]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password Recovery Fields
  const [forgotStep, setForgotStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devOtpHint, setDevOtpHint] = useState(null);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab) => {
    resetMessages();
    setActiveTab(tab);
    setForgotStep(1);
    setDevOtpHint(null);

    if (tab === 'register') navigate('/register');
    else if (tab === 'forgot') navigate('/forgot-password');
    else navigate('/login');
  };

  // 1. Sign In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!email || !password) {
      setErrorMessage('Enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!name || !email || !password) {
      setErrorMessage('Full name, email, and password are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, phone, password });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!email) {
      setErrorMessage('Enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setSuccessMessage(res.message || 'Verification code sent to your email.');
      setForgotStep(2);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    if (!otp || !newPassword) {
      setErrorMessage('Enter the 6-digit code and your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({ email, otp, newPassword });
      setSuccessMessage(res.message || 'Password reset successfully.');
      setTimeout(() => handleTabChange('login'), 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: '#F5F7FA' }}>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden w-100" style={{ maxWidth: 940, backgroundColor: '#FFFFFF' }}>
        <div className="row g-0">

          {/* Left Brand Panel — PayPal Deep Navy Aesthetic */}
          <div
            className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 text-white"
            style={{ backgroundColor: '#001C3D' }}
          >
            <div>
              {/* Brand Header */}
              <div className="d-flex align-items-center gap-2 mb-5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 40, height: 40, backgroundColor: '#0070BA' }}
                >
                  <i className="bi bi-houses-fill fs-5"></i>
                </div>
                <span className="fs-5 fw-bold tracking-tight">NyumbaAI</span>
              </div>

              <h2 className="fw-bold mb-3" style={{ letterSpacing: '-0.5px' }}>
                Rental discovery, powered by AI.
              </h2>
              <p className="text-secondary mb-4 small" style={{ color: '#A6B6C8' }}>
                Search homes in real-time, speak with our AI agent, and secure 15-minute reservation holds using PayPal.
              </p>

              <div className="d-flex flex-column gap-3 pt-2">
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-shield-check fs-5" style={{ color: '#00CF92' }}></i>
                  <span className="small text-light">Direct caretaker and landlord contacts</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-chat-dots fs-5" style={{ color: '#0070BA' }}></i>
                  <span className="small text-light">Conversational search with Gemini</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-paypal fs-5" style={{ color: '#0070BA' }}></i>
                  <span className="small text-light">Secure deposit holds via PayPal Sandbox</span>
                </div>
              </div>
            </div>

            <div className="small text-muted border-top border-secondary border-opacity-25 pt-3" style={{ fontSize: '12px' }}>
              Protected by PayPal Developer Platform
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">

            {/* Mobile Brand Header */}
            <div className="d-lg-none d-flex align-items-center gap-2 mb-4">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white"
                style={{ width: 36, height: 36, backgroundColor: '#001C3D' }}
              >
                <i className="bi bi-houses-fill fs-6"></i>
              </div>
              <span className="fw-bold fs-5">NyumbaAI</span>
            </div>

            {/* Segmented Control Tabs */}
            {activeTab !== 'forgot' && (
              <div className="d-flex p-1 rounded-pill mb-4" style={{ backgroundColor: '#EDF1F5' }}>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill py-2 fw-semibold border-0 ${
                    activeTab === 'login' ? 'bg-white shadow-sm text-dark' : 'text-muted'
                  }`}
                  onClick={() => handleTabChange('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill py-2 fw-semibold border-0 ${
                    activeTab === 'register' ? 'bg-white shadow-sm text-dark' : 'text-muted'
                  }`}
                  onClick={() => handleTabChange('register')}
                >
                  Register
                </button>
              </div>
            )}

            {/* Title */}
            <h4 className="fw-bold text-dark mb-1">
              {activeTab === 'login' ? 'Sign In' : activeTab === 'register' ? 'Create an account' : 'Reset password'}
            </h4>
            <p className="text-muted small mb-4">
              {activeTab === 'login'
                ? 'Enter your account details below.'
                : activeTab === 'register'
                ? 'Enter your details to start exploring.'
                : 'Enter your email to receive a recovery code.'}
            </p>

            {/* Alerts */}
            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3 border-0 d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success py-2 px-3 rounded-3 small mb-3 border-0 d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill"></i>
                <span>{successMessage}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-dark mb-0">Password</label>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none small"
                      style={{ color: '#0070BA', fontSize: '13px' }}
                      onClick={() => handleTabChange('forgot')}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#001C3D' }}
                  disabled={loading}
                >
                  {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                  <span>Sign In</span>
                </button>

                <div className="text-center text-muted" style={{ fontSize: '13px' }}>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none fw-semibold"
                    style={{ color: '#0070BA', fontSize: '13px' }}
                    onClick={() => handleTabChange('register')}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Full Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Email</label>
                  <input
                    type="email"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark">Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-dark">Password</label>
                  <input
                    type="password"
                    className="form-control rounded-3 py-2 px-3"
                    style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm mb-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#001C3D' }}
                  disabled={loading}
                >
                  {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                  <span>Create account</span>
                </button>

                <div className="text-center text-muted" style={{ fontSize: '13px' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none fw-semibold"
                    style={{ color: '#0070BA', fontSize: '13px' }}
                    onClick={() => handleTabChange('login')}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}

            {/* 3. FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <div>
                {forgotStep === 1 ? (
                  <form onSubmit={handleSendOtp}>
                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">Registered Email</label>
                      <input
                        type="email"
                        className="form-control rounded-3 py-2 px-3"
                        style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm mb-2 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: '#001C3D' }}
                      disabled={loading}
                    >
                      {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                      <span>Send code</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-link text-muted w-100 py-2 text-decoration-none small"
                      onClick={() => handleTabChange('login')}
                    >
                      Back to sign in
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                   
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark">6-Digit Code</label>
                      <input
                        type="text"
                        className="form-control text-center font-monospace fs-5 fw-bold rounded-3"
                        style={{ letterSpacing: '4px' }}
                        maxLength="6"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-dark">New Password</label>
                      <input
                        type="password"
                        className="form-control rounded-3 py-2 px-3"
                        style={{ borderColor: '#CBD5E1', fontSize: '14px' }}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm mb-2 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: '#001C3D' }}
                      disabled={loading}
                    >
                      {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                      <span>Reset password</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-link text-muted w-100 py-2 text-decoration-none small"
                      onClick={() => setForgotStep(1)}
                    >
                      Change email
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}