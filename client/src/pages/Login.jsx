import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, loginWithGoogle, showToast } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const loadGoogle = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) return;
          try {
            const data = await loginWithGoogle(response.credential);
            if (data.role === 'admin') navigate('/admin');
            else navigate('/profile');
          } catch (err) {
            console.log('Google login failed:', err.message);
          }
        }
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with'
      });
    };

    if (window.google?.accounts?.id) {
      loadGoogle();
      return;
    }

    const existingScript = document.getElementById('google-identity-script');
    if (existingScript) {
      existingScript.addEventListener('load', loadGoogle);
      return () => existingScript.removeEventListener('load', loadGoogle);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-identity-script';
    script.async = true;
    script.defer = true;
    script.onload = loadGoogle;
    document.body.appendChild(script);

    return () => script.removeEventListener('load', loadGoogle);
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await login(trimmedEmail, password);
      if (data) {
        showToast('Login successful!', 'success');
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      console.log('Login failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center" style={{ minHeight: '75vh', padding: '40px 24px' }}>
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', padding: '30px' }}
      >
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>

          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
            <LogIn size={24} />
          </div>
          <h2>Member Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Enter email to access your community dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                style={{ paddingLeft: '36px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                style={{ paddingLeft: '36px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '16px', marginBottom: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          OR
        </div>
        <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center' }} />
        {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Set `VITE_GOOGLE_CLIENT_ID` to enable Google login.
          </p>
        )}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Register here</Link>
        </div>
      </motion.div>
    </div>
  );
};


export default Login;
