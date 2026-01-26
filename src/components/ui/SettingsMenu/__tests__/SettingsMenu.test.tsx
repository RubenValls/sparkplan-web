import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsMenu from '../SettingsMenu';

vi.mock('@/components/ui/ThemeToggle/ThemeToggle', () => ({
  default: ({ variant }: { variant?: string }) => (
    <button data-testid="theme-toggle" data-variant={variant}>
      Theme Toggle
    </button>
  ),
}));

vi.mock('@/components/ui/LanguageSwitcher/LanguageSwitcher', () => ({
  default: ({ variant }: { variant?: string }) => (
    <button data-testid="language-switcher" data-variant={variant}>
      Language Switcher
    </button>
  ),
}));

describe('SettingsMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render trigger button', () => {
    render(<SettingsMenu />);

    const trigger = screen.getByLabelText('Settings');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
  });

  it('should not render dropdown when closed', () => {
    render(<SettingsMenu />);

    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
    expect(screen.queryByTestId('language-switcher')).not.toBeInTheDocument();
  });

  it('should open dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsMenu />);

    const trigger = screen.getByLabelText('Settings');
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute('data-variant', 'menu');
    expect(screen.getByTestId('language-switcher')).toHaveAttribute('data-variant', 'menu');
  });

  it('should close dropdown when trigger is clicked again', async () => {
    const user = userEvent.setup();
    render(<SettingsMenu />);

    const trigger = screen.getByLabelText('Settings');
    
    await user.click(trigger);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SettingsMenu />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const trigger = screen.getByLabelText('Settings');
    await user.click(trigger);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    await user.click(outside);
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
  });

  it('should close dropdown when pressing Escape', async () => {
    const user = userEvent.setup();
    render(<SettingsMenu />);

    const trigger = screen.getByLabelText('Settings');
    await user.click(trigger);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByTestId('theme-toggle')).not.toBeInTheDocument();
  });
});