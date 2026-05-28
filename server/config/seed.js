const User = require('../models/User');
const Event = require('../models/Event');
const News = require('../models/News');
const Donation = require('../models/Donation');
const Gallery = require('../models/Gallery');
const MatrimonyProfile = require('../models/MatrimonyProfile');
const Business = require('../models/Business');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments({});
    if (userCount > 0) {
      console.log('Database already has data. Skipping auto-seeding.');
      return;
    }

    console.log('Seeding initial database content...');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Aditya Gujjar',
      email: 'admin@gujjarsamaj.org',
      password: 'adminpassword123', // Will be hashed by user.save pre hook
      phone: '9876543210',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      role: 'admin',
      status: 'approved',
      profileVisibility: 'public',
      familyDetails: { fatherName: 'Rajendra Singh', motherName: 'Kiran Devi', gotra: 'Bhadana', spouseName: '' },
      occupation: { title: 'Software Engineer', company: 'Google', city: 'Noida' },
      education: { degree: 'B.Tech CSE', institution: 'IIT Delhi', graduationYear: 2020 }
    });

    const memberUser = await User.create({
      name: 'Vikram Singh',
      email: 'member@gujjarsamaj.org',
      password: 'memberpassword123',
      phone: '9988776655',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'member',
      status: 'approved',
      profileVisibility: 'public',
      familyDetails: { fatherName: 'Sube Singh', motherName: 'Sunita Devi', gotra: 'Chechi', spouseName: '' },
      occupation: { title: 'Business Analyst', company: 'TCS', city: 'Gurugram' },
      education: { degree: 'B.Com', institution: 'Delhi University', graduationYear: 2018 }
    });

    const femaleUser = await User.create({
      name: 'Neha Gujjar',
      email: 'neha@gujjarsamaj.org',
      password: 'memberpassword123',
      phone: '9898989898',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'member',
      status: 'approved',
      profileVisibility: 'public',
      familyDetails: { fatherName: 'Devender Singh', motherName: 'Prem Lata', gotra: 'Tanwar', spouseName: '' },
      occupation: { title: 'Doctor', company: 'Fortis Hospital', city: 'Faridabad' },
      education: { degree: 'MBBS', institution: 'AIIMS Delhi', graduationYear: 2021 }
    });

    console.log('✔ Users seeded');

    // 2. Create Matrimonial Profiles
    await MatrimonyProfile.create({
      user: memberUser._id,
      gender: 'male',
      dob: new Date('1996-08-15'),
      height: "5'10\"",
      gotraSelf: 'Chechi',
      gotraMother: 'Bhadana',
      education: 'B.Com, MBA',
      profession: 'Business Analyst at TCS',
      income: '12 LPA',
      city: 'Gurugram',
      photo: memberUser.avatar,
      contactNumber: memberUser.phone,
      aboutMe: 'Simple, career-oriented person who values family traditions and modern outlooks.',
      status: 'active'
    });

    await MatrimonyProfile.create({
      user: femaleUser._id,
      gender: 'female',
      dob: new Date('1998-05-20'),
      height: "5'4\"",
      gotraSelf: 'Tanwar',
      gotraMother: 'Dedha',
      education: 'MBBS',
      profession: 'Resident Doctor',
      income: '15 LPA',
      city: 'Faridabad',
      photo: femaleUser.avatar,
      contactNumber: femaleUser.phone,
      aboutMe: 'Looking for a supportive companion. Passionate about medical service and traveling.',
      status: 'active'
    });

    console.log('✔ Matrimony profiles seeded');

    // 3. Create Businesses
    await Business.create({
      user: memberUser._id,
      name: 'Gujjar Builders & Developers',
      category: 'Real Estate',
      description: 'Premium residential flats, plots, and commercial builder services in NCR.',
      address: 'Shop 12, Sector 15 Market',
      city: 'Gurugram',
      phone: '9988776655',
      website: 'www.gujjarbuilders.com',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150',
      reviews: [
        { user: adminUser._id, userName: adminUser.name, rating: 5, comment: 'Highly reliable builders. Transparent dealing.' }
      ]
    });

    await Business.create({
      user: adminUser._id,
      name: 'Bhadana Dairy Products',
      category: 'Food & Dairy',
      description: 'Organic pure milk, ghee, paneer, and sweets supplied daily.',
      address: 'Noida Extension Near Metro',
      city: 'Noida',
      phone: '9876543210',
      website: 'www.bhadanadairy.com',
      logo: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=150',
      reviews: []
    });

    console.log('✔ Businesses seeded');

    // 4. Create News
    await News.create({
      title: 'Gujjar Samaj Annual Scholarship Scheme 2026 Announced',
      content: 'Applications are invited from meritorious Gujjar Samaj students who scored above 80% in 10th or 12th board exams. Eligible students can apply through our online Scholarship Portal with copies of marksheets and family income certificates. Selected candidates will receive support of up to ₹50,000.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
      pinned: true,
      category: 'scholarship',
      author: adminUser._id
    });

    await News.create({
      title: 'Upcoming Samaj Samelan in Delhi on June 15',
      content: 'A grand assembly of the Gujjar Samaj will be organized in New Delhi to discuss youth empowerment, business networking, and cultural preservation. Chief guests from various fields will join. Registration is open to all community members.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
      pinned: false,
      category: 'general',
      author: adminUser._id
    });

    console.log('✔ News articles seeded');

    // 5. Create Events
    await Event.create({
      title: 'Gujjar Youth Career Guidance Webinar',
      description: 'Free counseling sessions by senior officers, entrepreneurs, and technology experts for high school and college graduates.',
      date: new Date('2026-06-10T11:00:00'),
      location: 'Online (Zoom Meeting)',
      banner: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600'
    });

    await Event.create({
      title: 'Gujjar Samaj Mass Marriage Ceremony',
      description: 'Samuhik Vivah Sammelan organized under Samaj trust. Registration for prospective brides & grooms is open till May 30.',
      date: new Date('2026-07-02T09:00:00'),
      location: 'Community Center Grounds, Noida Sector 62',
      banner: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600'
    });

    console.log('✔ Events seeded');

    // 6. Create Donations (Success)
    await Donation.create({
      donorName: 'Mahinder Singh Dedha',
      email: 'mahinder@gmail.com',
      phone: '9812345678',
      amount: 100000,
      paymentId: 'pay_mock_seeder01',
      status: 'success',
      message: 'Happy to contribute to Samaj student fund.',
      isAnonymous: false
    });

    await Donation.create({
      donorName: 'Rameshwar Baisla',
      email: 'rameshwar@baislamail.com',
      phone: '9834567890',
      amount: 50000,
      paymentId: 'pay_mock_seeder02',
      status: 'success',
      message: 'Keep up the good work for the community.',
      isAnonymous: false
    });

    await Donation.create({
      donorName: 'Anonymous Donor',
      email: 'secret@gmail.com',
      phone: '0000000000',
      amount: 25000,
      paymentId: 'pay_mock_seeder03',
      status: 'success',
      message: 'Best wishes to all students.',
      isAnonymous: true
    });

    console.log('✔ Donations seeded');

    // 7. Create Albums
    await Gallery.create({
      title: 'Cultural Festival 2025 Highlights',
      description: 'Glimpses of traditional folk dances, gotra assemblies, and student reward ceremonies.',
      photos: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500'
      ],
      videoUrls: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ']
    });

    console.log('✔ Gallery albums seeded');
    console.log('Auto-seeding database completed successfully!');
  } catch (error) {
    console.error('Auto-seeding error:', error.message);
  }
};

module.exports = seedData;
