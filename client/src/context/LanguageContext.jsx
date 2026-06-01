import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    members: 'Directory',
    events: 'Events',
    news: 'News',
    matrimony: 'Matrimony',
    business: 'Business',
    scholarship: 'Scholarship',
    donations: 'Donations',
    gallery: 'Gallery',
    contact: 'Contact',
    admin: 'Admin Panel',
    login: 'Login',
    register: 'Register',
    profile: 'My Profile',
    logout: 'Logout',
    welcome: 'Welcome to Gujjar Samaj Portal',
    subWelcome: 'Connecting and empowering our community through education, business partnerships, matrimonial alliances, and collective support.',
    viewDirectory: 'View Directory',
    upcomingEvents: 'Upcoming Events',
    latestNews: 'Latest Samaj News',
    donateTitle: 'Support Samaj Welfare',
    statistics: 'Community Statistics',
    totalMembers: 'Total Members',
    studentsHelped: 'Students Assisted',
    eventsCompleted: 'Events Hosted',
    fundsRaised: 'Funds Raised',
    history: 'History & Heritage',
    visionMission: 'Vision & Mission',
    presidentMsg: "President's Message",
    ourTeam: 'Samaj Executive Committee',
    changeLang: 'हिंदी',
    searchPlaceholder: 'Search by name or gotra...',
    cityFilter: 'Filter by City',
    profFilter: 'Filter by Profession',
    eduFilter: 'Filter by Education',
    gotraFilter: 'Filter by Gotra',
    noResults: 'No members found matching your search.',
    aboutUsDesc: 'Dedicated to preserving cultural heritage, supporting educational endeavors, and building a secure prosperous network for the Gujjar community.',
    copyright: '© 2026 Gujjar Samaj Trust. All Rights Reserved.'
  },
  hi: {
    home: 'होम',
    about: 'हमारे बारे में',
    members: 'निर्देशिका',
    events: 'कार्यक्रम',
    news: 'समाचार',
    matrimony: 'वैवाहिक',
    business: 'व्यापार',
    scholarship: 'छात्रवृत्ति',
    donations: 'दान',
    gallery: 'गैलरी',
    contact: 'संपर्क',
    admin: 'एडमिन पैनल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    profile: 'मेरी प्रोफाइल',
    logout: 'लॉगआउट',
    welcome: 'गुर्जर समाज पोर्टल में आपका स्वागत है',
    subWelcome: 'शिक्षा, व्यापार साझेदारी, वैवाहिक गठबंधन और सामूहिक सहायता के माध्यम से हमारे समाज को जोड़ना और सशक्त बनाना।',
    viewDirectory: 'निर्देशिका देखें',
    upcomingEvents: 'आगामी कार्यक्रम',
    latestNews: 'नवीनतम समाज समाचार',
    donateTitle: 'समाज कल्याण में योगदान दें',
    statistics: 'सामुदायिक आँकड़े',
    totalMembers: 'कुल सदस्य',
    studentsHelped: 'लाभान्वित छात्र',
    eventsCompleted: 'आयोजित कार्यक्रम',
    fundsRaised: 'एकत्रित धनराशि',
    history: 'इतिहास और विरासत',
    visionMission: 'दृष्टिकोण और मिशन',
    presidentMsg: 'अध्यक्ष का संदेश',
    ourTeam: 'समाज कार्यकारिणी समिति',
    changeLang: 'English',
    searchPlaceholder: 'नाम या गोत्र से खोजें...',
    cityFilter: 'शहर से फ़िल्टर करें',
    profFilter: 'व्यवसाय से फ़िल्टर करें',
    eduFilter: 'शिक्षा से फ़िल्टर करें',
    gotraFilter: 'गोत्र से फ़िल्टर करें',
    noResults: 'आपकी खोज से मेल खाता कोई सदस्य नहीं मिला।',
    aboutUsDesc: 'सांस्कृतिक विरासत के संरक्षण, शैक्षणिक प्रयासों का समर्थन करने और गुर्जर समुदाय के लिए एक सुरक्षित समृद्ध नेटवर्क बनाने के लिए समर्पित।',
    copyright: '© 2026 गुर्जर समाज ट्रस्ट। सर्वाधिकार सुरक्षित।'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const t = (key) => {
    const lang = translations[language] ? language : 'en';
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
