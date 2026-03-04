import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddItemModal from '../AddItemModal';

vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return { ...actual, createPortal: (node: React.ReactNode) => node };
});

describe('AddItemModal', () => {
  const defaultProps = {
    open: true,
    onAdd: vi.fn().mockResolvedValue(undefined),
    onClose: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders when open is true', () => {
    render(<AddItemModal {...defaultProps} />);
    expect(screen.getByText('Add item to list')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type the text here...')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(<AddItemModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Add item to list')).not.toBeInTheDocument();
  });

  it('Add button is disabled when input is empty', () => {
    render(<AddItemModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  });

  it('Add button is disabled when input contains only whitespace', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), '   ');
    expect(screen.getByRole('button', { name: /^add$/i })).toBeDisabled();
  });

  it('Add button becomes enabled when input has valid text', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), 'Hello');
    expect(screen.getByRole('button', { name: /^add$/i })).toBeEnabled();
  });

  it('calls onAdd with the typed text when Add button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), 'New item');
    await user.click(screen.getByRole('button', { name: /^add$/i }));
    expect(defaultProps.onAdd).toHaveBeenCalledWith('New item');
    expect(defaultProps.onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('submits the item when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), 'New item{Enter}');
    expect(defaultProps.onAdd).toHaveBeenCalledWith('New item');
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), '{Escape}');
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not call onAdd when Enter is pressed with empty input', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    await user.type(screen.getByPlaceholderText('Type the text here...'), '{Enter}');
    expect(defaultProps.onAdd).not.toHaveBeenCalled();
  });

  it('clears the input after adding an item', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Type the text here...');
    await user.type(input, 'New item');
    await user.click(screen.getByRole('button', { name: /^add$/i }));
    expect(input).toHaveValue('');
  });

  it('clears the input when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<AddItemModal {...defaultProps} />);
    const input = screen.getByPlaceholderText('Type the text here...');
    await user.type(input, 'Some text');
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(input).toHaveValue('');
  });
});
