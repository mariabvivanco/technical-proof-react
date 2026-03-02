import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActionButtons from '../ActionButtons';

describe('ActionButtons', () => {
  const defaultProps = {
    hasSelected: false,
    canUndo: false,
    onUndo: vi.fn(),
    onDelete: vi.fn(),
    onAdd: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders Undo, Delete and Add buttons', () => {
    render(<ActionButtons {...defaultProps} />);
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  describe('Undo button', () => {
    it('is disabled when canUndo is false', () => {
      render(<ActionButtons {...defaultProps} canUndo={false} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled();
    });

    it('is enabled when canUndo is true', () => {
      render(<ActionButtons {...defaultProps} canUndo={true} />);
      expect(screen.getByRole('button', { name: /undo/i })).toBeEnabled();
    });

    it('calls onUndo when clicked', async () => {
      const user = userEvent.setup();
      render(<ActionButtons {...defaultProps} canUndo={true} />);
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(defaultProps.onUndo).toHaveBeenCalledTimes(1);
    });

    it('does not call onUndo when disabled', async () => {
      const user = userEvent.setup();
      render(<ActionButtons {...defaultProps} canUndo={false} />);
      await user.click(screen.getByRole('button', { name: /undo/i }));
      expect(defaultProps.onUndo).not.toHaveBeenCalled();
    });
  });

  describe('Delete button', () => {
    it('is disabled when no items are selected', () => {
      render(<ActionButtons {...defaultProps} hasSelected={false} />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
    });

    it('is enabled when items are selected', () => {
      render(<ActionButtons {...defaultProps} hasSelected={true} />);
      expect(screen.getByRole('button', { name: /delete/i })).toBeEnabled();
    });

    it('calls onDelete when clicked', async () => {
      const user = userEvent.setup();
      render(<ActionButtons {...defaultProps} hasSelected={true} />);
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    });

    it('does not call onDelete when disabled', async () => {
      const user = userEvent.setup();
      render(<ActionButtons {...defaultProps} hasSelected={false} />);
      await user.click(screen.getByRole('button', { name: /delete/i }));
      expect(defaultProps.onDelete).not.toHaveBeenCalled();
    });
  });

  describe('Add button', () => {
    it('is always enabled', () => {
      render(<ActionButtons {...defaultProps} />);
      expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
    });

    it('calls onAdd when clicked', async () => {
      const user = userEvent.setup();
      render(<ActionButtons {...defaultProps} />);
      await user.click(screen.getByRole('button', { name: /add/i }));
      expect(defaultProps.onAdd).toHaveBeenCalledTimes(1);
    });
  });
});
