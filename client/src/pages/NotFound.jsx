import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="container flex-center" style={{ minHeight: '70vh', padding: '40px 24px', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        <div style={{
          fontSize: '8rem',
          fontWeight: '800',
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          404
        </div>

        <h2 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
