import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Landmark, Heart, Award, ShieldCheck, Download, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Donations = () => {
  const { user, showToast } = useAuth();
  const { language, t } = useLanguage();

  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ totalRaised: 385000, totalDonors: 24 });
  const [loading, setLoading] = useState(true);

  // Form states
  const [donorName, setDonorName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Payment/Checkout Modal states
  const [pendingDonation, setPendingDonation] = useState(null); // stores order details before payment
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null); // stores verified donation details for printing

  const fetchDonationsData = async () => {
    setLoading(true);
    try {
      const leaderboardRes = await apiCall('/api/donations/leaderboard');
      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data);
      }
      
      const statsRes = await apiCall('/api/donations/stats');
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.log('Error fetching donations data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationsData();
  }, []);

  const handleInitiateDonation = async (e) => {
    e.preventDefault();
    if (!donorName || !email || !amount || Number(amount) <= 0) {
      showToast('Name, Email, and a positive amount are required.', 'error');
      return;
    }

    try {
      const response = await apiCall('/api/donations/donate', {
        method: 'POST',
        body: JSON.stringify({
          donorName,
          email,
          phone,
          amount: Number(amount),
          message,
          isAnonymous
        })
      });

      if (response.success) {
        setPendingDonation(response.data);
        setShowCheckout(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to initiate donation', 'error');
    }
  };

  const handleSimulatePayment = async (success) => {
    if (!pendingDonation) return;

    try {
      const response = await apiCall('/api/donations/verify', {
        method: 'POST',
        body: JSON.stringify({
          donationId: pendingDonation._id,
          mockSuccess: success
        })
      });

      if (response.success) {
        showToast('Payment simulated and verified successfully!', 'success');
        setReceipt(response.data);
        // Clear form inputs
        setAmount(''); setMessage(''); setIsAnonymous(false);
        setShowCheckout(false);
        setPendingDonation(null);
        fetchDonationsData();
      }
    } catch (err) {
      showToast(err.message || 'Payment simulation failed', 'error');
      setShowCheckout(false);
      setPendingDonation(null);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('donations')} Portal</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Contribute to the welfare of the Gujjar Samaj. Funds are used directly for scholarships and libraries.'
          : 'गुर्जर समाज के कल्याण में योगदान दें। एकत्रित धन का उपयोग सीधे छात्रवृत्ति और पुस्तकालयों के लिए किया जाता है।'}
      </p>

      {/* Stats display */}
      <motion.div 
        className="grid-2" 
        style={{ gap: '24px', marginBottom: '40px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px' }} variants={itemVariants} whileHover={{ y: -4 }}>
          <Landmark size={40} style={{ color: 'var(--accent)' }} />
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'en' ? 'Total Funds Raised' : 'कुल एकत्रित धनराशि'}
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginTop: '4px' }}>₹{stats.totalRaised?.toLocaleString('en-IN')}</h2>
          </div>
        </motion.div>
        
        <motion.div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px' }} variants={itemVariants} whileHover={{ y: -4 }}>
          <Heart size={40} style={{ color: 'var(--danger)' }} />
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
              {language === 'en' ? 'Total Donations Received' : 'कुल प्राप्त योगदान'}
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '4px' }}>{stats.totalDonors} Transactions</h2>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '40px' }}>
        
        {/* Left Column: Online Donation Form */}
        <motion.div 
          className="glass-card" 
          style={{ padding: '30px' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={24} /> Support Samaj Welfare
          </h2>

          <form onSubmit={handleInitiateDonation}>
            <div className="form-group">
              <label className="form-label">Donor Full Name *</label>
              <input type="text" className="form-control" required value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Name of Donor" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Donation Amount (INR) *</label>
              <input type="number" className="form-control" required min="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ Amount (Min 1)" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent)' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Blessing / Message (Optional)</label>
              <textarea className="form-control" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message for the Samaj board..."></textarea>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              <label htmlFor="anonymous" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                Donate anonymously (Hide name from public leaderboards)
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Proceed to Donate Online
            </button>
          </form>
        </motion.div>

        {/* Right Column: Donation Leaderboard */}
        <motion.div 
          className="glass-card" 
          style={{ padding: '30px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} /> Donor Leaderboard
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Recognizing the top generous contributions made towards the Samaj community fund (excluding anonymous transfers).
          </p>

          {loading ? (
            <div className="flex-center" style={{ padding: '30px' }}>
              <div className="spinner"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No contributions have been logged yet.</p>
          ) : (
            <motion.div 
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {leaderboard.map((donor, idx) => (
                <motion.div 
                  key={idx} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, x: 2 }}
                  style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: idx === 0 ? 'var(--warning)' : 'var(--border)', color: idx === 0 ? 'white' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                      #{idx + 1}
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{donor.donorName}</strong>
                  </div>
                  <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>₹{donor.totalAmount?.toLocaleString('en-IN')}</strong>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 2. Simulated Razorpay Checkout Modal */}
      <AnimatePresence>
        {showCheckout && pendingDonation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="glass-card" 
              style={{ width: '100%', maxWidth: '400px', padding: '30px', background: 'var(--bg-secondary)', borderTop: '8px solid var(--accent)', textAlign: 'center' }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Razorpay Payment Gateway</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Simulation Environment</p>

              <div style={{ margin: '24px 0', border: '1px solid var(--border)', padding: '20px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}>
                <div><strong>Merchant:</strong> Gujjar Samaj Trust</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)', margin: '12px 0' }}>
                  ₹{pendingDonation.amount}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Donor: {pendingDonation.donorName} <br />
                  {pendingDonation.email}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => handleSimulatePayment(true)} style={{ width: '100%', background: 'var(--success)' }}>
                  Simulate Success Payment
                </button>
                <button className="btn btn-danger" onClick={() => handleSimulatePayment(false)} style={{ width: '100%' }}>
                  Simulate Cancel / Fail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Donation Receipt Modal */}
      <AnimatePresence>
        {receipt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="glass-card" 
              style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '30px', background: 'var(--bg-secondary)', borderTop: '8px solid var(--success)', textAlign: 'center' }}
            >
              
              <button onClick={() => setReceipt(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>

              {/* Receipt Graphic */}
              <div style={{ border: '2px solid var(--border)', borderRadius: '12px', padding: '24px', backgroundColor: 'var(--bg-primary)', margin: '12px 0 20px 0', textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <ShieldCheck size={36} style={{ color: 'var(--success)', marginBottom: '8px' }} />
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>DONATION RECEIPT</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gujjar Samaj Seva Trust (Regd.)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Receipt No:</span> <strong>{receipt._id?.slice(-8).toUpperCase()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Transaction ID:</span> <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{receipt.paymentId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Date:</span> <span>{new Date(receipt.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px dashed var(--border)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Donor Name:</span> <strong>{receipt.isAnonymous ? 'Anonymous' : receipt.donorName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Email:</span> <span>{receipt.email}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px dashed var(--border)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', color: 'var(--success)', fontWeight: '800' }}>
                    <span>Amount Donated:</span> <span>₹{receipt.amount}</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Thank you for contributing to the community welfare fund!
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => window.print()} style={{ width: '100%' }}>
                <Download size={18} /> Print Donation Receipt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Donations;
