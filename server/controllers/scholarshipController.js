const Scholarship = require('../models/Scholarship');

// @desc    Apply for scholarship
// @route   POST /api/scholarships/apply
// @access  Private
exports.applyScholarship = async (req, res) => {
  const {
    studentName,
    fatherName,
    phone,
    courseName,
    percentage,
    institution,
    annualIncome,
    incomeCertificate,
    marksheet
  } = req.body;

  try {
    const application = await Scholarship.create({
      user: req.user.id,
      studentName,
      fatherName,
      phone,
      courseName,
      percentage: Number(percentage),
      institution,
      annualIncome: Number(annualIncome),
      incomeCertificate: incomeCertificate || '',
      marksheet: marksheet || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Scholarship application submitted successfully!',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own scholarship applications
// @route   GET /api/scholarships/myapplications
// @access  Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Scholarship.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get scholarship merit list (approved students sorted by high marks)
// @route   GET /api/scholarships/meritlist
// @access  Public
exports.getMeritList = async (req, res) => {
  try {
    const meritList = await Scholarship.find({ status: 'approved' })
      .select('studentName courseName percentage institution')
      .sort({ percentage: -1 })
      .limit(20);

    res.json({ success: true, count: meritList.length, data: meritList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
