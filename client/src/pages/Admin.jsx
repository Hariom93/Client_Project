import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../services/api';
import '../styles/admin.css';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Heart,
  Bell,
  Newspaper,
  Calendar,
  Image,
  Mail,
  Briefcase,
  HeartHandshake,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const emptyNews = { title: '', content: '', image: '', pinned: false, category: 'general' };
const emptyEvent = { title: '', description: '', date: '', location: '', banner: '' };
const emptyGallery = { title: '', description: '', photos: '', videoUrls: '' };

const Admin = () => {
  const { language } = useLanguage();
  const { user, showToast } = useAuth();
  const en = language === 'en';

  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [donations, setDonations] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [matrimony, setMatrimony] = useState([]);
  const [notifyForm, setNotifyForm] = useState({ type: 'email', title: '', message: '' });
  const [scholFeedback, setScholFeedback] = useState({});

  const [modal, setModal] = useState(null);
  const [editNews, setEditNews] = useState(emptyNews);
  const [editEvent, setEditEvent] = useState(emptyEvent);
  const [editGallery, setEditGallery] = useState(emptyGallery);
  const [editId, setEditId] = useState(null);

  const tabs = [
    { id: 'overview', label: en ? 'Overview' : 'अवलोकन', icon: LayoutDashboard },
    { id: 'users', label: en ? 'Members' : 'सदस्य', icon: Users },
    { id: 'news', label: en ? 'News' : 'समाचार', icon: Newspaper },
    { id: 'events', label: en ? 'Events' : 'कार्यक्रम', icon: Calendar },
    { id: 'gallery', label: en ? 'Gallery' : 'गैलरी', icon: Image },
    { id: 'scholarships', label: en ? 'Scholarships' : 'छात्रवृत्ति', icon: GraduationCap },
    { id: 'donations', label: en ? 'Donations' : 'दान', icon: Heart },
    { id: 'businesses', label: en ? 'Business' : 'व्यापार', icon: Briefcase },
    { id: 'matrimony', label: en ? 'Matrimony' : 'वैवाहिक', icon: HeartHandshake },
    { id: 'contacts', label: en ? 'Inquiries' : 'संपर्क', icon: Mail },
    { id: 'notify', label: en ? 'Broadcast' : 'सूचना', icon: Bell }
  ];

  const loadTabData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await apiCall('/api/admin/stats');
        if (res.success) setStats(res.data);
      } else if (tab === 'users') {
        const res = await apiCall('/api/admin/users');
        if (res.success) setUsers(res.data);
      } else if (tab === 'scholarships') {
        const res = await apiCall('/api/admin/scholarships');
        if (res.success) setScholarships(res.data);
      } else if (tab === 'donations') {
        const res = await apiCall('/api/admin/donations');
        if (res.success) setDonations(res.data);
      } else if (tab === 'news') {
        const res = await apiCall('/api/news');
        if (res.success) setNewsList(res.data);
      } else if (tab === 'events') {
        const res = await apiCall('/api/events');
        if (res.success) setEvents(res.data);
      } else if (tab === 'gallery') {
        const res = await apiCall('/api/gallery');
        if (res.success) setGallery(res.data);
      } else if (tab === 'contacts') {
        const res = await apiCall('/api/contacts');
        if (res.success) setContacts(res.data);
      } else if (tab === 'businesses') {
        const res = await apiCall('/api/businesses');
        if (res.success) setBusinesses(res.data);
      } else if (tab === 'matrimony') {
        const res = await apiCall('/api/admin/matrimony');
        if (res.success) setMatrimony(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [tab, showToast]);

  useEffect(() => {
    loadTabData();
  }, [loadTabData]);

  const updateMemberStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiCall(`/api/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      showToast(en ? `Member ${status}` : `सदस्य ${status}`, 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const updateScholarshipStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiCall(`/api/admin/scholarships/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, feedback: scholFeedback[id] || '' })
      });
      showToast(en ? 'Scholarship updated' : 'छात्रवृत्ति अपडेट', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const saveNews = async (e) => {
    e.preventDefault();
    setActionLoading('news');
    try {
      const body = JSON.stringify(editNews);
      if (editId) {
        await apiCall(`/api/news/${editId}`, { method: 'PUT', body });
        showToast(en ? 'News updated' : 'समाचार अपडेट', 'success');
      } else {
        await apiCall('/api/news', { method: 'POST', body });
        showToast(en ? 'News published' : 'समाचार प्रकाशित', 'success');
      }
      setModal(null);
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm(en ? 'Delete this news?' : 'यह समाचार हटाएं?')) return;
    setActionLoading(id);
    try {
      await apiCall(`/api/news/${id}`, { method: 'DELETE' });
      showToast(en ? 'News deleted' : 'समाचार हटाया', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    setActionLoading('event');
    try {
      const payload = { ...editEvent, date: new Date(editEvent.date).toISOString() };
      const body = JSON.stringify(payload);
      if (editId) {
        await apiCall(`/api/events/${editId}`, { method: 'PUT', body });
        showToast(en ? 'Event updated' : 'कार्यक्रम अपडेट', 'success');
      } else {
        await apiCall('/api/events', { method: 'POST', body });
        showToast(en ? 'Event created' : 'कार्यक्रम बनाया', 'success');
      }
      setModal(null);
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm(en ? 'Delete this event?' : 'यह कार्यक्रम हटाएं?')) return;
    setActionLoading(id);
    try {
      await apiCall(`/api/events/${id}`, { method: 'DELETE' });
      showToast(en ? 'Event deleted' : 'कार्यक्रम हटाया', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const saveGallery = async (e) => {
    e.preventDefault();
    setActionLoading('gallery');
    try {
      const payload = {
        title: editGallery.title,
        description: editGallery.description,
        photos: editGallery.photos.split('\n').map((s) => s.trim()).filter(Boolean),
        videoUrls: editGallery.videoUrls.split('\n').map((s) => s.trim()).filter(Boolean)
      };
      const body = JSON.stringify(payload);
      if (editId) {
        await apiCall(`/api/gallery/${editId}`, { method: 'PUT', body });
        showToast(en ? 'Album updated' : 'एल्बम अपडेट', 'success');
      } else {
        await apiCall('/api/gallery', { method: 'POST', body });
        showToast(en ? 'Album created' : 'एल्बम बनाया', 'success');
      }
      setModal(null);
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteGallery = async (id) => {
    if (!window.confirm(en ? 'Delete album?' : 'एल्बम हटाएं?')) return;
    setActionLoading(id);
    try {
      await apiCall(`/api/gallery/${id}`, { method: 'DELETE' });
      showToast(en ? 'Album deleted' : 'एल्बम हटाया', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const markContactReplied = async (id) => {
    setActionLoading(id);
    try {
      await apiCall(`/api/contacts/${id}/status`, { method: 'PUT' });
      showToast(en ? 'Marked as replied' : 'उत्तर दिया चिह्नित', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBusiness = async (id) => {
    if (!window.confirm(en ? 'Remove business listing?' : 'व्यापार सूची हटाएं?')) return;
    setActionLoading(id);
    try {
      await apiCall(`/api/admin/businesses/${id}`, { method: 'DELETE' });
      showToast(en ? 'Business removed' : 'व्यापार हटाया', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const updateMatrimonyStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await apiCall(`/api/admin/matrimony/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      showToast(en ? 'Profile updated' : 'प्रोफाइल अपडेट', 'success');
      loadTabData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCall('/api/admin/notify', { method: 'POST', body: JSON.stringify(notifyForm) });
      showToast(res.message, 'success');
      setNotifyForm({ type: 'email', title: '', message: '' });
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openNewsModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setEditNews({ title: item.title, content: item.content, image: item.image || '', pinned: item.pinned, category: item.category });
    } else {
      setEditId(null);
      setEditNews(emptyNews);
    }
    setModal('news');
  };

  const openEventModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setEditEvent({
        title: item.title,
        description: item.description || '',
        date: item.date ? new Date(item.date).toISOString().slice(0, 16) : '',
        location: item.location || '',
        banner: item.banner || ''
      });
    } else {
      setEditId(null);
      setEditEvent(emptyEvent);
    }
    setModal('event');
  };

  const openGalleryModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setEditGallery({
        title: item.title,
        description: item.description || '',
        photos: (item.photos || []).join('\n'),
        videoUrls: (item.videoUrls || []).join('\n')
      });
    } else {
      setEditId(null);
      setEditGallery(emptyGallery);
    }
    setModal('gallery');
  };

  const Badge = ({ status }) => <span className={`admin-badge ${status}`}>{status}</span>;

  const TableLoader = () => (
    <div className="admin-empty"><Loader className="spinner" size={28} /></div>
  );

  return (
    <div className="admin-page animate-fade-up">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-title">{en ? 'Admin Menu' : 'एडमिन मेनू'}</p>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`admin-nav-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <Icon size={18} /> {label}
          </button>
        ))}
        <Link to="/" className="admin-nav-btn" style={{ marginTop: '16px' }}>
          <ExternalLink size={18} /> {en ? 'View Site' : 'साइट देखें'}
        </Link>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>{en ? 'Admin Dashboard' : 'एडमिन डैशबोर्ड'}</h1>
            <p>{en ? `Welcome, ${user?.name}` : `स्वागत है, ${user?.name}`}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={loadTabData}>
            <RefreshCw size={16} /> {en ? 'Refresh' : 'रीफ्रेश'}
          </button>
        </div>

        {loading ? (
          <TableLoader />
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div className="admin-stats-grid">
                <div className="admin-stat-card"><h3>{stats.users?.total || 0}</h3><p>{en ? 'Total Members' : 'कुल सदस्य'}</p><small>{stats.users?.pending || 0} {en ? 'pending' : 'लंबित'}</small></div>
                <div className="admin-stat-card"><h3>{stats.users?.approved || 0}</h3><p>{en ? 'Approved' : 'स्वीकृत'}</p></div>
                <div className="admin-stat-card"><h3>₹{(stats.donations?.totalAmount || 0).toLocaleString('en-IN')}</h3><p>{en ? 'Donations' : 'दान'}</p><small>{stats.donations?.count || 0} {en ? 'transactions' : 'लेनदेन'}</small></div>
                <div className="admin-stat-card"><h3>{stats.events || 0}</h3><p>{en ? 'Events' : 'कार्यक्रम'}</p></div>
                <div className="admin-stat-card"><h3>{stats.news || 0}</h3><p>{en ? 'News Posts' : 'समाचार'}</p></div>
                <div className="admin-stat-card"><h3>{stats.gallery || 0}</h3><p>{en ? 'Gallery Albums' : 'गैलरी'}</p></div>
                <div className="admin-stat-card"><h3>{stats.scholarships?.pending || 0}</h3><p>{en ? 'Pending Scholarships' : 'लंबित छात्रवृत्ति'}</p></div>
                <div className="admin-stat-card"><h3>{stats.contacts?.unread || 0}</h3><p>{en ? 'Unread Inquiries' : 'अपठित संदेश'}</p></div>
                <div className="admin-stat-card"><h3>{stats.businesses || 0}</h3><p>{en ? 'Business Listings' : 'व्यापार'}</p></div>
                <div className="admin-stat-card"><h3>{stats.matrimony?.active || 0}</h3><p>{en ? 'Active Matrimony' : 'सक्रिय वैवाहिक'}</p></div>
              </div>
            )}

            {tab === 'users' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Member Approvals' : 'सदस्य अनुमोदन'}</h2></div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Name' : 'नाम'}</th><th>Email</th><th>{en ? 'Phone' : 'फ़ोन'}</th><th>{en ? 'Role' : 'भूमिका'}</th><th>{en ? 'Status' : 'स्थिति'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phone || '—'}</td>
                          <td>{u.role}</td>
                          <td><Badge status={u.status} /></td>
                          <td className="admin-actions">
                            {u.status !== 'approved' && <button type="button" className="btn btn-primary btn-sm" disabled={actionLoading === u._id} onClick={() => updateMemberStatus(u._id, 'approved')}><Check size={14} /></button>}
                            {u.role !== 'admin' && u.status !== 'rejected' && <button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === u._id} onClick={() => updateMemberStatus(u._id, 'rejected')}><X size={14} /></button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'news' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>{en ? 'News & Notices' : 'समाचार व सूचनाएं'}</h2>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openNewsModal()}><Plus size={16} /> {en ? 'Add News' : 'समाचार जोड़ें'}</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Title' : 'शीर्षक'}</th><th>{en ? 'Category' : 'श्रेणी'}</th><th>{en ? 'Pinned' : 'पिन'}</th><th>{en ? 'Date' : 'दिनांक'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {newsList.map((n) => (
                        <tr key={n._id}>
                          <td>{n.title}</td>
                          <td>{n.category}</td>
                          <td>{n.pinned ? '✓' : '—'}</td>
                          <td>{new Date(n.date).toLocaleDateString()}</td>
                          <td className="admin-actions">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openNewsModal(n)}><Pencil size={14} /></button>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === n._id} onClick={() => deleteNews(n._id)}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'events' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>{en ? 'Events Management' : 'कार्यक्रम प्रबंधन'}</h2>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openEventModal()}><Plus size={16} /> {en ? 'Add Event' : 'कार्यक्रम जोड़ें'}</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Title' : 'शीर्षक'}</th><th>{en ? 'Date' : 'दिनांक'}</th><th>{en ? 'Location' : 'स्थान'}</th><th>{en ? 'RSVPs' : 'पंजीकरण'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev._id}>
                          <td>{ev.title}</td>
                          <td>{new Date(ev.date).toLocaleString()}</td>
                          <td>{ev.location || '—'}</td>
                          <td>{ev.registrations?.length || 0}</td>
                          <td className="admin-actions">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEventModal(ev)}><Pencil size={14} /></button>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === ev._id} onClick={() => deleteEvent(ev._id)}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'gallery' && (
              <div className="admin-panel">
                <div className="admin-panel-header">
                  <h2>{en ? 'Gallery Albums' : 'गैलरी एल्बम'}</h2>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openGalleryModal()}><Plus size={16} /> {en ? 'Add Album' : 'एल्बम जोड़ें'}</button>
                </div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Title' : 'शीर्षक'}</th><th>{en ? 'Photos' : 'फोटो'}</th><th>{en ? 'Videos' : 'वीडियो'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {gallery.map((g) => (
                        <tr key={g._id}>
                          <td>{g.title}</td>
                          <td>{g.photos?.length || 0}</td>
                          <td>{g.videoUrls?.length || 0}</td>
                          <td className="admin-actions">
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => openGalleryModal(g)}><Pencil size={14} /></button>
                            <button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === g._id} onClick={() => deleteGallery(g._id)}><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'scholarships' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Scholarship Applications' : 'छात्रवृत्ति आवेदन'}</h2></div>
                {scholarships.length === 0 ? <p className="admin-empty">{en ? 'No applications yet.' : 'कोई आवेदन नहीं।'}</p> : scholarships.map((s) => (
                  <div key={s._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong>{s.studentName}</strong> — {s.courseName} @ {s.institution}
                        <br /><small>{s.user?.email} | {s.percentage}% | Income: ₹{s.annualIncome?.toLocaleString('en-IN')}</small>
                      </div>
                      <Badge status={s.status} />
                    </div>
                    <input type="text" placeholder={en ? 'Feedback (optional)' : 'प्रतिक्रिया'} style={{ marginTop: '8px' }} value={scholFeedback[s._id] || ''} onChange={(e) => setScholFeedback((p) => ({ ...p, [s._id]: e.target.value }))} />
                    <div className="admin-actions" style={{ marginTop: '8px' }}>
                      {['verified', 'approved', 'rejected'].map((st) => (
                        <button key={st} type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === s._id} onClick={() => updateScholarshipStatus(s._id, st)}>{st}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'donations' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Donation Records' : 'दान रिकॉर्ड'}</h2></div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Donor' : 'दाता'}</th><th>{en ? 'Amount' : 'राशि'}</th><th>Email</th><th>{en ? 'Status' : 'स्थिति'}</th><th>{en ? 'Date' : 'दिनांक'}</th></tr></thead>
                    <tbody>
                      {donations.map((d) => (
                        <tr key={d._id}>
                          <td>{d.isAnonymous ? (en ? 'Anonymous' : 'गुमनाम') : d.donorName}</td>
                          <td>₹{d.amount?.toLocaleString('en-IN')}</td>
                          <td>{d.email}</td>
                          <td><Badge status={d.status} /></td>
                          <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'businesses' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Business Directory' : 'व्यापार निर्देशिका'}</h2></div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Name' : 'नाम'}</th><th>{en ? 'Category' : 'श्रेणी'}</th><th>{en ? 'City' : 'शहर'}</th><th>{en ? 'Rating' : 'रेटिंग'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {businesses.map((b) => (
                        <tr key={b._id}>
                          <td>{b.name}</td>
                          <td>{b.category}</td>
                          <td>{b.city || '—'}</td>
                          <td>{b.averageRating || 0} ★</td>
                          <td><button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === b._id} onClick={() => deleteBusiness(b._id)}><Trash2 size={14} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'matrimony' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Matrimony Profiles' : 'वैवाहिक प्रोफाइल'}</h2></div>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>{en ? 'Name' : 'नाम'}</th><th>{en ? 'Gender' : 'लिंग'}</th><th>{en ? 'City' : 'शहर'}</th><th>Gotra</th><th>{en ? 'Status' : 'स्थिति'}</th><th>{en ? 'Actions' : 'कार्रवाई'}</th></tr></thead>
                    <tbody>
                      {matrimony.map((m) => (
                        <tr key={m._id}>
                          <td>{m.user?.name || '—'}</td>
                          <td>{m.gender}</td>
                          <td>{m.city}</td>
                          <td>{m.gotraSelf}</td>
                          <td><Badge status={m.status} /></td>
                          <td className="admin-actions">
                            {m.status !== 'active' && <button type="button" className="btn btn-primary btn-sm" disabled={actionLoading === m._id} onClick={() => updateMatrimonyStatus(m._id, 'active')}>{en ? 'Show' : 'दिखाएं'}</button>}
                            {m.status !== 'hidden' && <button type="button" className="btn btn-secondary btn-sm" disabled={actionLoading === m._id} onClick={() => updateMatrimonyStatus(m._id, 'hidden')}>{en ? 'Hide' : 'छुपाएं'}</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'contacts' && (
              <div className="admin-panel">
                <div className="admin-panel-header"><h2>{en ? 'Contact Inquiries' : 'संपर्क पूछताछ'}</h2></div>
                {contacts.length === 0 ? <p className="admin-empty">{en ? 'No messages.' : 'कोई संदेश नहीं।'}</p> : contacts.map((c) => (
                  <div key={c._id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <strong>{c.name}</strong> <Badge status={c.status} />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.email} — {c.subject}</p>
                    <p style={{ marginTop: '8px' }}>{c.message}</p>
                    {c.status === 'unread' && (
                      <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: '8px' }} disabled={actionLoading === c._id} onClick={() => markContactReplied(c._id)}>
                        <Check size={14} /> {en ? 'Mark Replied' : 'उत्तर दिया'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === 'notify' && (
              <div className="admin-panel" style={{ maxWidth: '520px' }}>
                <div className="admin-panel-header"><h2>{en ? 'Broadcast Notification' : 'प्रसारण सूचना'}</h2></div>
                <form onSubmit={sendNotification}>
                  <div className="form-group"><label>{en ? 'Channel' : 'माध्यम'}</label>
                    <select value={notifyForm.type} onChange={(e) => setNotifyForm((p) => ({ ...p, type: e.target.value }))}>
                      <option value="email">Email</option><option value="sms">SMS</option>
                    </select>
                  </div>
                  <div className="form-group"><label>{en ? 'Title' : 'शीर्षक'}</label><input value={notifyForm.title} onChange={(e) => setNotifyForm((p) => ({ ...p, title: e.target.value }))} required /></div>
                  <div className="form-group"><label>{en ? 'Message' : 'संदेश'}</label><textarea rows={4} value={notifyForm.message} onChange={(e) => setNotifyForm((p) => ({ ...p, message: e.target.value }))} required /></div>
                  <button type="submit" className="btn btn-primary"><Bell size={16} /> {en ? 'Send to All Members' : 'सभी सदस्यों को भेजें'}</button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      {modal === 'news' && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId ? (en ? 'Edit News' : 'समाचार संपादित') : (en ? 'Add News' : 'समाचार जोड़ें')}</h3>
            <form onSubmit={saveNews}>
              <div className="form-group"><label>{en ? 'Title' : 'शीर्षक'}</label><input value={editNews.title} onChange={(e) => setEditNews((p) => ({ ...p, title: e.target.value }))} required /></div>
              <div className="form-group"><label>{en ? 'Content' : 'विवरण'}</label><textarea rows={4} value={editNews.content} onChange={(e) => setEditNews((p) => ({ ...p, content: e.target.value }))} required /></div>
              <div className="form-group"><label>{en ? 'Image URL' : 'छवि URL'}</label><input value={editNews.image} onChange={(e) => setEditNews((p) => ({ ...p, image: e.target.value }))} /></div>
              <div className="admin-form-grid">
                <div className="form-group"><label>{en ? 'Category' : 'श्रेणी'}</label>
                  <select value={editNews.category} onChange={(e) => setEditNews((p) => ({ ...p, category: e.target.value }))}>
                    <option value="general">General</option><option value="scholarship">Scholarship</option><option value="marriage">Marriage</option><option value="notice">Notice</option>
                  </select>
                </div>
                <div className="form-group"><label><input type="checkbox" checked={editNews.pinned} onChange={(e) => setEditNews((p) => ({ ...p, pinned: e.target.checked }))} /> {en ? 'Pin to top' : 'ऊपर पिन करें'}</label></div>
              </div>
              <div className="admin-actions" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={actionLoading === 'news'}>{en ? 'Save' : 'सहेजें'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>{en ? 'Cancel' : 'रद्द'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'event' && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId ? (en ? 'Edit Event' : 'कार्यक्रम संपादित') : (en ? 'Add Event' : 'कार्यक्रम जोड़ें')}</h3>
            <form onSubmit={saveEvent}>
              <div className="form-group"><label>{en ? 'Title' : 'शीर्षक'}</label><input value={editEvent.title} onChange={(e) => setEditEvent((p) => ({ ...p, title: e.target.value }))} required /></div>
              <div className="form-group"><label>{en ? 'Description' : 'विवरण'}</label><textarea rows={3} value={editEvent.description} onChange={(e) => setEditEvent((p) => ({ ...p, description: e.target.value }))} /></div>
              <div className="admin-form-grid">
                <div className="form-group"><label>{en ? 'Date & Time' : 'दिनांक व समय'}</label><input type="datetime-local" value={editEvent.date} onChange={(e) => setEditEvent((p) => ({ ...p, date: e.target.value }))} required /></div>
                <div className="form-group"><label>{en ? 'Location' : 'स्थान'}</label><input value={editEvent.location} onChange={(e) => setEditEvent((p) => ({ ...p, location: e.target.value }))} /></div>
              </div>
              <div className="form-group"><label>{en ? 'Banner URL' : 'बैनर URL'}</label><input value={editEvent.banner} onChange={(e) => setEditEvent((p) => ({ ...p, banner: e.target.value }))} /></div>
              <div className="admin-actions" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={actionLoading === 'event'}>{en ? 'Save' : 'सहेजें'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>{en ? 'Cancel' : 'रद्द'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'gallery' && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editId ? (en ? 'Edit Album' : 'एल्बम संपादित') : (en ? 'Add Album' : 'एल्बम जोड़ें')}</h3>
            <form onSubmit={saveGallery}>
              <div className="form-group"><label>{en ? 'Title' : 'शीर्षक'}</label><input value={editGallery.title} onChange={(e) => setEditGallery((p) => ({ ...p, title: e.target.value }))} required /></div>
              <div className="form-group"><label>{en ? 'Description' : 'विवरण'}</label><textarea rows={2} value={editGallery.description} onChange={(e) => setEditGallery((p) => ({ ...p, description: e.target.value }))} /></div>
              <div className="form-group"><label>{en ? 'Photo URLs (one per line)' : 'फोटो URL (प्रति पंक्ति)'}</label><textarea rows={3} value={editGallery.photos} onChange={(e) => setEditGallery((p) => ({ ...p, photos: e.target.value }))} /></div>
              <div className="form-group"><label>{en ? 'Video URLs (one per line)' : 'वीडियो URL'}</label><textarea rows={2} value={editGallery.videoUrls} onChange={(e) => setEditGallery((p) => ({ ...p, videoUrls: e.target.value }))} /></div>
              <div className="admin-actions" style={{ marginTop: '16px' }}>
                <button type="submit" className="btn btn-primary" disabled={actionLoading === 'gallery'}>{en ? 'Save' : 'सहेजें'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>{en ? 'Cancel' : 'रद्द'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
