import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Search, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Members = () => {
  const { t, language } = useLanguage();
  const location = useLocation();

  const getQueryParam = (name) => {
    const params = new URLSearchParams(location.search);
    return params.get(name) || '';
  };

  const [search, setSearch] = useState(getQueryParam('search'));
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [gotra, setGotra] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (city) queryParams.append('city', city);
      if (profession) queryParams.append('profession', profession);
      if (education) queryParams.append('education', education);
      if (gotra) queryParams.append('gotra', gotra);

      const response = await apiCall(`/api/users/directory?${queryParams.toString()}`);
      if (response.success) {
        setMembers(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, city, profession, education, gotra]);

  const handleClearFilters = () => {
    setSearch('');
    setCity('');
    setProfession('');
    setEducation('');
    setGotra('');
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('members')}</h1>
      <p className="section-subtitle">
        {language === 'en' 
          ? 'Connect with approved Samaj members. Filter by gotra, location, and professional sectors.' 
          : 'स्वीकृत समाज के सदस्यों से जुड़ें। गोत्र, स्थान और व्यावसायिक क्षेत्रों के आधार पर फ़िल्टर करें।'}
      </p>

      {/* Directory Search and Filter Panel */}
      <motion.div 
        className="glass-card" 
        style={{ padding: '24px', marginBottom: '30px' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{language === 'en' ? 'Search Name' : 'नाम खोजें'}</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Name/Keywords..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('cityFilter')}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Noida" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('profFilter')}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Software" 
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('gotraFilter')}</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Bhadana" 
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
            />
          </div>

          <button 
            className="btn btn-secondary" 
            onClick={handleClearFilters}
            style={{ height: '46px' }}
          >
            {language === 'en' ? 'Reset Filters' : 'फ़िल्टर हटाएं'}
          </button>
        </div>
      </motion.div>

      {/* Directory Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : members.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <Users size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>{t('noResults')}</p>
        </div>
      ) : (
        <motion.div className="grid-3" variants={containerVariants} initial="hidden" animate="visible">
          {members.map((member) => (
            <motion.div key={member._id} className="glass-card member-card" variants={itemVariants} whileHover={{ y: -4 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
                  />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.25rem', border: '2px solid var(--accent)' }}>
                    {member.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{member.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase' }}>
                    Gotra: {member.familyDetails?.gotra || 'N/A'}
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {member.occupation?.city && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{member.occupation.city}</span>
                  </div>
                )}

                {member.occupation?.title && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{member.occupation.title} {member.occupation.company ? `at ${member.occupation.company}` : ''}</span>
                  </div>
                )}

                {member.education?.degree && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GraduationCap size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{member.education.degree} {member.education.institution ? `from ${member.education.institution}` : ''}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Members;

