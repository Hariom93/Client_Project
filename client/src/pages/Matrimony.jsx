import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Search, Heart, User, MapPin, Phone, CheckCircle, Mail, HelpCircle, Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Matrimony = () => {
  const { user, showToast } = useAuth();
  const { language, t } = useLanguage();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [gotra, setGotra] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  // Selected profile details modal state
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [myProfile, setMyProfile] = useState(null);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (gender) queryParams.append('gender', gender);
      if (city) queryParams.append('city', city);
      if (gotra) queryParams.append('gotra', gotra);
      if (minAge) queryParams.append('minAge', minAge);
      if (maxAge) queryParams.append('maxAge', maxAge);

      const response = await apiCall(`/api/matrimony?${queryParams.toString()}`);
      if (response.success) {
        setProfiles(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load matrimonial profiles.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProfile = async () => {
    try {
      const response = await apiCall('/api/matrimony/myprofile');
      if (response.success) {
        setMyProfile(response.data);
      }
    } catch (err) {
      console.log('No matrimonial profile exists for this user yet.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfiles();
      fetchMyProfile();
    }
  }, [gender, city, gotra, minAge, maxAge]);

  const handleSendRequest = async (profileId) => {
    try {
      const response = await apiCall(`/api/matrimony/profile/${profileId}/request`, {
        method: 'POST'
      });

      if (response.success) {
        showToast('Contact request sent successfully!', 'success');
        fetchProfiles(); // Refresh to update status
        
        // Update modal state if open
        if (selectedProfile && selectedProfile._id === profileId) {
          setSelectedProfile(prev => ({
            ...prev,
            contactRequests: [...(prev.contactRequests || []), { user: user._id, status: 'pending' }]
          }));
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to send request', 'error');
    }
  };

  const getRequestStatus = (profile) => {
    if (!user) return null;
    const req = profile.contactRequests?.find(r => r.user && r.user.toString() === user._id);
    return req ? req.status : null;
  };

  const calculateAge = (dobString) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <Lock size={48} style={{ color: 'var(--accent)', marginBottom: '20px' }} />
          <h2>Protected Section</h2>
          <p style={{ margin: '16px 0 24px 0', color: 'var(--text-secondary)' }}>
            To safeguard community privacy, the Matrimonial matching portal is restricted to registered and admin-approved members only.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login / Register to Access</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="page-header-row">
        <div>
          <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>{t('matrimony')} Rista Portal</h1>
          <p className="section-subtitle" style={{ textAlign: 'left', margin: '8px 0 0 0' }}>
            Find matches within the Gujjar Samaj with respect to gotras and location.
          </p>
        </div>
        <Link to="/profile" className="btn btn-primary">
          {myProfile ? 'Edit My Matrimony Profile' : 'Create My Matrimony Profile'}
        </Link>
      </div>

      {/* Filter panel */}
      <motion.div className="glass-card" style={{ padding: '24px', marginBottom: '30px' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="filter-panel-grid">
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Seeking Gender</label>
            <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">All Candidates</option>
              <option value="male">Brides (Looking for Groom)</option>
              <option value="female">Grooms (Looking for Bride)</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('cityFilter')}</label>
            <input type="text" className="form-control" placeholder="e.g. Noida" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Gotra (Self/Mother)</label>
            <input type="text" className="form-control" placeholder="e.g. Chechi" value={gotra} onChange={(e) => setGotra(e.target.value)} />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Min Age</label>
            <input type="number" className="form-control" placeholder="18" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Max Age</label>
            <input type="number" className="form-control" placeholder="40" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
          </div>

          <button className="btn btn-secondary" onClick={() => { setGender(''); setCity(''); setGotra(''); setMinAge(''); setMaxAge(''); }} style={{ height: '46px' }}>
            Clear Filters
          </button>
        </div>
      </motion.div>

      {/* Candidates list */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : profiles.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px' }}>
          <Heart size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>No candidates match your current filter settings.</p>
        </div>
      ) : (
        <motion.div className="grid-3" variants={containerVariants} initial="hidden" animate="visible">
          {profiles.map((p) => {
            const status = getRequestStatus(p);
            return (
              <motion.div key={p._id} className="glass-card" variants={itemVariants} whileHover={{ y: -4 }} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {p.photo ? (
                    <img src={p.photo} alt="Candidate" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
                  ) : (
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent)' }}>
                      <User size={30} />
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{p.user?.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {calculateAge(p.dob)} Yrs • {p.height || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="matrimony-details-grid" style={{ fontSize: '0.85rem', backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '6px' }}>
                  <div><strong>Gotra:</strong> {p.gotraSelf}</div>
                  <div><strong>Mother Gotra:</strong> {p.gotraMother}</div>
                  <div><strong>Education:</strong> {p.education || 'N/A'}</div>
                  <div><strong>City:</strong> {p.city || 'N/A'}</div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{p.aboutMe ? p.aboutMe.slice(0, 80) + '...' : 'Looking for a compatible partner.'}"
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flexGrow: 1 }} onClick={() => setSelectedProfile(p)}>
                    View Full Profile
                  </button>

                  {status === 'approved' ? (
                    <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={14} /> Approved
                    </span>
                  ) : status === 'pending' ? (
                    <span className="badge badge-pending">Requested</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleSendRequest(p._id)}>
                      Request Contact
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
        <div className="modal-overlay">
          <div className="glass-card animate-fade-up modal-card" style={{ maxWidth: '500px', borderTop: '8px solid var(--accent)' }}>
            <button onClick={() => setSelectedProfile(null)} className="modal-close-btn">
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {selectedProfile.photo ? (
                <img src={selectedProfile.photo} alt="Candidate" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px auto', border: '3px solid var(--accent)' }} />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', border: '3px solid var(--accent)' }}>
                  <User size={60} />
                </div>
              )}
              <h2>{selectedProfile.user?.name}</h2>
              <p style={{ color: 'var(--accent)', fontWeight: '600' }}>Seeking: {selectedProfile.gender === 'male' ? 'Groom' : 'Bride'}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
              <div className="glass-card matrimony-details-grid" style={{ padding: '16px', background: 'var(--bg-primary)' }}>
                <div><strong>Age:</strong> {calculateAge(selectedProfile.dob)} Yrs</div>
                <div><strong>Height:</strong> {selectedProfile.height || 'N/A'}</div>
                <div><strong>Self Gotra:</strong> {selectedProfile.gotraSelf}</div>
                <div><strong>Mother Gotra:</strong> {selectedProfile.gotraMother}</div>
                <div><strong>Education:</strong> {selectedProfile.education}</div>
                <div><strong>Profession:</strong> {selectedProfile.profession}</div>
                <div><strong>Annual Income:</strong> {selectedProfile.income || 'N/A'}</div>
                <div><strong>City:</strong> {selectedProfile.city}</div>
              </div>

              <div>
                <strong>About Me:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>{selectedProfile.aboutMe || 'No description provided.'}</p>
              </div>

              {/* Secure Contact Details Panel */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--accent-light)' }}>
                {getRequestStatus(selectedProfile) === 'approved' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <CheckCircle size={16} /> Contact Details Authorized
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} /> <span>{selectedProfile.contactNumber || selectedProfile.user?.phone || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} /> <span>{selectedProfile.user?.email}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <Lock size={20} style={{ color: 'var(--accent-dark)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Candidate phone number and email are encrypted. Send a request to view them.
                    </p>
                    {getRequestStatus(selectedProfile) === 'pending' ? (
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', pointerEvents: 'none' }}>
                        Request Pending Approval
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => handleSendRequest(selectedProfile._id)}>
                        Submit Request
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matrimony;
