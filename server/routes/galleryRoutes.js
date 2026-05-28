const express = require('express');
const router = express.Router();
const {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  addMediaToAlbum,
  deleteAlbum
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', protect, admin, createAlbum);
router.put('/:id', protect, admin, updateAlbum);
router.put('/:id/media', protect, admin, addMediaToAlbum);
router.delete('/:id', protect, admin, deleteAlbum);

module.exports = router;
