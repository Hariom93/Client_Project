const User = require('../models/User');

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Assign standard fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
    user.profileVisibility = req.body.profileVisibility || user.profileVisibility;

    // Deep merge objects to avoid nulling out subfields
    if (req.body.familyDetails) {
      user.familyDetails = {
        fatherName: req.body.familyDetails.fatherName !== undefined ? req.body.familyDetails.fatherName : user.familyDetails.fatherName,
        motherName: req.body.familyDetails.motherName !== undefined ? req.body.familyDetails.motherName : user.familyDetails.motherName,
        gotra: req.body.familyDetails.gotra !== undefined ? req.body.familyDetails.gotra : user.familyDetails.gotra,
        spouseName: req.body.familyDetails.spouseName !== undefined ? req.body.familyDetails.spouseName : user.familyDetails.spouseName
      };
    }

    if (req.body.occupation) {
      user.occupation = {
        title: req.body.occupation.title !== undefined ? req.body.occupation.title : user.occupation.title,
        company: req.body.occupation.company !== undefined ? req.body.occupation.company : user.occupation.company,
        city: req.body.occupation.city !== undefined ? req.body.occupation.city : user.occupation.city
      };
    }

    if (req.body.education) {
      user.education = {
        degree: req.body.education.degree !== undefined ? req.body.education.degree : user.education.degree,
        institution: req.body.education.institution !== undefined ? req.body.education.institution : user.education.institution,
        graduationYear: req.body.education.graduationYear !== undefined ? req.body.education.graduationYear : user.education.graduationYear
      };
    }

    const updatedUser = await user.save();
    
    // Omit password from response
    const returnUser = updatedUser.toObject();
    delete returnUser.password;

    res.json({ success: true, data: returnUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get members directory (with filters)
// @route   GET /api/users/directory
// @access  Public (only returns public approved profiles)
exports.getDirectory = async (req, res) => {
  const { search, city, profession, education, gotra } = req.query;

  try {
    const query = {
      status: 'approved',
      profileVisibility: 'public'
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'occupation.title': { $regex: search, $options: 'i' } }
      ];
    }

    if (city) {
      query['occupation.city'] = { $regex: city, $options: 'i' };
    }

    if (profession) {
      query['occupation.title'] = { $regex: profession, $options: 'i' };
    }

    if (education) {
      query['education.degree'] = { $regex: education, $options: 'i' };
    }

    if (gotra) {
      query['familyDetails.gotra'] = { $regex: gotra, $options: 'i' };
    }

    const members = await User.find(query).select('name email phone avatar familyDetails occupation education');
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
