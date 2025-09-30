import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { 
  loadNotes, 
  saveNote, 
  deleteNote, 
  toggleFavorite, 
  toggleArchive,
  generateId 
} from './utils/storage';

/**
 * Main Notes application component
 * Manages application state and coordinates all child components
 */
// PUBLIC_INTERFACE
function App() {
  // State management
  const [theme, setTheme] = useState('light');
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [filterFolder, setFilterFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce timer ref for autosave
  const debounceTimerRef = useRef(null);

  // Load notes from storage on mount
  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    
    // Select first note if available
    if (loadedNotes.length > 0) {
      setSelectedNoteId(loadedNotes[0].id);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + N for new note
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        handleNewNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Toggle theme between light and dark
   */
  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * Create a new note
   */
  // PUBLIC_INTERFACE
  const handleNewNote = useCallback(() => {
    const newNote = {
      id: generateId(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false
    };

    const savedNote = saveNote(newNote);
    setNotes(prevNotes => [savedNote, ...prevNotes]);
    setSelectedNoteId(savedNote.id);
    setFilterFolder('all');
  }, []);

  /**
   * Handle note content changes with debounced autosave
   */
  // PUBLIC_INTERFACE
  const handleNoteChange = useCallback((updatedNote) => {
    // Update local state immediately for responsive UI
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      )
    );

    // Debounced save to localStorage (500ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      saveNote({ ...updatedNote, updatedAt: new Date().toISOString() });
    }, 500);
  }, []);

  /**
   * Handle note selection
   */
  // PUBLIC_INTERFACE
  const handleNoteSelect = useCallback((noteId) => {
    setSelectedNoteId(noteId);
  }, []);

  /**
   * Toggle favorite status
   */
  // PUBLIC_INTERFACE
  const handleToggleFavorite = useCallback((noteId) => {
    const updatedNote = toggleFavorite(noteId);
    if (updatedNote) {
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === noteId ? updatedNote : note)
      );
    }
  }, []);

  /**
   * Toggle archive status
   */
  // PUBLIC_INTERFACE
  const handleToggleArchive = useCallback((noteId) => {
    const updatedNote = toggleArchive(noteId);
    if (updatedNote) {
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === noteId ? updatedNote : note)
      );
      
      // If archived from non-archive view, deselect
      if (updatedNote.isArchived && filterFolder !== 'archive') {
        const remainingNotes = getFilteredNotes().filter(n => n.id !== noteId);
        setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
    }
  }, [filterFolder]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Delete a note
   */
  // PUBLIC_INTERFACE
  const handleDeleteNote = useCallback((noteId) => {
    const success = deleteNote(noteId);
    if (success) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      // Select next available note
      const remainingNotes = notes.filter(note => note.id !== noteId);
      if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes[0].id);
      } else {
        setSelectedNoteId(null);
      }
    }
  }, [notes]);

  /**
   * Filter notes based on current folder and search query
   */
  // PUBLIC_INTERFACE
  const getFilteredNotes = useCallback(() => {
    let filtered = notes;

    // Apply folder filter
    switch (filterFolder) {
      case 'favorites':
        filtered = filtered.filter(note => note.isFavorite && !note.isArchived);
        break;
      case 'recent':
        // Notes from last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filtered = filtered.filter(note => 
          !note.isArchived && new Date(note.updatedAt) >= sevenDaysAgo
        );
        break;
      case 'archive':
        filtered = filtered.filter(note => note.isArchived);
        break;
      case 'all':
      default:
        filtered = filtered.filter(note => !note.isArchived);
        break;
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }

    // Sort by updatedAt descending
    return filtered.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [notes, filterFolder, searchQuery]);

  /**
   * Calculate note counts for each folder
   */
  // PUBLIC_INTERFACE
  const getNoteCounts = useCallback(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      all: notes.filter(n => !n.isArchived).length,
      favorites: notes.filter(n => n.isFavorite && !n.isArchived).length,
      recent: notes.filter(n => !n.isArchived && new Date(n.updatedAt) >= sevenDaysAgo).length,
      archive: notes.filter(n => n.isArchived).length
    };
  }, [notes]);

  // Get current note and filtered notes
  const filteredNotes = getFilteredNotes();
  const selectedNote = notes.find(note => note.id === selectedNoteId) || null;
  const noteCounts = getNoteCounts();

  return (
    <div className="App">
      <Header
        onNewNote={handleNewNote}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      
      <div className="app-layout">
        <Sidebar
          activeFolder={filterFolder}
          onFolderChange={setFilterFolder}
          noteCounts={noteCounts}
        />
        
        <NotesList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onNoteSelect={handleNoteSelect}
        />
        
        <NoteEditor
          note={selectedNote}
          onNoteChange={handleNoteChange}
          onToggleFavorite={handleToggleFavorite}
          onToggleArchive={handleToggleArchive}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  );
}

export default App;
