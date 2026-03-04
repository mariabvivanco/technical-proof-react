import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ItemList from '../ItemList';
import type { ListItem } from '../../../types';

const mockItems: ListItem[] = [
  { id: '1', text: 'Item One' },
  { id: '2', text: 'Item Two' },
  { id: '3', text: 'Item Three' },
];

describe('ItemList', () => {
  const defaultProps = {
    items: mockItems,
    selectedIds: new Set<string>(),
    onSelect: vi.fn(),
    onDoubleClick: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders all items in the list', () => {
    render(<ItemList {...defaultProps} />);
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
    expect(screen.getByText('Item Three')).toBeInTheDocument();
  });

  it('renders an empty list when no items are provided', () => {
    render(<ItemList {...defaultProps} items={[]} />);
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('calls onSelect with the correct id when an item is clicked', async () => {
    const user = userEvent.setup();
    render(<ItemList {...defaultProps} />);
    await user.click(screen.getByText('Item One'));
    expect(defaultProps.onSelect).toHaveBeenCalledWith('1');
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onDoubleClick with the correct id when an item is double-clicked', async () => {
    const user = userEvent.setup();
    render(<ItemList {...defaultProps} />);
    await user.dblClick(screen.getByText('Item Two'));
    expect(defaultProps.onDoubleClick).toHaveBeenCalledWith('2');
    expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the selected modifier class to selected items', () => {
    render(<ItemList {...defaultProps} selectedIds={new Set(['2'])} />);
    const items = screen.getAllByRole('option');
    expect(items[0].className).not.toContain('selected');
    expect(items[1].className).toContain('selected');
    expect(items[2].className).not.toContain('selected');
  });

  it('applies selected class to multiple selected items', () => {
    render(<ItemList {...defaultProps} selectedIds={new Set(['1', '3'])} />);
    const items = screen.getAllByRole('option');
    expect(items[0].className).toContain('selected');
    expect(items[1].className).not.toContain('selected');
    expect(items[2].className).toContain('selected');
  });

  it('renders the correct number of list items', () => {
    render(<ItemList {...defaultProps} />);
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('clicking different items calls onSelect with correct ids', async () => {
    const user = userEvent.setup();
    render(<ItemList {...defaultProps} />);
    await user.click(screen.getByText('Item One'));
    await user.click(screen.getByText('Item Three'));
    expect(defaultProps.onSelect).toHaveBeenNthCalledWith(1, '1');
    expect(defaultProps.onSelect).toHaveBeenNthCalledWith(2, '3');
  });
});
