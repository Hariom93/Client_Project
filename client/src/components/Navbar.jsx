import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, Menu, X, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null); // Dropdown ko bahar click hone par band karne ke liye

    // Sahi tareeka dropdown ko handle karne ka (onBlur ke jhanjhat ke bina)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
        setProfileDropdown(false);
    };

    const isActive = (path) => location.pathname === path;

    // Navigation Links Data (Taki repetitive code na likhna pade, classes wahi rhengi)
    const navLinks = [
        { path: '/', label: 'home' },
        { path: '/about', label: 'about' },
        { path: '/members', label: 'members' },
        { path: '/matrimony', label: 'matrimony' },
        { path: '/business', label: 'business' },
        { path: '/scholarship', label: 'scholarship' },
        { path: '/events', label: 'events' },
        { path: '/news', label: 'news' },
        { path: '/gallery', label: 'gallery' },
        { path: '/donations', label: 'donations' },
        { path: '/contact', label: 'contact' },
    ];

    return (
        <header className="navbar-header">
            <div className="container navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
                    <span className="brand-badge-icon">G</span>
                    <div className="brand-texts">
                        <span className="brand-hindi">गुर्जर समाज</span>
                        <span className="brand-english">Gujjar Samaj</span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="desktop-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {t(link.label)}
                        </Link>
                    ))}
                </nav>

                {/* Toolbar & Auth Buttons */}
                <div className="navbar-toolbar">
                    {/* Language Toggle */}
                    <button className="toolbar-btn" onClick={toggleLanguage} title="Change Language / भाषा बदलें">
                        <Globe size={18} />
                        <span className="lang-indicator">{language === 'en' ? 'हिं' : 'EN'}</span>
                    </button>

                    {/* Theme Toggle */}
                    <button className="toolbar-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {/* User Auth Section */}
                    {user ? (
                        <div className="user-profile-menu" ref={dropdownRef}>
                            <button
                                className="user-menu-trigger"
                                onClick={() => setProfileDropdown(!profileDropdown)}
                            >
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="user-avatar" />
                                ) : (
                                    <span className="avatar-placeholder">{user.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                                <span className="user-display-name">
                                    {user.name ? user.name.split(' ')[0] : 'User'}
                                </span>
                            </button>

                            <AnimatePresence>
                                {profileDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="profile-dropdown-card"
                                    >
                                        <div className="dropdown-user-header">
                                            <strong>{user.name}</strong>
                                            <span>{user.email}</span>
                                        </div>

                                        <Link to="/profile" className="dropdown-item" onClick={() => setProfileDropdown(false)}>
                                            <UserIcon size={16} />
                                            <span>{t('profile')}</span>
                                        </Link>

                                        {isAdmin && (
                                            <Link to="/admin" className="dropdown-item admin-dropdown-item" onClick={() => setProfileDropdown(false)}>
                                                <ShieldAlert size={16} />
                                                <span>{t('admin')}</span>
                                            </Link>
                                        )}

                                        <hr className="dropdown-divider" />

                                        <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                            <LogOut size={16} />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="auth-action-buttons">
                            <Link to="/login" className="btn btn-secondary btn-sm">{t('login')}</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">{t('register')}</Link>
                        </div>
                    )}

                    {/* Mobile Menu Open Toggle */}
                    <button className="mobile-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="mobile-nav-drawer"
                        style={{ overflow: 'hidden' }}
                    >
                        <nav className="mobile-nav-links">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {t(link.label)}
                                </Link>
                            ))}

                            {user && (
                                <>
                                    <hr className="mobile-divider" />
                                    <Link to="/profile" className="mobile-nav-link" onClick={() => setIsOpen(false)}>{t('profile')}</Link>
                                    {isAdmin && (
                                        <Link to="/admin" className="mobile-nav-link admin-mobile-link" onClick={() => setIsOpen(false)}>{t('admin')}</Link>
                                    )}
                                    <button className="mobile-nav-link mobile-logout-btn" onClick={handleLogout}>{t('logout')}</button>
                                </>
                            )}
                            {!user && (
                                <div className="mobile-auth-buttons">
                                    <Link to="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)}>{t('login')}</Link>
                                    <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)}>{t('register')}</Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;