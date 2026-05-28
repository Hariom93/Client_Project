import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Award, Shield, Users, Compass } from 'lucide-react';

const About = () => {
  const { t, language } = useLanguage();

  const team = [
    { name: 'Dr. Ram Charan Bhadana', role: 'President / Trustee', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', desc: 'Retired IAS Officer dedicated to community welfare.' },
    { name: 'Shri Satyaveer Singh Chechi', role: 'General Secretary', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', desc: 'Social activist and advocate for education.' },
    { name: 'Shri Narendra Kumar Tanwar', role: 'Treasurer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', desc: 'Chartered Accountant overseeing financial audits.' },
    { name: 'Smt. Kavita Gujjar Baisla', role: 'Women Empowerment Lead', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', desc: 'Entrepreneur focusing on women education and jobs.' }
  ];

  return (
    <div className="container animate-fade-up" style={{ padding: '40px 24px' }}>
      <h1 className="section-title">{t('about')}</h1>
      <p className="section-subtitle">
        {language === 'en' 
          ? 'Tracing our roots, defining our vision, and working collectively for social upliftment.' 
          : 'अपनी जड़ों को पहचानना, अपने दृष्टिकोण को परिभाषित करना और सामाजिक उत्थान के लिए मिलकर काम करना।'}
      </p>

      {/* History & Core Values Grid */}
      <div className="grid-2" style={{ marginBottom: '60px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '20px' }}>{t('history')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            {language === 'en'
              ? 'The Gujjar community (also known as Gurjars) has a rich historical heritage dating back centuries. Historically known for their bravery, patriotism, and agricultural roots, the community has contributed immensely to the building of our nation.'
              : 'गुर्जर समुदाय (जिन्हें गुर्जर के नाम से भी जाना जाता है) की सदियों पुरानी समृद्ध ऐतिहासिक विरासत है। ऐतिहासिक रूप से अपनी बहादुरी, देशभक्ति और कृषि जड़ों के लिए जाने जाने वाले इस समुदाय ने हमारे राष्ट्र के निर्माण में अत्यधिक योगदान दिया है।'}
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>
            {language === 'en'
              ? 'In the modern era, our goal is to merge these historical values with digital education and business leadership, ensuring the next generation is equipped with modern skills while remaining connected to their roots.'
              : 'आधुनिक युग में, हमारा लक्ष्य इन ऐतिहासिक मूल्यों को डिजिटल शिक्षा और व्यावसायिक नेतृत्व के साथ जोड़ना है, जिससे यह सुनिश्चित हो सके कि अगली पीढ़ी अपनी जड़ों से जुड़े रहते हुए आधुनिक कौशल से लैस हो।'}
          </p>
        </div>
        <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Compass size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <div>
              <strong>{language === 'en' ? 'Our Mission' : 'हमारा मिशन'}</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Promoting education, digital accessibility, and socio-economic support for all members.' : 'सभी सदस्यों के लिए शिक्षा, डिजिटल पहुंच और सामाजिक-आर्थिक सहायता को बढ़ावा देना।'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Shield size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <div>
              <strong>{language === 'en' ? 'Preserve Culture' : 'संस्कृति का संरक्षण'}</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Documenting gotra roots, history booklets, and celebrating cultural events.' : 'गोत्र की जड़ों, इतिहास पुस्तिकाओं का दस्तावेजीकरण और सांस्कृतिक कार्यक्रमों का आयोजन।'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Users size={24} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <div>
              <strong>{language === 'en' ? 'Mutual Growth' : 'आपसी विकास'}</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {language === 'en' ? 'Facilitating business listings, matrimony alignments, and education scholarships.' : 'व्यापार लिस्टिंग, वैवाहिक मेल और शिक्षा छात्रवृत्ति की सुविधा प्रदान करना।'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* President Welcome Card */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '60px', borderLeft: '6px solid var(--accent)' }}>
        <div style={{ display: 'flex', gap: '30px', flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: 'center' }}>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" 
            alt="President" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }}
          />
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase' }}>{t('presidentMsg')}</span>
            <h2 style={{ margin: '8px 0 16px 0' }}>Dr. Ram Charan Bhadana</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.7' }}>
              {language === 'en'
                ? '"Education is the only key to upliftment. Our Samaj trust has launched this digital portal to bridge geographical distances and bring our youngsters under one roof for education guidance, matrimonial searches, and business growth. Let us build a strong community together."'
                : '"उत्थान के लिए शिक्षा ही एकमात्र कुंजी है। हमारे समाज ट्रस्ट ने भौगोलिक दूरियों को पाटने और हमारे युवाओं को शिक्षा मार्गदर्शन, वैवाहिक खोज और व्यावसायिक विकास के लिए एक मंच पर लाने के लिए इस डिजिटल पोर्टल की शुरुआत की है। आइए मिलकर एक मजबूत समाज का निर्माण करें।"'}
            </p>
            <strong>- President, Gujjar Samaj Seva Trust</strong>
          </div>
        </div>
      </div>

      {/* Executive Committee Team */}
      <div>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>{t('ourTeam')}</h2>
        <p className="section-subtitle" style={{ marginBottom: '40px' }}>
          {language === 'en' ? 'The dedicated trustees leading our community trust.' : 'हमारे समुदाय ट्रस्ट का नेतृत्व करने वाले समर्पित ट्रस्टी।'}
        </p>

        <div className="grid-4">
          {team.map((member, idx) => (
            <div key={idx} className="glass-card" style={{ textAlign: 'center', padding: '24px' }}>
              <img 
                src={member.image} 
                alt={member.name} 
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px auto', border: '2px solid var(--border)' }}
              />
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{member.name}</h4>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', margin: '4px 0 12px 0' }}>
                {member.role}
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{member.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
