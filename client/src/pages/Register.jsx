import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, Phone, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // 1. Check empty
    if (!trimmedName || !trimmedEmail || !password || !trimmedPhone) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // 2. Name validation
    if (trimmedName.length < 2) {
      showToast('Name must be at least 2 characters long.', 'error');
      return;
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // 4. Phone validation (10 digits Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    // 5. Password validation
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await register(trimmedName, trimmedEmail, password, trimmedPhone);
      if (data) {
        showToast('Registration successful!', 'success');
        navigate('/profile');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
      console.log('Registration failed:', err.message);
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
            <UserPlus size={24} />
          </div>
          <h2>Join Samaj Community</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
            Submit membership registration form
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First Last"
                style={{ paddingLeft: '36px' }}
              />
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

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
            <label className="form-label">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone"
                style={{ paddingLeft: '36px' }}
              />
              <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Create Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="form-control" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                style={{ paddingLeft: '36px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Submitting Form...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

