import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PricingSection from '../PricingSection';
import { signIn } from 'next-auth/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('@/config', () => ({
  ROUTES: {
    DASHBOARD: '/dashboard',
  },
}));

vi.mock('@/components/pricing/PricingPlans/PricingPlans', () => ({
  default: ({ showButtons, onFreePlanClick }: { 
    showButtons: { free?: boolean; plus?: boolean; pro?: boolean };
    onFreePlanClick?: () => void;
  }) => (
    <div data-testid="pricing-plans">
      {showButtons.free && (
        <button onClick={onFreePlanClick}>Free Plan</button>
      )}
    </div>
  ),
}));

describe('PricingSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render section with heading and subheading', () => {
    render(<PricingSection />);

    expect(screen.getByText('HEADING')).toBeInTheDocument();
    expect(screen.getByText('SUBHEADING')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-plans')).toBeInTheDocument();
  });

  it('should call signIn when free plan button is clicked', async () => {
    const user = userEvent.setup();
    render(<PricingSection />);

    const button = screen.getByText('Free Plan');
    await user.click(button);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/dashboard' });
  });
});