const Business = require('../models/Business');

// @desc    Get all businesses with filter
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res) => {
  const { search, category, city } = req.query;

  try {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const listings = await Business.find(query).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single business details
// @route   GET /api/businesses/:id
// @access  Public
exports.getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate('user', 'name email');

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business listing not found' });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create business profile
// @route   POST /api/businesses
// @access  Private
exports.createBusiness = async (req, res) => {
  const { name, category, description, address, city, phone, website, logo } = req.body;

  try {
    const business = await Business.create({
      user: req.user.id,
      name,
      category,
      description,
      address,
      city,
      phone,
      website,
      logo: logo || ''
    });

    res.status(201).json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update business profile
// @route   PUT /api/businesses/:id
// @access  Private
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business listing not found' });
    }

    // Check ownership
    if (business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this business listing' });
    }

    business.name = req.body.name || business.name;
    business.category = req.body.category || business.category;
    business.description = req.body.description || business.description;
    business.address = req.body.address || business.address;
    business.city = req.body.city || business.city;
    business.phone = req.body.phone || business.phone;
    business.website = req.body.website || business.website;
    business.logo = req.body.logo !== undefined ? req.body.logo : business.logo;

    const updated = await business.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete business profile
// @route   DELETE /api/businesses/:id
// @access  Private
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business listing not found' });
    }

    // Check ownership
    if (business.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this business listing' });
    }

    await business.deleteOne();
    res.json({ success: true, message: 'Business listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to business
// @route   POST /api/businesses/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business listing not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = business.reviews.find(
      (rev) => rev.user && rev.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this business' });
    }

    const review = {
      user: req.user.id,
      userName: req.user.name || 'Anonymous Member',
      rating: Number(rating),
      comment: comment || ''
    };

    business.reviews.push(review);
    await business.save(); // Trigger pre-save recalculation

    res.json({ success: true, message: 'Review added successfully!', data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
