import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete item?',
    message: 'This action cannot be undone',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render dialog and call callbacks on button clicks', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDialog
        {...defaultProps}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Delete item?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when clicking close button or overlay', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    const closeButton = screen.getByLabelText('Cerrar');
    await user.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);

    const overlay = screen.getByRole('dialog').parentElement!;
    await user.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('should call onCancel when pressing Escape key', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should apply correct variant class', () => {
    const { rerender } = render(
      <ConfirmDialog {...defaultProps} variant="danger" />
    );

    let confirmButton = screen.getByText('Delete').closest('button')!;
    expect(confirmButton.className).toContain('btn--danger');

    rerender(<ConfirmDialog {...defaultProps} variant="warning" />);
    confirmButton = screen.getByText('Delete').closest('button')!;
    expect(confirmButton.className).toContain('btn--primary');

    rerender(<ConfirmDialog {...defaultProps} variant="info" />);
    confirmButton = screen.getByText('Delete').closest('button')!;
    expect(confirmButton.className).toContain('btn--primary');
  });

  it('should set body overflow when open and restore on unmount', () => {
    const { unmount } = render(<ConfirmDialog {...defaultProps} />);

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});