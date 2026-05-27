const Note = require('../models/Note');

// Fetch user notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const formattedNotes = notes.map((note) => ({
      id: note._id,
      title: note.title,
      encryptedContent: note.encryptedContent,
      iv: note.iv,
      authTag: note.authTag,
      createdAt: note.createdAt,
    }));

    res.status(200).json(formattedNotes);
  } catch (error) {
    console.error('Error in getNotes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, encryptedContent, iv, authTag } = req.body;

    if (!title || !encryptedContent || !iv || !authTag) {
      return res.status(400).json({ message: 'Missing required E2EE fields' });
    }

    const note = await Note.create({
      userId: req.user.id,
      title,
      encryptedContent,
      iv,
      authTag,
    });

    res.status(201).json({
      id: note._id,
      title: note.title,
      createdAt: note.createdAt,
    });
  } catch (error) {
    console.error('Error in createNote:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Ensure the user owns this note
    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this note' });
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNote:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};
