import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Search, Calendar, Award, Landmark, Megaphone, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
};

const hoverScaleVariants = {
  hover: { y: -6, scale: 1.02, transition: { duration: 0.25, ease: 'easeOut' } }
};

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ membersCount: 1540, studentsCount: 120, eventsCount: 45, totalRaised: 385000 });
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch dashboard stats & latest events/news
    const fetchHomeData = async () => {
      try {
        const statsRes = await apiCall('/api/donations/stats');
        const userCountRes = await apiCall('/api/users/directory'); // counts approved members

        if (statsRes.success && userCountRes.success) {
          setStats({
            membersCount: userCountRes.count + 1200, // Seed base offset + directory
            studentsCount: 120, // Mocked
            eventsCount: 45, // Mocked
            totalRaised: statsRes.data.totalRaised || 385000
          });
        }
      } catch (err) {
        console.log('Error fetching stats:', err.message);
      }

      try {
        const eventsRes = await apiCall('/api/events');
        if (eventsRes.success) {
          setEvents(eventsRes.data.slice(0, 3)); // show first 3
        }
      } catch (err) {
        console.log('Error fetching events:', err.message);
      }

      try {
        const newsRes = await apiCall('/api/news');
        if (newsRes.success) {
          setNews(newsRes.data.slice(0, 3)); // show first 3
        }
      } catch (err) {
        console.log('Error fetching news:', err.message);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/members?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/members');
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <motion.div
          className="container hero-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 className="hero-heading" variants={itemVariants}>
            {language === 'en' ? 'Strength in ' : 'एकता में '}
            <span className="accent-title">{language === 'en' ? 'Unity' : 'शक्ति'}</span>,
            <br />
            {language === 'en' ? 'Progress in ' : 'शिक्षा से '}
            <span className="accent-title">{language === 'en' ? 'Education' : 'प्रगति'}</span>
          </motion.h1>

          <motion.p className="hero-subheading" variants={itemVariants}>
            {t('subWelcome')}
          </motion.p>

          <motion.form onSubmit={handleSearchSubmit} className="hero-search-form" variants={itemVariants}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary search-btn">{t('viewDirectory')}</button>
          </motion.form>
        </motion.div>
        <div className="hero-overlay"></div>
      </section>

      {/* 2. Stats Section */}
      <section className="stats-section">
        <motion.div
          className="container stats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className="stat-card glass-card" variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
            <Landmark className="stat-icon" size={32} />
            <h3>{stats.membersCount}+</h3>
            <p>{t('totalMembers')}</p>
          </motion.div>

          <motion.div className="stat-card glass-card" variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
            <Award className="stat-icon" size={32} />
            <h3>{stats.studentsCount}+</h3>
            <p>{t('studentsHelped')}</p>
          </motion.div>

          <motion.div className="stat-card glass-card" variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
            <Calendar className="stat-icon" size={32} />
            <h3>{stats.eventsCount}+</h3>
            <p>{t('eventsCompleted')}</p>
          </motion.div>

          <motion.div className="stat-card glass-card" variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
            <Landmark className="stat-icon text-gold" size={32} />
            <h3>₹{stats.totalRaised.toLocaleString('en-IN')}</h3>
            <p>{t('fundsRaised')}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Welcome Message */}
      <section className="welcome-intro-section container">
        <motion.div
          className="welcome-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="welcome-image-card" variants={itemVariants}>
            <img
              src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600"
              alt="Community Assembly"
              className="welcome-img"
            />
            <div className="image-badge-overlay">ESTD. 2008</div>
          </motion.div>

          <motion.div className="welcome-text-card" variants={itemVariants}>
            <h4 className="welcome-meta-tag">ABOUT OUR TRUST</h4>
            <h2>{language === 'en' ? 'Welcome to the Gujjar Samaj Seva Trust' : 'गुर्जर समाज सेवा ट्रस्ट में आपका स्वागत है'}</h2>
            <p>
              {language === 'en'
                ? 'Our mission is to establish a strong, digital network that fosters community growth, helps underprivileged students, sponsors mass weddings, preserves history, and encourages business partnerships.'
                : 'हमारा उद्देश्य एक मजबूत, digital network स्थापित करना है जो सामुदायिक विकास को बढ़ावा देता है, जरूरतमंद छात्रों की मदद करता है, सामूहिक विवाह आयोजित करता है, इतिहास को संरक्षित करता है और व्यापार साझेदारी को बढ़ावा देता है।'}
            </p>
            <p>
              {language === 'en'
                ? 'Through the Member Directory, Matrimony matches, and Scholarship portals, we offer unified resources to make administrative tasks transparent and accessible.'
                : 'सदस्य निर्देशिका, वैवाहिक मेल और छात्रवृत्ति पोर्टल के माध्यम से, हम प्रशासनिक कार्यों को पारदर्शी और सुलभ बनाने के लिए एकीकृत संसाधन प्रदान करते हैं।'}
            </p>
            <div className="welcome-actions">
              <Link to="/about" className="btn btn-secondary">{t('about')} <ArrowRight size={16} /></Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. Upcoming Events Slider */}
      <section className="home-events-section bg-secondary-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">{t('upcomingEvents')}</h2>
            <p className="section-subtitle">{language === 'en' ? 'Join community meetings, career workshops, and festivals' : 'सामुदायिक बैठकों, करियर कार्यशालाओं और त्योहारों में शामिल हों'}</p>
          </motion.div>

          <motion.div
            className="grid-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {events.length > 0 ? (
              events.map((evt) => (
                <motion.div key={evt._id} className="event-card glass-card" variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
                  <div className="event-img-wrap">
                    <img src={evt.banner || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400'} alt={evt.title} className="event-banner-img" />
                    <span className="event-date-badge">
                      {new Date(evt.date).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="event-body">
                    <h4>{evt.title}</h4>
                    <p className="event-loc">{evt.location}</p>
                    <p className="event-desc">{evt.description ? evt.description.slice(0, 100) + '...' : ''}</p>
                    <Link to="/events" className="event-link">{language === 'en' ? 'View details' : 'विवरण देखें'} <ArrowRight size={14} /></Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex-center" style={{ gridColumn: 'span 3', padding: '40px' }}>
                <p>No upcoming events listed currently.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 5. Latest News Section */}
      <section className="home-news-section container">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">{t('latestNews')}</h2>
          <p className="section-subtitle">{language === 'en' ? 'Official statements, scholarship cycles, and community board updates' : 'आधिकारिक बयान, छात्रवृत्ति चक्र और सामुदायिक बोर्ड अपडेट'}</p>
        </motion.div>

        <motion.div
          className="grid-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {news.length > 0 ? (
            news.map((item) => (
              <motion.div key={item._id} className={`news-card glass-card ${item.pinned ? 'pinned-news-card' : ''}`} variants={itemVariants} whileHover="hover" custom={hoverScaleVariants.hover}>
                {item.pinned && (
                  <div className="pinned-alert-badge">
                    <Megaphone size={12} /> {language === 'en' ? 'IMPORTANT' : 'महत्वपूर्ण'}
                  </div>
                )}
                {item.image && <img src={item.image} alt={item.title} className="news-card-img" />}
                <div className="news-card-body">
                  <span className="news-cat-badge">{item.category}</span>
                  <h4>{item.title}</h4>
                  <p>{item.content.slice(0, 120)}...</p>
                  <div className="news-card-footer">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <Link to="/news" className="btn btn-outline btn-sm">{language === 'en' ? 'Read Notice' : 'सूचना पढ़ें'}</Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex-center" style={{ gridColumn: 'span 3', padding: '40px' }}>
              <p>No news announcements at this time.</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* 6. Donation Call-to-action Banner */}
      <section className="donation-promo-banner">
        <motion.div
          className="container promo-banner-content"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="promo-text">
            <Heart size={36} className="heart-pulse-icon" />

            <h2>{t('donateTitle')}</h2>

            <p>
              {language === 'en'
                ? 'Your generous contributions directly fund educational scholarships, libraries, and medical camps.'
                : 'आपका उदार योगदान सीधे शैक्षणिक छात्रवृत्ति, पुस्तकालयों और चिकित्सा शिविरों को वित्तपोषित करता है।'}
            </p>
          </div>

          <Link
            to="/donations"
            className="btn btn-primary btn-lg promo-cta-btn"
          >
            {language === 'en'
              ? 'Contribute Online'
              : 'ऑनलाइन योगदान करें'}
          </Link>

        </motion.div>
      </section>
    </div>
  );
};

export default Home;
