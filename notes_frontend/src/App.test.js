import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as storage from './utils/storage';

// Mock storage functions
jest.mock('./utils/storage', () => ({
  loadNotes: jest.fn(),
  saveNote: jest.fn(),
  deleteNote: jest.fn(),
  toggleFavorite: jest.fn(),
  toggleArchive: jest.fn(),
  generateId: jest.fn()
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    storage.loadNotes.mockReturnValue([]);
    storage.generateId.mockReturnValue('test-note-id-123');
    storage.saveNote.mockImplementation((note) => note);
  });

  test('renders app header with title', () => {
    render(<App />);
    const titleElement = screen.getByText(/📝 Notes/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('creates a new note when New Note button is clicked', async () => {
    render(<App />);
    
    const newNoteButton = screen.getByRole('button', { name: /create new note/i });
    fireEvent.click(newNoteButton);
    
    await waitFor(() => {
      expect(storage.saveNote).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-note-id-123',
          title: 'Untitled',
          content: '',
          isFavorite: false,
          isArchived: false
        })
      );
    });
  });

  test('creates note and selects it in the list and editor', async () => {
    render(<App />);
    
    // Click New Note button
    const newNoteButton = screen.getByRole('button', { name: /create new note/i });
    fireEvent.click(newNoteButton);
    
    // Wait for note to appear in list
    await waitFor(() => {
      const noteInList = screen.getByText('Untitled');
      expect(noteInList).toBeInTheDocument();
    });
    
    // Check that editor shows the note
    const titleInput = screen.getByPlaceholderText(/note title/i);
    expect(titleInput).toHaveValue('Untitled');
  });

  test('displays existing notes from storage on load', () => {
    const mockNotes = [
      {
        id: 'note-1',
        title: 'Test Note 1',
        content: 'This is test content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      },
      {
        id: 'note-2',
        title: 'Test Note 2',
        content: 'Another test note',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: true,
        isArchived: false
      }
    ];
    
    storage.loadNotes.mockReturnValue(mockNotes);
    
    render(<App />);
    
    expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    expect(screen.getByText('Test Note 2')).toBeInTheDocument();
  });

  test('selects note when clicked in list', async () => {
    const mockNotes = [
      {
        id: 'note-1',
        title: 'First Note',
        content: 'First content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      },
      {
        id: 'note-2',
        title: 'Second Note',
        content: 'Second content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      }
    ];
    
    storage.loadNotes.mockReturnValue(mockNotes);
    
    render(<App />);
    
    // Click on second note
    const secondNote = screen.getByText('Second Note');
    fireEvent.click(secondNote);
    
    // Check that editor shows second note
    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText(/note title/i);
      expect(titleInput).toHaveValue('Second Note');
    });
  });

  test('toggles theme when theme button is clicked', () => {
    render(<App />);
    
    const themeButton = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(themeButton);
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    const updatedThemeButton = screen.getByRole('button', { name: /switch to light mode/i });
    expect(updatedThemeButton).toBeInTheDocument();
  });

  test('filters notes by search query', async () => {
    const mockNotes = [
      {
        id: 'note-1',
        title: 'Shopping List',
        content: 'Buy groceries',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      },
      {
        id: 'note-2',
        title: 'Meeting Notes',
        content: 'Discuss project',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false
      }
    ];
    
    storage.loadNotes.mockReturnValue(mockNotes);
    
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/search notes/i);
    fireEvent.change(searchInput, { target: { value: 'shopping' } });
    
    await waitFor(() => {
      expect(screen.getByText('Shopping List')).toBeInTheDocument();
      expect(screen.queryByText('Meeting Notes')).not.toBeInTheDocument();
    });
  });
});
