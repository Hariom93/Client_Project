import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { MessageSquare, Phone, Mail, MapPin, Send, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Contact = () => {
  const { showToast } = useAuth();
  const { language, t } = useLanguage();

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: language === 'en' ? 'How do I register as a Samaj member?' : 'मैं समाज सदस्य के रूप में कैसे पंजीकरण करूं?',
      a: language === 'en'
        ? 'Click on the "Register" button in the navigation header, fill in your profile, gotra details, and occupation. Once submitted, your registration goes to the admin board. You will be able to login once approved.'
        : 'नेविगेशन हेडर में "रजिस्टर" बटन पर क्लिक करें, अपनी प्रोफाइल, गोत्र विवरण और व्यवसाय भरें। सबमिट करने के बाद, आपका पंजीकरण एडमिन बोर्ड के पास जाता है। स्वीकृत होने के बाद आप लॉगिन कर सकेंगे।'
    },
    {
      q: language === 'en' ? 'Is my matrimonial profile visible to the public?' : 'क्या मेरी वैवाहिक प्रोफ़ाइल जनता के लिए दृश्यमान है?',
      a: language === 'en'
        ? 'No. To safeguard privacy, only approved members who are logged in can search and view matrimonial profiles. Furthermore, your contact numbers and email remain encrypted until you explicitly approve a contact request.'
        : 'नहीं। गोपनीयता की रक्षा के लिए, केवल स्वीकृत सदस्य जो लॉग इन हैं, वे ही वैवाहिक प्रोफाइल खोज और देख सकते हैं। इसके अलावा, आपके संपर्क नंबर और ईमेल तब तक एन्क्रिप्टेड रहते हैं जब तक आप स्पष्ट रूप से संपर्क अनुरोध को स्वीकार नहीं करते।'
    },
    {
      q: language === 'en' ? 'How are scholarship funds distributed?' : 'छात्रवृत्ति राशि का वितरण कैसे किया जाता है?',
      a: language === 'en'
        ? 'Students submit application forms along with board marksheets and income proof. The trust checks the forms, verifies documents, and creates a merit list based on scores. Funds are directly transferred to approved students.'
        : 'छात्र बोर्ड मार्कशीट और आय प्रमाण के साथ आवेदन पत्र जमा करते हैं। ट्रस्ट फॉर्म की जांच करता है, दस्तावेजों को सत्यापित करता है और अंकों के आधार पर योग्यता सूची बनाता है। स्वीकृत छात्रों को सीधे सहायता राशि ट्रांसफर की जाती है।'
    },
    {
      q: language === 'en' ? 'Can I register my business directory listing for free?' : 'क्या मैं अपनी व्यावसायिक निर्देशिका लिस्टिंग मुफ्त में पंजीकृत कर सकता हूँ?',
      a: language === 'en'
        ? 'Yes. Any registered and approved member of the Gujjar Samaj can add their company profile, listings, phone numbers, and website links through the Business Directory portal free of cost.'
        : 'हाँ। गुर्जर समाज का कोई भी पंजीकृत और स्वीकृत सदस्य मुफ्त में व्यापार निर्देशिका पोर्टल के माध्यम से अपनी कंपनी प्रोफाइल, लिस्टिंग, फोन नंबर और वेबसाइट लिंक जोड़ सकता है।'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiCall('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message })
      });

      if (response.success) {
        showToast('Your message has been submitted successfully!', 'success');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit form', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('contact')} Us</h1>
      <p className="section-subtitle">
        {language === 'en'
          ? 'Reach out to our executive board, ask questions about membership, or submit support queries.'
          : 'हमारी कार्यकारी समिति से संपर्क करें, सदस्यता के बारे में प्रश्न पूछें, या सहायता प्रश्न सबमिट करें।'}
      </p>

      {/* Grid: Contact Info & Form */}
      <div className="grid-2" style={{ gap: '40px', marginBottom: '60px', alignItems: 'start' }}>
        
        {/* Left: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '20px' }}>Trust Head Office</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MapPin size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Address</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    Gujjar Bhawan, Sector 62, Noida, Uttar Pradesh, 201301
                  </p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Phone size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Phone</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    +91 98765 43210
                  </p>
                </div>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Mail size={20} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Email Support</strong>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                    support@gujjarsamaj.org
                  </p>
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ width: '100%', background: 'var(--success)' }}
              >
                <MessageSquare size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Interactive Google Map Mockup */}
          <div className="glass-card" style={{ height: '220px', padding: 0, overflow: 'hidden', position: 'relative' }}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
              <MapPin size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
              <strong>Google Map View (Noida Sector 62)</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Map coordinates: 28.6272° N, 77.3725° E</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--accent)', marginBottom: '24px' }}>Send Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Topic of inquiry" />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea className="form-control" required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here..."></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
              <Send size={18} /> {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        </div>
      </div>

      {/* Accordion FAQ Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Frequently Asked Questions</h2>
        <p className="section-subtitle" style={{ marginBottom: '30px' }}>
          {language === 'en' ? 'Quick answers to common questions about our community portal.' : 'हमारे सामुदायिक पोर्टल के बारे में सामान्य प्रश्नों के त्वरित उत्तर।'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => toggleFaq(idx)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent)' }} />
                  {faq.q}
                </strong>
                {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {activeFaq === idx && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
