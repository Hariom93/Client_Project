const Donation = require('../models/Donation');

// @desc    Initiate donation payment (simulation)
// @route   POST /api/donations/donate
// @access  Public
exports.createDonation = async (req, res) => {
  const { donorName, email, phone, amount, message, isAnonymous } = req.body;

  try {
    // If headers contain auth token, attach user ID
    const userId = req.headers.authorization ? req.user?.id : null;

    const donation = await Donation.create({
      user: userId,
      donorName,
      email,
      phone: phone || '',
      amount,
      message: message || '',
      isAnonymous: isAnonymous || false,
      status: 'pending',
      paymentId: ''
    });

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Donation order created (Pending payment simulation)'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify donation payment (simulation callback)
// @route   POST /api/donations/verify
// @access  Public
exports.verifyDonation = async (req, res) => {
  const { donationId, mockSuccess } = req.body;

  try {
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found' });
    }

    if (mockSuccess !== false) {
      donation.status = 'success';
      donation.paymentId = `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
      await donation.save();

      res.json({
        success: true,
        data: donation,
        message: 'Donation payment simulated and verified successfully!'
      });
    } else {
      donation.status = 'failed';
      await donation.save();
      res.status(400).json({ success: false, message: 'Payment simulation failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donor leaderboard
// @route   GET /api/donations/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Group successful donations by donor name/email to sum total amounts
    const leaderboard = await Donation.aggregate([
      { $match: { status: 'success', isAnonymous: false } },
      {
        $group: {
          _id: { $toLower: '$email' },
          donorName: { $first: '$donorName' },
          totalAmount: { $sum: '$amount' },
          donationsCount: { $sum: 1 },
          lastDonated: { $max: '$createdAt' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donation statistics (for homepage widgets)
// @route   GET /api/donations/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: '$amount' },
          totalDonors: { $sum: 1 }
        }
      }
    ]);

    const latest = await Donation.find({ status: 'success', isAnonymous: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('donorName amount createdAt');

    const result = {
      totalRaised: stats[0] ? stats[0].totalRaised : 0,
      totalDonors: stats[0] ? stats[0].totalDonors : 0,
      latestDonations: latest
    };

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
