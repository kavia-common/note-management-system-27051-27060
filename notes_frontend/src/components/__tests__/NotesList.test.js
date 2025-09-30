import { render, screen, fireEvent } from '@testing-library/react';
import NotesList from '../NotesList';

describe('NotesList Component', () => {
  const mockNotes = [
    {
      id: 'note-1',
      title: 'First Note',
      content: 'This is the first note content',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
      isFavorite: false,
      isArchived: false
    },
    {
      id: 'note-2',
      title: 'Second Note',
      content: 'This is the second note content',
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z',
      isFavorite: true,
      isArchived: false
    },
    {
      id: 'note-3',
      title: 'Third Note',
      content: 'This is the third note content',
      createdAt: '2024-01-03T10:00:00Z',
      updatedAt: '2024-01-03T10:00:00Z',
      isFavorite: false,
      isArchived: false
    }
  ];

  test('renders all notes in the list', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();
    expect(screen.getByText('Third Note')).toBeInTheDocument();
  });

  test('displays favorite indicator for favorited notes', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    // Second note is favorited, should have star
    const secondNoteTitle = screen.getByText('Second Note').closest('.note-item-title');
    expect(secondNoteTitle).toHaveTextContent('⭐');
  });

  test('highlights selected note', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId="note-2"
        onNoteSelect={onNoteSelect}
      />
    );
    
    const selectedNote = screen.getByText('Second Note').closest('.note-item');
    expect(selectedNote).toHaveClass('selected');
  });

  test('calls onNoteSelect when a note is clicked', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    const firstNote = screen.getByText('First Note').closest('.note-item');
    fireEvent.click(firstNote);
    
    expect(onNoteSelect).toHaveBeenCalledWith('note-1');
  });

  test('displays empty state when no notes', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={[]}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    expect(screen.getByText(/no notes found/i)).toBeInTheDocument();
    expect(screen.getByText(/create a new note to get started/i)).toBeInTheDocument();
  });

  test('renders note snippets correctly', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    expect(screen.getByText(/this is the first note content/i)).toBeInTheDocument();
    expect(screen.getByText(/this is the second note content/i)).toBeInTheDocument();
  });

  test('filters notes by search criteria', () => {
    const filteredNotes = mockNotes.filter(note => 
      note.title.toLowerCase().includes('first')
    );
    
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={filteredNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.queryByText('Second Note')).not.toBeInTheDocument();
    expect(screen.queryByText('Third Note')).not.toBeInTheDocument();
  });

  test('supports keyboard navigation', () => {
    const onNoteSelect = jest.fn();
    
    render(
      <NotesList
        notes={mockNotes}
        selectedNoteId={null}
        onNoteSelect={onNoteSelect}
      />
    );
    
    const firstNote = screen.getByText('First Note').closest('.note-item');
    fireEvent.keyPress(firstNote, { key: 'Enter', code: 'Enter' });
    
    expect(onNoteSelect).toHaveBeenCalledWith('note-1');
  });
});
