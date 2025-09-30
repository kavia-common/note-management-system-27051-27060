import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteEditor from '../NoteEditor';

describe('NoteEditor Component', () => {
  const mockNote = {
    id: 'test-note-1',
    title: 'Test Note',
    content: 'This is test content',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    isFavorite: false,
    isArchived: false
  };

  test('displays empty state when no note is selected', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={null}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    expect(screen.getByText(/select a note to start editing/i)).toBeInTheDocument();
  });

  test('displays note title and content when note is selected', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const titleInput = screen.getByDisplayValue('Test Note');
    const contentTextarea = screen.getByDisplayValue('This is test content');
    
    expect(titleInput).toBeInTheDocument();
    expect(contentTextarea).toBeInTheDocument();
  });

  test('calls onNoteChange when title is updated', async () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const titleInput = screen.getByDisplayValue('Test Note');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    
    await waitFor(() => {
      expect(onNoteChange).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockNote,
          title: 'Updated Title'
        })
      );
    });
  });

  test('calls onNoteChange when content is updated', async () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const contentTextarea = screen.getByDisplayValue('This is test content');
    fireEvent.change(contentTextarea, { target: { value: 'Updated content' } });
    
    await waitFor(() => {
      expect(onNoteChange).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockNote,
          content: 'Updated content'
        })
      );
    });
  });

  test('calls onToggleFavorite when favorite button is clicked', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(favoriteButton);
    
    expect(onToggleFavorite).toHaveBeenCalledWith('test-note-1');
  });

  test('displays active state for favorite button when note is favorited', () => {
    const favoritedNote = { ...mockNote, isFavorite: true };
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={favoritedNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const favoriteButton = screen.getByRole('button', { name: /remove from favorites/i });
    expect(favoriteButton).toHaveClass('active');
  });

  test('calls onToggleArchive when archive button is clicked', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const archiveButton = screen.getByRole('button', { name: /archive note/i });
    fireEvent.click(archiveButton);
    
    expect(onToggleArchive).toHaveBeenCalledWith('test-note-1');
  });

  test('shows delete confirmation modal when delete is clicked', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    const deleteButton = screen.getByRole('button', { name: /delete note/i });
    fireEvent.click(deleteButton);
    
    expect(screen.getByText(/delete note\?/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
  });

  test('calls onDelete when deletion is confirmed', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    // Open delete modal
    const deleteButton = screen.getByRole('button', { name: /delete note/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    expect(onDelete).toHaveBeenCalledWith('test-note-1');
  });

  test('closes delete modal when cancel is clicked', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    // Open delete modal
    const deleteButton = screen.getByRole('button', { name: /delete note/i });
    fireEvent.click(deleteButton);
    
    // Cancel deletion
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Modal should be closed
    expect(screen.queryByText(/delete note\?/i)).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  test('renders toolbar buttons with correct aria labels', () => {
    const onNoteChange = jest.fn();
    const onToggleFavorite = jest.fn();
    const onToggleArchive = jest.fn();
    const onDelete = jest.fn();
    
    render(
      <NoteEditor
        note={mockNote}
        onNoteChange={onNoteChange}
        onToggleFavorite={onToggleFavorite}
        onToggleArchive={onToggleArchive}
        onDelete={onDelete}
      />
    );
    
    expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/archive note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete note/i)).toBeInTheDocument();
  });
});
