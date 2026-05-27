const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

// Group the /api/notes routes
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

// Group the /api/notes/:id routes
router.route('/:id')
  .delete(protect, deleteNote);

module.exports = router;
