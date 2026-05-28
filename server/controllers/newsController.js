const News = require('../models/News');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res) => {
  const { category } = req.query;

  try {
    const query = {};
    if (category) {
      query.category = category;
    }

    // Pinned notices appear first, followed by date order
    const news = await News.find(query)
      .populate('author', 'name')
      .sort({ pinned: -1, date: -1 });

    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get news details
// @route   GET /api/news/:id
// @access  Public
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name');

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res) => {
  const { title, content, image, pinned, category } = req.body;

  try {
    const news = await News.create({
      title,
      content,
      image: image || '',
      pinned: pinned || false,
      category: category || 'general',
      author: req.user.id
    });

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    news.title = req.body.title || news.title;
    news.content = req.body.content || news.content;
    news.image = req.body.image !== undefined ? req.body.image : news.image;
    news.pinned = req.body.pinned !== undefined ? req.body.pinned : news.pinned;
    news.category = req.body.category || news.category;

    const updated = await news.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    await news.deleteOne();
    res.json({ success: true, message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
