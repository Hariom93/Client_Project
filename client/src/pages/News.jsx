import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Megaphone, Calendar, User, Newspaper } from 'lucide-react';

const News = () => {
  const { t, language } = useLanguage();
  const [newsList, setNewsList] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const endpoint = category ? `/api/news?category=${category}` : '/api/news';
      const response = await apiCall(endpoint);
      if (response.success) {
        setNewsList(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const categories = [
    { value: '', label: language === 'en' ? 'All Updates' : 'सभी अपडेट' },
    { value: 'general', label: language === 'en' ? 'General' : 'सामान्य' },
    { value: 'scholarship', label: language === 'en' ? 'Scholarships' : 'छात्रवृत्ति' },
    { value: 'notice', label: language === 'en' ? 'Official Notices' : 'सरकारी सूचनाएं' },
    { value: 'marriage', label: language === 'en' ? 'Matrimonial Boards' : 'वैवाहिक सूचनाएं' }
  ];

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('news')}</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Stay updated with official bulletins, scholarship application periods, executive notices, and events announcements.'
          : 'आधिकारिक बुलेटिनों, छात्रवृत्ति आवेदन अवधि, कार्यकारी सूचनाओं और कार्यक्रमों की घोषणाओं से अपडेट रहें।'}
      </p>

      {/* Categories filter tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`btn ${category === cat.value ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : newsList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <Newspaper size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>{language === 'en' ? 'No notices posted in this category.' : 'इस श्रेणी में कोई सूचना पोस्ट नहीं की गई है।'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {newsList.map((news) => (
            <div
              key={news._id}
              className={`glass-card ${news.pinned ? 'pinned-news-card' : ''}`}
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}
            >
              {news.image && (
                <div style={{ width: window.innerWidth < 768 ? '100%' : '350px', height: '240px', flexShrink: 0 }}>
                  <img
                    src={news.image}
                    alt={news.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {news.pinned && (
                  <div className="pinned-alert-badge" style={{ alignSelf: 'flex-start', margin: '-10px 0 16px 0', border: 'none', padding: '4px 10px', borderRadius: '4px' }}>
                    <Megaphone size={12} /> {language === 'en' ? 'IMPORTANT NOTICE' : 'महत्वपूर्ण सूचना'}
                  </div>
                )}
                
                <span className="news-cat-badge" style={{ marginBottom: '8px' }}>{news.category}</span>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{news.title}</h2>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: '1.7', marginBottom: '24px', flexGrow: 1 }}>
                  {news.content}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{new Date(news.date || news.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    <span>Post by: {news.author?.name || 'Trust Board'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
