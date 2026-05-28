import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Save, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    avatar: '',
    profileVisibility: 'public',
    familyDetails: { fatherName: '', motherName: '', gotra: '', spouseName: '' },
    occupation: { title: '', company: '', city: '' },
    education: { degree: '', institution: '', graduationYear: '' }
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        profileVisibility: user.profileVisibility || 'public',
        familyDetails: {
          fatherName: user.familyDetails?.fatherName || '',
          motherName: user.familyDetails?.motherName || '',
          gotra: user.familyDetails?.gotra || '',
          spouseName: user.familyDetails?.spouseName || ''
        },
        occupation: {
          title: user.occupation?.title || '',
          company: user.occupation?.company || '',
          city: user.occupation?.city || ''
        },
        education: {
          degree: user.education?.degree || '',
          institution: user.education?.institution || '',
          graduationYear: user.education?.graduationYear || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        education: {
          ...form.education,
          graduationYear: form.education.graduationYear
            ? Number(form.education.graduationYear)
            : null
        }
      };
      await updateProfile(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const statusLabel = {
    approved: language === 'en' ? 'Approved' : 'स्वीकृत',
    pending: language === 'en' ? 'Pending Approval' : 'अनुमोदन लंबित',
    rejected: language === 'en' ? 'Rejected' : 'अस्वीकृत'
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1>
          <User size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
          {language === 'en' ? 'My Profile' : 'मेरी प्रोफाइल'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {language === 'en'
            ? 'Update your directory listing and family details.'
            : 'अपनी निर्देशिका सूची और परिवार विवरण अपडेट करें।'}
        </p>
      </div>

      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Shield size={20} style={{ color: 'var(--accent)' }} />
        <div>
          <strong>{user.email}</strong>
          <span style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>
            {language === 'en' ? 'Status' : 'स्थिति'}: {statusLabel[user.status] || user.status}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ marginBottom: '16px' }}>{language === 'en' ? 'Basic Info' : 'मूल जानकारी'}</h3>
        <div className="form-group">
          <label className="form-label">{language === 'en' ? 'Full Name' : 'पूरा नाम'}</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">{language === 'en' ? 'Phone' : 'फ़ोन'}</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">{language === 'en' ? 'Avatar URL' : 'फोटो URL'}</label>
          <input className="form-control" name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label className="form-label">{language === 'en' ? 'Profile Visibility' : 'प्रोफाइल दृश्यता'}</label>
          <select
            className="form-control"
            name="profileVisibility"
            value={form.profileVisibility}
            onChange={handleChange}
          >
            <option value="public">{language === 'en' ? 'Public' : 'सार्वजनिक'}</option>
            <option value="private">{language === 'en' ? 'Private' : 'निजी'}</option>
          </select>
        </div>

        <h3 style={{ margin: '24px 0 16px' }}>{language === 'en' ? 'Family Details' : 'परिवार विवरण'}</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Father Name' : 'पिता का नाम'}</label>
            <input
              className="form-control"
              value={form.familyDetails.fatherName}
              onChange={(e) => handleNestedChange('familyDetails', 'fatherName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Mother Name' : 'माता का नाम'}</label>
            <input
              className="form-control"
              value={form.familyDetails.motherName}
              onChange={(e) => handleNestedChange('familyDetails', 'motherName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Gotra' : 'गोत्र'}</label>
            <input
              className="form-control"
              value={form.familyDetails.gotra}
              onChange={(e) => handleNestedChange('familyDetails', 'gotra', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Spouse Name' : 'पति/पत्नी का नाम'}</label>
            <input
              className="form-control"
              value={form.familyDetails.spouseName}
              onChange={(e) => handleNestedChange('familyDetails', 'spouseName', e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 16px' }}>{language === 'en' ? 'Occupation' : 'व्यवसाय'}</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Job Title' : 'पद'}</label>
            <input
              className="form-control"
              value={form.occupation.title}
              onChange={(e) => handleNestedChange('occupation', 'title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Company' : 'कंपनी'}</label>
            <input
              className="form-control"
              value={form.occupation.company}
              onChange={(e) => handleNestedChange('occupation', 'company', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'City' : 'शहर'}</label>
            <input
              className="form-control"
              value={form.occupation.city}
              onChange={(e) => handleNestedChange('occupation', 'city', e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ margin: '24px 0 16px' }}>{language === 'en' ? 'Education' : 'शिक्षा'}</h3>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Degree' : 'डिग्री'}</label>
            <input
              className="form-control"
              value={form.education.degree}
              onChange={(e) => handleNestedChange('education', 'degree', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Institution' : 'संस्थान'}</label>
            <input
              className="form-control"
              value={form.education.institution}
              onChange={(e) => handleNestedChange('education', 'institution', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">{language === 'en' ? 'Graduation Year' : 'स्नातक वर्ष'}</label>
            <input
              className="form-control"
              type="number"
              value={form.education.graduationYear}
              onChange={(e) => handleNestedChange('education', 'graduationYear', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: '24px' }}>
          <Save size={18} /> {saving ? (language === 'en' ? 'Saving...' : 'सहेज रहे हैं...') : (language === 'en' ? 'Save Profile' : 'प्रोफाइल सहेजें')}
        </button>
      </form>
    </div>
  );
};

export default Profile;
