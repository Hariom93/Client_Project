const Gallery = require('../models/Gallery');

// @desc    Get all gallery albums
// @route   GET /api/gallery
// @access  Public
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Gallery.find({}).sort({ date: -1 });
    res.json({ success: true, count: albums.length, data: albums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single album details
// @route   GET /api/gallery/:id
// @access  Public
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }

    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a gallery album
// @route   POST /api/gallery
// @access  Private/Admin
exports.createAlbum = async (req, res) => {
  const { title, description, photos, videoUrls, date } = req.body;

  try {
    const album = await Gallery.create({
      title,
      description,
      photos: photos || [],
      videoUrls: videoUrls || [],
      date: date || new Date()
    });

    res.status(201).json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery album
// @route   PUT /api/gallery/:id
// @access  Private/Admin
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }
    album.title = req.body.title || album.title;
    album.description = req.body.description !== undefined ? req.body.description : album.description;
    if (req.body.photos) album.photos = req.body.photos;
    if (req.body.videoUrls) album.videoUrls = req.body.videoUrls;
    if (req.body.date) album.date = req.body.date;
    await album.save();
    res.json({ success: true, data: album });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add media to an existing album
// @route   PUT /api/gallery/:id/media
// @access  Private/Admin
exports.addMediaToAlbum = async (req, res) => {
  const { photos, videoUrls } = req.body;

  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }

    if (photos && Array.isArray(photos)) {
      album.photos.push(...photos);
    }

    if (videoUrls && Array.isArray(videoUrls)) {
      album.videoUrls.push(...videoUrls);
    }

    await album.save();
    res.json({ success: true, data: album, message: 'Media added to album successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a gallery album
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Gallery album not found' });
    }

    await album.deleteOne();
    res.json({ success: true, message: 'Gallery album deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
