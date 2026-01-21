import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Accordion from '../Accordion';

describe('Accordion', () => {
  it('should render expanded accordion with icon', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    
    render(
      <Accordion
        id="test-1"
        icon={icon}
        title="Test Title"
        isExpanded={true}
        onToggle={() => {}}
      >
        <div>Test Content</div>
      </Accordion>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render collapsed accordion without icon', () => {
    render(
      <Accordion
        id="test-2"
        title="Collapsed Title"
        isExpanded={false}
        onToggle={() => {}}
      >
        <div>Hidden Content</div>
      </Accordion>
    );

    expect(screen.getByText('Collapsed Title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Hidden Content')).toBeInTheDocument();
  });

  it('should call onToggle when button is clicked', async () => {
    const handleToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <Accordion
        id="test-3"
        title="Clickable"
        isExpanded={false}
        onToggle={handleToggle}
      >
        <div>Content</div>
      </Accordion>
    );

    await user.click(screen.getByRole('button'));
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});