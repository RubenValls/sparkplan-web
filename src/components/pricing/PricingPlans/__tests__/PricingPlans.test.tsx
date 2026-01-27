import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import PricingPlans from '../PricingPlans';
import { PlanType } from '@/types';

// Mock PricingCard
vi.mock('@/components/ui/PricingCard/PricingCard', () => ({
  default: ({ plan, isCurrentPlan, isPopular, showButton, onButtonClick }: {
    plan: PlanType;
    isCurrentPlan?: boolean;
    isPopular?: boolean;
    onButtonClick?: () => void;
    buttonText?: string;
    showButton?: boolean;
  }) => (
    <div data-testid={`card-${plan}`}>
      <span>{plan}</span>
      {isCurrentPlan && <span>Current</span>}
      {isPopular && <span>Popular</span>}
      {showButton && (
        <button onClick={onButtonClick}>
          {plan} Button
        </button>
      )}
    </div>
  ),
}));

describe('PricingPlans', () => {
  it('should render all three pricing cards', () => {
    render(<PricingPlans />);

    expect(screen.getByTestId('card-FREE')).toBeInTheDocument();
    expect(screen.getByTestId('card-PLUS')).toBeInTheDocument();
    expect(screen.getByTestId('card-PRO')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument(); 
  });

  it('should mark FREE as current plan', () => {
    render(<PricingPlans currentPlan="FREE" />);

    const freeCard = screen.getByTestId('card-FREE');
    expect(freeCard).toHaveTextContent('Current');
  });

  it('should mark PLUS as current plan', () => {
    render(<PricingPlans currentPlan="PLUS" />);

    const plusCard = screen.getByTestId('card-PLUS');
    expect(plusCard).toHaveTextContent('Current');
  });

  it('should mark PRO as current plan', () => {
    render(<PricingPlans currentPlan="PRO" />);

    const proCard = screen.getByTestId('card-PRO');
    expect(proCard).toHaveTextContent('Current');
  });

  it('should hide buttons based on showButtons prop', () => {
    render(
      <PricingPlans
        showButtons={{ free: false, plus: true, pro: false }}
      />
    );

    expect(screen.queryByText('FREE Button')).not.toBeInTheDocument();
    expect(screen.getByText('PLUS Button')).toBeInTheDocument();
    expect(screen.queryByText('PRO Button')).not.toBeInTheDocument();
  });

  it('should call onClick handlers when buttons are clicked', async () => {
    const onFreePlanClick = vi.fn();
    const onPlusPlanClick = vi.fn();
    const onProPlanClick = vi.fn();
    const user = userEvent.setup();

    render(
      <PricingPlans
        onFreePlanClick={onFreePlanClick}
        onPlusPlanClick={onPlusPlanClick}
        onProPlanClick={onProPlanClick}
      />
    );

    await user.click(screen.getByText('FREE Button'));
    expect(onFreePlanClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('PLUS Button'));
    expect(onPlusPlanClick).toHaveBeenCalledTimes(1);

    await user.click(screen.getByText('PRO Button'));
    expect(onProPlanClick).toHaveBeenCalledTimes(1);
  });
});