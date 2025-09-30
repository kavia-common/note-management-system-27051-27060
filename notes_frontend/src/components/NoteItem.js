import React from 'react';

/**
 * Individual note item in the notes list
 * @param {Object} props - Component props
 * @param {Object} props.note - Note object with id, title, content, updatedAt, isFavorite
 * @param {boolean} props.isSelected - Whether this note is currently selected
 * @param {Function} props.onClick - Handler for note selection
 */
// PUBLIC_INTERFACE
const NoteItem = ({ note, isSelected, onClick }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  // Create snippet from content (first 100 characters)
  const getSnippet = (content) => {
    if (!content) return 'No content';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  return (
    <div
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick()}
      aria-label={`Select note: ${note.title}`}
    >
      <div className="note-item-header">
        <h3 className="note-item-title">
          {note.isFavorite && <span className="favorite-indicator">⭐</span>}
          {note.title || 'Untitled'}
        </h3>
        <span className="note-item-date">{formatDate(note.updatedAt)}</span>
      </div>
      <p className="note-item-snippet">{getSnippet(note.content)}</p>
    </div>
  );
};

export default NoteItem;
