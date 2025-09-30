import React from 'react';

/**
 * Sidebar component for folder navigation
 * @param {Object} props - Component props
 * @param {string} props.activeFolder - Currently active folder
 * @param {Function} props.onFolderChange - Handler for folder selection
 * @param {Object} props.noteCounts - Object with count for each folder
 */
// PUBLIC_INTERFACE
const Sidebar = ({ activeFolder, onFolderChange, noteCounts }) => {
  const folders = [
    { id: 'all', label: 'All Notes', icon: '📄', count: noteCounts.all },
    { id: 'favorites', label: 'Favorites', icon: '⭐', count: noteCounts.favorites },
    { id: 'recent', label: 'Recent', icon: '🕒', count: noteCounts.recent },
    { id: 'archive', label: 'Archive', icon: '📦', count: noteCounts.archive }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Note folders">
        <ul className="folder-list">
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                className={`folder-item ${activeFolder === folder.id ? 'active' : ''}`}
                onClick={() => onFolderChange(folder.id)}
                aria-label={`${folder.label} (${folder.count} notes)`}
                aria-current={activeFolder === folder.id ? 'page' : undefined}
              >
                <span className="folder-icon">{folder.icon}</span>
                <span className="folder-label">{folder.label}</span>
                <span className="folder-count">{folder.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
