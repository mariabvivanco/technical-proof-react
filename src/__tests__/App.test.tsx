import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

// When the modal is open there are two "Add" buttons:
// [0] = ActionButtons Add (open modal), [1] = modal Add (confirm)
const getPageAddButton = () => screen.getAllByRole('button', { name: /^add$/i })[0];
const getModalAddButton = () => {
  const all = screen.getAllByRole('button', { name: /^add$/i });
  return all[all.length - 1];
};

describe('App - Integration', () => {
  describe('initial render', () => {
    it('renders the page with 4 default items', () => {
      render(<App />);
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    it('renders the title', () => {
      render(<App />);
      expect(screen.getByText('This is a technical proof')).toBeInTheDocument();
    });

    it('Undo button is disabled initially', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    });

    it('Delete button is disabled initially', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('Add button is always enabled', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: /^add$/i })).toBeEnabled();
    });
  });

  describe('add item flow', () => {
    it('opens the modal when Add button is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByRole('button', { name: /^add$/i }));
      expect(screen.getByText('Add item to list')).toBeInTheDocument();
    });

    it('adds a new item to the list', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      await user.type(screen.getByPlaceholderText('Type the text here...'), 'New Item');
      await user.click(getModalAddButton());
      expect(screen.getAllByRole('listitem')).toHaveLength(5);
      expect(screen.getByText('New Item')).toBeInTheDocument();
    });

    it('closes the modal after adding an item', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      await user.type(screen.getByPlaceholderText('Type the text here...'), 'New Item');
      await user.click(getModalAddButton());
      await waitFor(() => expect(screen.queryByText('Add item to list')).not.toBeInTheDocument());
    });

    it('modal Add button is disabled when input is empty', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      expect(getModalAddButton()).toBeDisabled();
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    it('closes modal without adding when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      await user.type(screen.getByPlaceholderText('Type the text here...'), 'Some item');
      await user.click(screen.getByRole('button', { name: /cancel/i }));
      await waitFor(() => expect(screen.queryByText('Add item to list')).not.toBeInTheDocument());
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });
  });

  describe('select item flow', () => {
    it('selects an item when clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      const items = screen.getAllByRole('listitem');
      expect(items[0].className).toContain('selected');
    });

    it('enables the Delete button after selecting an item', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      expect(screen.getByRole('button', { name: /delete/i })).toBeEnabled();
    });

    it('deselects an item when clicked again', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByText('Item 1'));
      const items = screen.getAllByRole('listitem');
      expect(items[0].className).not.toContain('selected');
    });

    it('supports selecting multiple items', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByText('Item 3'));
      const items = screen.getAllByRole('listitem');
      expect(items[0].className).toContain('selected');
      expect(items[2].className).toContain('selected');
    });
  });

  describe('delete item flow', () => {
    it('deletes the selected item when Delete is clicked', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('deletes multiple selected items', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByText('Item 3'));
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('disables Delete button after deletion clears selection', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('deletes an item on double click', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.dblClick(screen.getByText('Item 2'));
      expect(screen.queryByText('Item 2')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });
  });

  describe('undo flow', () => {
    it('enables Undo after adding an item', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      await user.type(screen.getByPlaceholderText('Type the text here...'), 'New Item');
      await user.click(getModalAddButton());
      expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled();
    });

    it('restores list after undoing an add', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(getPageAddButton());
      await user.type(screen.getByPlaceholderText('Type the text here...'), 'New Item');
      await user.click(getModalAddButton());
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(screen.queryByText('New Item')).not.toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    it('restores list after undoing a delete', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('restores list after undoing a double-click delete', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.dblClick(screen.getByText('Item 2'));
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(4);
    });

    it('disables Undo button after all history is consumed', async () => {
      const user = userEvent.setup();
      render(<App />);
      await user.click(screen.getByText('Item 1'));
      await user.click(screen.getByRole('button', { name: /delete/i }));
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    });
  });
});
