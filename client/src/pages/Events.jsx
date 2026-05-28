import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Calendar, MapPin, Ticket, ShieldCheck, Download, X } from 'lucide-react';

const Events = () => {
  const { user, showToast } = useAuth();
  const { language, t } = useLanguage();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTicket, setActiveTicket] = useState(null); // Holds details of successfully RSVP'd event for ticket download

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/events');
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId) => {
    if (!user) {
      showToast('Please login to register for events.', 'error');
      return;
    }

    try {
      const response = await apiCall(`/api/events/${eventId}/register`, {
        method: 'POST'
      });

      if (response.success) {
        showToast('Successfully registered for this event!', 'success');
        fetchEvents(); // reload to show checked state
        
        // Find registered event to trigger ticket print
        const registeredEvent = events.find(e => e._id === eventId);
        setActiveTicket(registeredEvent);
      }
    } catch (err) {
      showToast(err.message || 'RSVP registration failed', 'error');
    }
  };

  const isUserRegistered = (event) => {
    if (!user) return false;
    return event.registrations?.some(reg => reg.user && reg.user.toString() === user._id);
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('events')}</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Browse upcoming gatherings, sammelans, and youth guidance workshops. Register to download your digital entry badge.'
          : 'आगामी सम्मेलनों और युवा मार्गदर्शन कार्यशालाओं को देखें। डिजिटल प्रवेश पत्र डाउनलोड करने के लिए पंजीकरण करें।'}
      </p>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : (
        <div className="grid-2">
          {events.map((evt) => {
            const registered = isUserRegistered(evt);
            return (
              <div key={evt._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img 
                    src={evt.banner || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600'} 
                    alt={evt.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div className="event-date-badge">
                    {new Date(evt.date).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{evt.title}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} style={{ color: 'var(--accent)' }} />
                      <span>{new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: 'var(--accent)' }} />
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', flexGrow: 1 }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                    {registered ? (
                      <>
                        <button className="btn btn-secondary" style={{ flexGrow: 1, pointerEvents: 'none', color: 'var(--success)' }}>
                          <ShieldCheck size={18} /> Registered
                        </button>
                        <button className="btn btn-primary" onClick={() => setActiveTicket(evt)} title="Download Ticket">
                          <Download size={18} /> Card
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={() => handleRSVP(evt._id)} style={{ width: '100%' }}>
                        <Ticket size={18} /> {language === 'en' ? 'RSVP / Register Now' : 'पंजीकरण करें'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Invitation Badge / QR Ticket Modal */}
      {activeTicket && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card animate-fade-up" style={{ position: 'relative', width: '100%', maxWidth: '420px', padding: '30px', background: 'var(--bg-secondary)', textAlign: 'center', borderTop: '8px solid var(--accent)' }}>
            
            <button 
              onClick={() => setActiveTicket(null)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={24} />
            </button>

            {/* Ticket Graphic */}
            <div style={{ border: '2px dashed var(--accent)', borderRadius: '12px', padding: '20px', backgroundColor: 'var(--bg-primary)', margin: '12px 0 20px 0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Gujjar Samaj Digital Pass
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '8px 0 16px 0' }}>{activeTicket.title}</h3>
              
              <div style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div><strong>Attendee:</strong> {user?.name}</div>
                <div><strong>Date:</strong> {new Date(activeTicket.date).toLocaleDateString()}</div>
                <div><strong>Venue:</strong> {activeTicket.location}</div>
              </div>

              {/* QR Mockup */}
              <div style={{ width: '120px', height: '120px', margin: '0 auto', padding: '8px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" style={{ fill: '#0f172a' }}>
                  {/* Outer boundary pixels */}
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="3" y="3" width="24" height="24" fill="white" />
                  <rect x="9" y="9" width="12" height="12" />
                  
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="73" y="3" width="24" height="24" fill="white" />
                  <rect x="79" y="9" width="12" height="12" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="3" y="73" width="24" height="24" fill="white" />
                  <rect x="9" y="79" width="12" height="12" />
                  
                  {/* Random pixels */}
                  <rect x="40" y="10" width="10" height="20" />
                  <rect x="55" y="5" width="10" height="10" />
                  <rect x="45" y="45" width="20" height="20" />
                  <rect x="80" y="40" width="10" height="20" />
                  <rect x="10" y="40" width="20" height="10" />
                  <rect x="75" y="80" width="15" height="15" />
                  <rect x="40" y="80" width="10" height="10" />
                </svg>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Scan for attendance verification
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                window.print();
              }}
              style={{ width: '100%' }}
            >
              <Download size={18} /> Print Entry Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
