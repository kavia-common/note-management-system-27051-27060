import React, { useState, useEffect, useRef } from 'react';

/**
 * Note editor component with title, content, and action toolbar
 * @param {Object} props - Component props
 * @param {Object} props.note - Current note object (null if no note selected)
 * @param {Function} props.onNoteChange - Handler for note content changes
 * @param {Function} props.onToggleFavorite - Handler for favorite toggle
 * @param {Function} props.onToggleArchive - Handler for archive toggle
 * @param {Function} props.onDelete - Handler for note deletion
 */
// PUBLIC_INTERFACE
const NoteEditor = ({ note, onNoteChange, onToggleFavorite, onToggleArchive, onDelete }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const titleInputRef = useRef(null);

  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [note]);

  // Handle title change with debounce
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (note) {
      onNoteChange({ ...note, title: newTitle });
    }
  };

  // Handle content change with debounce
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (note) {
      onNoteChange({ ...note, content: newContent });
    }
  };

  // Handle delete with confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (note) {
      onDelete(note.id);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Focus title input when new note is created
  useEffect(() => {
    if (note && !note.title && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [note]);

  if (!note) {
    return (
      <div className="note-editor">
        <div className="empty-editor">
          <p className="empty-editor-text">📝 Select a note to start editing</p>
          <p className="empty-editor-hint">or create a new note</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <button
          className={`toolbar-btn ${note.isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(note.id)}
          aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {note.isFavorite ? '⭐ Favorited' : '☆ Favorite'}
        </button>
        
        <button
          className={`toolbar-btn ${note.isArchived ? 'active' : ''}`}
          onClick={() => onToggleArchive(note.id)}
          aria-label={note.isArchived ? 'Unarchive note' : 'Archive note'}
          title={note.isArchived ? 'Unarchive note' : 'Archive note'}
        >
          {note.isArchived ? '📦 Archived' : '📦 Archive'}
        </button>
        
        <button
          className="toolbar-btn btn-delete"
          onClick={handleDeleteClick}
          aria-label="Delete note"
          title="Delete note"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Title input */}
      <input
        ref={titleInputRef}
        type="text"
        className="editor-title"
        placeholder="Note title..."
        value={title}
        onChange={handleTitleChange}
        aria-label="Note title"
      />

      {/* Content textarea */}
      <textarea
        className="editor-content"
        placeholder="Start writing your note..."
        value={content}
        onChange={handleContentChange}
        aria-label="Note content"
      />

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Delete Note?</h3>
            <p className="modal-text">
              Are you sure you want to delete "{note.title || 'Untitled'}"? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-delete-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
