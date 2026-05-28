const User = require('../models/User');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const Scholarship = require('../models/Scholarship');
const Business = require('../models/Business');
const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const MatrimonyProfile = require('../models/MatrimonyProfile');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const approvedMembers = await User.countDocuments({ status: 'approved' });
    const pendingApprovals = await User.countDocuments({ status: 'pending' });

    const eventsCount = await Event.countDocuments({});
    const businessCount = await Business.countDocuments({});

    const donations = await Donation.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const totalDonations = donations[0] ? donations[0].total : 0;
    const donationsCount = donations[0] ? donations[0].count : 0;

    const scholarshipCount = await Scholarship.countDocuments({});
    const pendingScholarships = await Scholarship.countDocuments({ status: 'pending' });
    const newsCount = await News.countDocuments({});
    const galleryCount = await Gallery.countDocuments({});
    const contactsUnread = await Contact.countDocuments({ status: 'unread' });
    const matrimonyCount = await MatrimonyProfile.countDocuments({});
    const matrimonyActive = await MatrimonyProfile.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: {
        users: { total: totalUsers, approved: approvedMembers, pending: pendingApprovals },
        events: eventsCount,
        businesses: businessCount,
        donations: { totalAmount: totalDonations, count: donationsCount },
        scholarships: { total: scholarshipCount, pending: pendingScholarships },
        news: newsCount,
        gallery: galleryCount,
        contacts: { total: await Contact.countDocuments({}), unread: contactsUnread },
        matrimony: { total: matrimonyCount, active: matrimonyActive }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (detailed list)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject member status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateMemberStatus = async (req, res) => {
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    user.status = status;
    await user.save();

    // Simulated email / SMS notification dispatch log
    console.log(`Notification sent to ${user.email} (SMS to ${user.phone || 'none'}): Your membership has been updated to "${status}".`);

    res.json({ success: true, message: `Member status updated to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all scholarship applications
// @route   GET /api/admin/scholarships
// @access  Private/Admin
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: scholarships.length, data: scholarships });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject scholarship applications
// @route   PUT /api/admin/scholarships/:id/status
// @access  Private/Admin
exports.updateScholarshipStatus = async (req, res) => {
  const { status, feedback } = req.body;

  if (!['pending', 'verified', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const application = await Scholarship.findById(req.params.id).populate('user', 'email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Scholarship application not found' });
    }

    application.status = status;
    application.feedback = feedback || application.feedback;
    await application.save();

    // Simulated SMS/Email push log
    if (application.user) {
      console.log(`Notification sent to ${application.user.email}: Your scholarship application status is updated to "${status}". Feedback: "${feedback || 'None'}"`);
    }

    res.json({ success: true, message: `Scholarship application status updated to ${status}`, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donation transactions
// @route   GET /api/admin/donations
// @access  Private/Admin
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send notifications to all users (Simulation)
// @route   POST /api/admin/notify
// @access  Private/Admin
exports.getAllMatrimony = async (req, res) => {
  try {
    const profiles = await MatrimonyProfile.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMatrimonyStatus = async (req, res) => {
  const { status } = req.body;
  if (!['active', 'hidden'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  try {
    const profile = await MatrimonyProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    profile.status = status;
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }
    await business.deleteOne();
    res.json({ success: true, message: 'Business listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  const { type, title, message } = req.body;

  try {
    const users = await User.find({ status: 'approved' }).select('email phone');

    console.log(`Broadcasting [${type.toUpperCase()}] "${title}" to ${users.length} members.`);

    res.json({
      success: true,
      message: `Notification broadcast via ${type} simulation successful to ${users.length} members.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
