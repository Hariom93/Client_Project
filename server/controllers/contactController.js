const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
exports.submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'unread'
    });

    res.status(201).json({
      success: true,
      message: 'Your query has been submitted. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark contact message as replied
// @route   PUT /api/contacts/:id/status
// @access  Private/Admin
exports.markAsReplied = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.status = 'replied';
    await message.save();

    res.json({ success: true, message: 'Inquiry marked as replied successfully!', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
