import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onSuccess }) {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setOtp('');
    setNewPassword('');
    setForgotStep(1);
    setDevOtpHint(null);
  };

  const handleTabChange = (tab) => {
    resetForm();
    setActiveTab(tab);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
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
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
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
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 28, 61, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
          
          {/* Header */}
          <div className="p-4 pb-0 d-flex align-items-center justify-content-between">
            <h5 className="fw-bold text-dark mb-0">
              {activeTab === 'login' ? 'Sign In' : activeTab === 'register' ? 'Create an account' : 'Reset password'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={loading}></button>
          </div>

          {/* Segmented Control */}
          {activeTab !== 'forgot' && (
            <div className="px-4 pt-3">
              <div className="d-flex p-1 rounded-pill" style={{ backgroundColor: '#EDF1F5' }}>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill py-1 fw-semibold border-0 ${
                    activeTab === 'login' ? 'bg-white shadow-sm text-dark' : 'text-muted'
                  }`}
                  onClick={() => handleTabChange('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`btn btn-sm flex-grow-1 rounded-pill py-1 fw-semibold border-0 ${
                    activeTab === 'register' ? 'bg-white shadow-sm text-dark' : 'text-muted'
                  }`}
                  onClick={() => handleTabChange('register')}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-4 pt-3">
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
                  className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0070BA' }}
                  disabled={loading}
                >
                  {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                  <span>Sign In</span>
                </button>
              </form>
            )}

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
                  className="btn text-white w-100 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0070BA' }}
                  disabled={loading}
                >
                  {loading && <div className="spinner-border spinner-border-sm" role="status"></div>}
                  <span>Create account</span>
                </button>
              </form>
            )}

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
                      style={{ backgroundColor: '#0070BA' }}
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
                    {devOtpHint && (
                      <div className="alert alert-info py-2 px-3 small rounded-3 mb-3 border-0">
                        Code: <strong>{devOtpHint}</strong>
                      </div>
                    )}
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
                      style={{ backgroundColor: '#0070BA' }}
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