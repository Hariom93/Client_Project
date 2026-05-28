import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="portal-footer">
      <div className="container footer-grid">
        {/* Info Column */}
        <div className="footer-col info-col">
          <h3 className="footer-title accent-title">गुर्जर समाज</h3>
          <p className="footer-desc">{t('aboutUsDesc')}</p>
          <div className="whatsapp-help-card">
            <MessageSquare size={16} />
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="wa-link">
              WhatsApp Helpdesk: +91 98765 43210
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">{t('home')}</Link></li>
            <li><Link to="/about">{t('about')}</Link></li>
            <li><Link to="/members">{t('members')}</Link></li>
            <li><Link to="/business">{t('business')}</Link></li>
            <li><Link to="/scholarship">{t('scholarship')}</Link></li>
            <li><Link to="/donations">{t('donations')}</Link></li>
          </ul>
        </div>

        {/* Social / Contacts Column */}
        <div className="footer-col contact-col">
          <h4>{t('contact')} Info</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>Gujjar Bhawan, Sector 62, Noida, UP, India</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <span>info@gujjarsamaj.org</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>{t('copyright')}</p>
          <div className="bottom-links">
            <a href="#terms">Terms of Use</a>
            <span>•</span>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
