/**
 * Storage utility for managing notes in localStorage
 * Provides CRUD operations for notes with persistence
 */

const STORAGE_KEY = 'notes_app_data';

/**
 * Generate a unique ID for a note
 * @returns {string} Unique identifier
 */
// PUBLIC_INTERFACE
export const generateId = () => {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Load all notes from localStorage
 * @returns {Array} Array of note objects
 */
// PUBLIC_INTERFACE
export const loadNotes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading notes from localStorage:', error);
    return [];
  }
};

/**
 * Save a single note (create or update)
 * @param {Object} note - Note object to save
 * @returns {Object} Saved note object
 */
// PUBLIC_INTERFACE
export const saveNote = (note) => {
  try {
    const notes = loadNotes();
    const existingIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingIndex >= 0) {
      // Update existing note
      notes[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      // Create new note
      notes.push({
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return notes[existingIndex >= 0 ? existingIndex : notes.length - 1];
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

/**
 * Upsert a note (create if doesn't exist, update if exists)
 * @param {Object} note - Note object to upsert
 * @returns {Object} Saved note object
 */
// PUBLIC_INTERFACE
export const upsertNote = (note) => {
  return saveNote(note);
};

/**
 * Delete a note by ID
 * @param {string} id - Note ID to delete
 * @returns {boolean} Success status
 */
// PUBLIC_INTERFACE
export const deleteNote = (id) => {
  try {
    const notes = loadNotes();
    const filteredNotes = notes.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    return false;
  }
};

/**
 * Toggle favorite status of a note
 * @param {string} id - Note ID
 * @returns {Object|null} Updated note or null if not found
 */
// PUBLIC_INTERFACE
export const toggleFavorite = (id) => {
  try {
    const notes = loadNotes();
    const note = notes.find(n => n.id === id);
    
    if (note) {
      note.isFavorite = !note.isFavorite;
      note.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return note;
    }
    
    return null;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return null;
  }
};

/**
 * Toggle archive status of a note
 * @param {string} id - Note ID
 * @returns {Object|null} Updated note or null if not found
 */
// PUBLIC_INTERFACE
export const toggleArchive = (id) => {
  try {
    const notes = loadNotes();
    const note = notes.find(n => n.id === id);
    
    if (note) {
      note.isArchived = !note.isArchived;
      note.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      return note;
    }
    
    return null;
  } catch (error) {
    console.error('Error toggling archive:', error);
    return null;
  }
};

/**
 * Get a single note by ID
 * @param {string} id - Note ID
 * @returns {Object|null} Note object or null if not found
 */
// PUBLIC_INTERFACE
export const getNoteById = (id) => {
  const notes = loadNotes();
  return notes.find(n => n.id === id) || null;
};

/**
 * Search notes by title or content
 * @param {string} query - Search query
 * @returns {Array} Filtered notes
 */
// PUBLIC_INTERFACE
export const searchNotes = (query) => {
  const notes = loadNotes();
  if (!query) return notes;
  
  const lowerQuery = query.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery)
  );
};
