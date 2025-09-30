import React from 'react';

/**
 * Header component with app branding, new note button, search, and theme toggle
 * @param {Object} props - Component props
 * @param {Function} props.onNewNote - Handler for creating a new note
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Function} props.onThemeToggle - Handler for theme toggle
 */
// PUBLIC_INTERFACE
const Header = ({ onNewNote, searchQuery, onSearchChange, theme, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">📝 Notes</h1>
          <button 
            className="btn btn-new-note"
            onClick={onNewNote}
            aria-label="Create new note"
            title="New Note (Ctrl+N / Cmd+N)"
          >
            ➕ New Note
          </button>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search notes"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <button 
            className="btn-theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
