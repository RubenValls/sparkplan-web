import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PricingCard from '../PricingCard';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'PRICING.FREE': {
        TITLE: 'FREE',
        DESCRIPTION: 'Perfect to try',
        PRICE: 'Free',
        BUTTON: 'Start Free',
        FEATURE_1: 'Feature 1',
        FEATURE_2: 'Feature 2',
        FEATURE_3: 'Feature 3',
        FEATURE_4: 'Feature 4',
        FEATURE_5: 'No history',
      },
      'PRICING.PLUS': {
        TITLE: 'PLUS',
        DESCRIPTION: 'For entrepreneurs',
        PRICE: '$1.49',
        PERIOD: '/month',
        BUTTON: 'Select Plan',
        FEATURE_1: 'Feature 1',
        FEATURE_2: 'Feature 2',
        FEATURE_3: 'Feature 3',
        FEATURE_4: 'Feature 4',
        FEATURE_5: 'History',
        FEATURE_6: 'Support',
      },
      'PRICING.PRO': {
        TITLE: 'PRO',
        DESCRIPTION: 'For professionals',
        PRICE: '$4.99',
        PERIOD: '/month',
        BUTTON: 'Select Plan',
        FEATURE_1: 'Feature 1',
        FEATURE_2: 'Feature 2',
        FEATURE_3: 'Feature 3',
        FEATURE_4: 'Feature 4',
        FEATURE_5: 'History',
        FEATURE_6: 'Early access',
      },
      PRICING: {
        MOST_POPULAR: 'Most popular',
        CURRENT_PLAN: 'Current plan',
      },
    };

    return translations[namespace]?.[key] || key;
  },
}));

describe('PricingCard', () => {
  it('should render FREE plan without period and with disabled feature', () => {
    render(<PricingCard plan="FREE" />);

    expect(screen.getByText('FREE')).toBeInTheDocument();
    expect(screen.getByText('Perfect to try')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.queryByText('/month')).not.toBeInTheDocument();
    expect(screen.getByText('No history')).toBeInTheDocument();
    expect(screen.queryByText('Early access')).not.toBeInTheDocument();
  });

  it('should render PLUS plan with popular badge and period', () => {
    render(<PricingCard plan="PLUS" isPopular />);

    expect(screen.getByText('Most popular')).toBeInTheDocument();
    expect(screen.getByText('PLUS')).toBeInTheDocument();
    expect(screen.getByText('$1.49')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.queryByText('Early access')).not.toBeInTheDocument();
  });

  it('should render PRO plan with Feature 6 and disabled button when isCurrentPlan', () => {
    render(<PricingCard plan="PRO" isCurrentPlan />);

    expect(screen.getByText('PRO')).toBeInTheDocument();
    expect(screen.getByText('Early access')).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Current plan');
    expect(button).toBeDisabled();
  });

  it('should not render button when showButton is false', () => {
    render(<PricingCard plan="FREE" showButton={false} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onClick and show custom buttonText', async () => {
    const onButtonClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PricingCard
        plan="PLUS"
        onButtonClick={onButtonClick}
        buttonText="Custom Button"
      />
    );

    const button = screen.getByText('Custom Button');
    await user.click(button);

    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});