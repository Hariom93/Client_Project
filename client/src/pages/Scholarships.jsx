import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { GraduationCap, Award, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Scholarships = () => {
  const { user, showToast } = useAuth();
  const { language, t } = useLanguage();

  const [meritList, setMeritList] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Form state
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [courseName, setCourseName] = useState('');
  const [percentage, setPercentage] = useState('');
  const [institution, setInstitution] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [incomeCert, setIncomeCert] = useState('');
  const [marksheet, setMarksheet] = useState('');

  const fetchScholarshipData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Merit List (Public)
      const meritResponse = await apiCall('/api/scholarships/meritlist');
      if (meritResponse.success) {
        setMeritList(meritResponse.data);
      }

      // 2. Fetch User Applications (Private)
      if (user) {
        const myAppResponse = await apiCall('/api/scholarships/myapplications');
        if (myAppResponse.success) {
          setMyApplications(myAppResponse.data);
        }
      }
    } catch (err) {
      console.log('Error fetching scholarship data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarshipData();
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!studentName || !courseName || !percentage || !annualIncome) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      const response = await apiCall('/api/scholarships/apply', {
        method: 'POST',
        body: JSON.stringify({
          studentName,
          fatherName,
          phone,
          courseName,
          percentage: Number(percentage),
          institution,
          annualIncome: Number(annualIncome),
          incomeCertificate: incomeCert || 'uploaded_income_cert.pdf',
          marksheet: marksheet || 'uploaded_marksheet.pdf'
        })
      });

      if (response.success) {
        showToast('Scholarship application submitted successfully!', 'success');
        // Reset form inputs
        setStudentName(''); setFatherName(''); setPhone(''); setCourseName(''); setPercentage(''); setInstitution(''); setAnnualIncome(''); setIncomeCert(''); setMarksheet('');
        fetchScholarshipData();
      }
    } catch (err) {
      showToast(err.message || 'Application submission failed', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> Approved</span>;
      case 'verified':
        return <span className="badge badge-pending" style={{ backgroundColor: '#bfdbfe', color: '#1e3a8a' }}>Verified</span>;
      case 'rejected':
        return <span className="badge badge-rejected" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Rejected</span>;
      default:
        return <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Pending Verification</span>;
    }
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('scholarship')} Scheme 2026</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Supporting bright students of the Gujjar community. Apply online with your educational scores and check the merit boards.'
          : 'गुर्जर समुदाय के मेधावी छात्रों का समर्थन करना। अपने शैक्षणिक अंकों के साथ ऑनलाइन आवेदन करें और योग्यता सूची की जांच करें।'}
      </p>

      <div className="grid-2" style={{ alignItems: 'start', gap: '40px' }}>
        
        {/* Left Column: Apply Form & Application History */}
        <div>
          {user ? (
            <>
              {/* Apply Form */}
              <div className="glass-card" style={{ padding: '30px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={24} /> Application Form
                </h2>
                
                <form onSubmit={handleApply}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Student Name *</label>
                      <input type="text" className="form-control" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Full Name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Father's Name *</label>
                      <input type="text" className="form-control" required value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Father's Name" />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input type="text" className="form-control" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit Mobile" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Annual Family Income (₹) *</label>
                      <input type="number" className="form-control" required value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. 240000" />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Course / Class Name *</label>
                      <input type="text" className="form-control" required value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="e.g. 12th Board, B.Tech" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Scored Percentage (%) *</label>
                      <input type="number" step="0.01" className="form-control" required value={percentage} onChange={(e) => setPercentage(e.target.value)} placeholder="e.g. 88.5" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">School / College Name *</label>
                    <input type="text" className="form-control" required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="School or University Name" />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Upload Marksheet (PDF/Image)</label>
                      <input type="file" className="form-control" onChange={(e) => setMarksheet(e.target.files[0]?.name || '')} style={{ padding: '8px 12px' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Income Certificate (PDF/Image)</label>
                      <input type="file" className="form-control" onChange={(e) => setIncomeCert(e.target.files[0]?.name || '')} style={{ padding: '8px 12px' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Submit Scholarship Form
                  </button>
                </form>
              </div>

              {/* My Applications History */}
              <div className="glass-card" style={{ padding: '30px' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={22} /> My Submissions
                </h2>
                
                {myApplications.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You have not submitted any scholarship forms yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myApplications.map((app) => (
                      <div key={app._id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', backgroundColor: 'var(--bg-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <strong>{app.courseName} ({app.percentage}%)</strong>
                          {getStatusBadge(app.status)}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <div>Institution: {app.institution}</div>
                          <div>Submitted on: {new Date(app.createdAt).toLocaleDateString()}</div>
                          {app.feedback && (
                            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent)', color: 'var(--text-primary)' }}>
                              <strong>Trust Feedback:</strong> {app.feedback}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <GraduationCap size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3>Apply for Scholarship</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '12px 0 20px 0' }}>
                To apply for financial student aid schemes, please login to your member account.
              </p>
              <Link to="/login" className="btn btn-primary">Login to Apply</Link>
            </div>
          )}
        </div>

        {/* Right Column: Merit Leaderboard */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} /> Scholarship Merit Board
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            List of approved scholarship recipients ranked by educational percentage marks.
          </p>

          {loading ? (
            <div className="flex-center" style={{ padding: '30px' }}>
              <div className="spinner"></div>
            </div>
          ) : meritList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
              No scholarships have been approved/ranked for the current cycle yet.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-primary)' }}>
                    <th style={{ padding: '12px 8px' }}>Rank</th>
                    <th style={{ padding: '12px 8px' }}>Student</th>
                    <th style={{ padding: '12px 8px' }}>Class</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {meritList.map((student, index) => (
                    <tr key={student._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '700', color: index === 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                        #{index + 1}
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {student.studentName}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {student.courseName}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '700', color: 'var(--accent)' }}>
                        {student.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
