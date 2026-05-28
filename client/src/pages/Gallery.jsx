import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Image, Video, Calendar, ArrowLeft, PlayCircle } from 'lucide-react';

const Gallery = () => {
  const { t, language } = useLanguage();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/gallery');
      if (response.success) {
        setAlbums(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch gallery albums.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  // Helper to extract Youtube video ID
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    return url; // fallback
  };

  if (selectedAlbum) {
    return (
      <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => setSelectedAlbum(null)}
          style={{ marginBottom: '24px' }}
        >
          <ArrowLeft size={16} /> Back to Albums
        </button>

        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '8px' }}>{selectedAlbum.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '700px' }}>{selectedAlbum.description}</p>

        {/* Photos Grid */}
        {selectedAlbum.photos && selectedAlbum.photos.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Image size={20} style={{ color: 'var(--accent)' }} /> Photo Gallery
            </h3>
            <div className="grid-3">
              {selectedAlbum.photos.map((photo, idx) => (
                <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '240px' }}>
                  <img 
                    src={photo} 
                    alt={`Album photo ${idx}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal)' }} 
                    onClick={() => window.open(photo, '_blank')}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {selectedAlbum.videoUrls && selectedAlbum.videoUrls.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video size={20} style={{ color: 'var(--accent)' }} /> Video Albums
            </h3>
            <div className="grid-2">
              {selectedAlbum.videoUrls.map((url, idx) => (
                <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '280px' }}>
                  {url.includes('youtube.com') || url.includes('youtu.be') ? (
                    <iframe 
                      src={getYoutubeEmbedUrl(url)} 
                      title={`YouTube Video ${idx}`} 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      style={{ width: '100%', height: '100%' }}
                    ></iframe>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'var(--bg-primary)', padding: '20px' }}>
                      <PlayCircle size={40} style={{ color: 'var(--accent)' }} />
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: '600', marginTop: '10px', wordBreak: 'break-all', textAlign: 'center' }}>
                        Watch External Video Link
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('gallery')} Section</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Browse glimpses of recent community festivals, sports competitions, scholarship rewards, and gotra sammelans.'
          : 'हाल के सामुदायिक त्योहारों, खेल प्रतियोगिताओं, छात्रवृत्ति पुरस्कारों और गोत्र सम्मेलनों की झलकियाँ देखें।'}
      </p>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : albums.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <Image size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>No gallery albums are published yet.</p>
        </div>
      ) : (
        <div className="grid-3 animate-fade-up">
          {albums.map((alb) => (
            <div 
              key={alb._id} 
              className="glass-card" 
              style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setSelectedAlbum(alb)}
            >
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--border)' }}>
                {alb.photos && alb.photos[0] ? (
                  <img src={alb.photos[0]} alt={alb.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    <Image size={40} />
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '4px 8px', borderRadius: '4px' }}>
                  {alb.photos?.length || 0} Photos • {alb.videoUrls?.length || 0} Videos
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{alb.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{alb.description ? alb.description.slice(0, 80) + '...' : ''}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <Calendar size={12} />
                  <span>{new Date(alb.date || alb.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
