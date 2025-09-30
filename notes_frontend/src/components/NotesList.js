import React from 'react';
import NoteItem from './NoteItem';

/**
 * List component displaying all notes matching current filter
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of note objects to display
 * @param {string} props.selectedNoteId - ID of currently selected note
 * @param {Function} props.onNoteSelect - Handler for note selection
 */
// PUBLIC_INTERFACE
const NotesList = ({ notes, selectedNoteId, onNoteSelect }) => {
  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <div className="empty-state">
          <p className="empty-state-text">📝 No notes found</p>
          <p className="empty-state-hint">Create a new note to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list" role="list" aria-label="Notes list">
      {notes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onClick={() => onNoteSelect(note.id)}
        />
      ))}
    </div>
  );
};

export default NotesList;
