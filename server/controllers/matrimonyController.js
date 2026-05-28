const MatrimonyProfile = require('../models/MatrimonyProfile');

// @desc    Get all active matrimony profiles
// @route   GET /api/matrimony
// @access  Private
exports.getProfiles = async (req, res) => {
  const { gender, city, gotra, minAge, maxAge } = req.query;

  try {
    const query = { status: 'active' };

    // Prevent seeing own profile in search list
    query.user = { $ne: req.user.id };

    if (gender) {
      query.gender = gender;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (gotra) {
      query.$or = [
        { gotraSelf: { $regex: gotra, $options: 'i' } },
        { gotraMother: { $regex: gotra, $options: 'i' } }
      ];
    }

    // Age filter calculation
    if (minAge || maxAge) {
      const today = new Date();
      query.dob = {};
      if (minAge) {
        const minDob = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
        query.dob.$lte = minDob;
      }
      if (maxAge) {
        const maxDob = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        query.dob.$gte = maxDob;
      }
    }

    const profiles = await MatrimonyProfile.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single profile details
// @route   GET /api/matrimony/profile/:id
// @access  Private
exports.getProfileById = async (req, res) => {
  try {
    const profile = await MatrimonyProfile.findById(req.params.id).populate('user', 'name email avatar');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Matrimonial profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own matrimonial profile
// @route   GET /api/matrimony/myprofile
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await MatrimonyProfile.findOne({ user: req.user.id })
      .populate({
        path: 'contactRequests.user',
        select: 'name email phone avatar'
      });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upsert user's matrimonial profile
// @route   POST /api/matrimony/myprofile
// @access  Private
exports.upsertMyProfile = async (req, res) => {
  const {
    gender, dob, height, gotraSelf, gotraMother,
    education, profession, income, city, photo,
    contactNumber, aboutMe, status
  } = req.body;

  try {
    let profile = await MatrimonyProfile.findOne({ user: req.user.id });

    const profileData = {
      user: req.user.id,
      gender,
      dob,
      height,
      gotraSelf,
      gotraMother,
      education,
      profession,
      income,
      city,
      photo,
      contactNumber,
      aboutMe,
      status: status || 'active'
    };

    if (profile) {
      profile = await MatrimonyProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { new: true, runValidators: true }
      );
      res.json({ success: true, message: 'Matrimonial profile updated successfully', data: profile });
    } else {
      profile = await MatrimonyProfile.create(profileData);
      res.status(201).json({ success: true, message: 'Matrimonial profile created successfully', data: profile });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send contact request to another matrimonial profile
// @route   POST /api/matrimony/profile/:id/request
// @access  Private
exports.sendContactRequest = async (req, res) => {
  try {
    const profile = await MatrimonyProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Matrimonial profile not found' });
    }

    if (profile.user.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot request contact details for your own profile' });
    }

    const alreadyRequested = profile.contactRequests.find(
      (reqObj) => reqObj.user && reqObj.user.toString() === req.user.id
    );

    if (alreadyRequested) {
      return res.status(400).json({
        success: false,
        message: `Contact request already exists. Status: ${alreadyRequested.status}`
      });
    }

    profile.contactRequests.push({ user: req.user.id, status: 'pending' });
    await profile.save();

    res.json({ success: true, message: 'Contact request sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to contact request (accept/reject)
// @route   PUT /api/matrimony/requests/:requestId
// @access  Private
exports.respondContactRequest = async (req, res) => {
  const { action } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action. Choose approved or rejected' });
  }

  try {
    const profile = await MatrimonyProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Your matrimonial profile not found' });
    }

    const request = profile.contactRequests.id(req.params.requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Contact request not found' });
    }

    request.status = action;
    await profile.save();

    res.json({ success: true, message: `Contact request ${action} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
