import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const fillDemoAccount = () => {
    setEmail('alex@novasupply.com');
    setPassword('Password123!');
    setErrorMsg(null);
  };

  return (
    <div style={{ padding: '4rem 0 6rem', minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-olive)', fontWeight: 600, marginBottom: '0.35rem' }}>
              Client Sign In
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Sign in to manage your orders, shipping addresses, and saved preferences.
            </p>
          </div>

          {/* Quick Demo Fill Helper */}
          <button
            type="button"
            onClick={fillDemoAccount}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--accent-olive-light)',
              color: 'var(--accent-olive)',
              border: '1px solid rgba(61, 71, 52, 0.2)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              transition: 'background-color 0.2s'
            }}
          >
            <Sparkles size={14} /> Quick Demo Login (Alex Vane)
          </button>

          {errorMsg && (
            <div
              style={{
                backgroundColor: 'var(--status-danger-bg)',
                border: '1px solid var(--status-danger)',
                color: 'var(--status-danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                marginBottom: '1.25rem'
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@novasupply.com"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 600 }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', padding: '2px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-full"
              style={{ padding: '0.9rem', marginTop: '0.5rem' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          {/* Footer Note */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Do not have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--accent-olive)', fontWeight: 600, textDecoration: 'underline' }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
