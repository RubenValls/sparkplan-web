import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../ThemeToggle";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Moon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="moon-icon">Moon</div>
  ),
  Sun: ({ className }: { className?: string }) => (
    <div className={className} data-testid="sun-icon">Sun</div>
  ),
}));

// Wrapper ThemeProvider
const ThemeWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider attribute="data-theme" defaultTheme="light">
    {children}
  </ThemeProvider>
);

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock: { [key: string]: string } = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        Object.keys(localStorageMock).forEach(key => delete localStorageMock[key]);
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock setAttribute
    document.documentElement.setAttribute = vi.fn();
  });

  it("should render placeholder when not mounted", () => {
    const { container } = render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    const button = buttons[0];
    expect(button).toBeInTheDocument();
  });

  it("should render theme toggle after mounting", async () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button.getAttribute('aria-label')).toMatch(/switch to/i);
    }, { timeout: 3000 });
  });

  it("should show moon icon in light mode", async () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("should toggle from light to dark", async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    }, { timeout: 3000 });

    const button = await screen.findByRole("button", { name: /switch to dark/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("should toggle from dark to light", async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider attribute="data-theme" defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    }, { timeout: 3000 });

    const button = screen.getByRole("button", { name: /switch to light/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("should have correct aria labels", async () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute('aria-label');
      expect(button).toHaveAttribute('title');
    }, { timeout: 3000 });
  });

  it("should render with correct styles", async () => {
    const { container } = render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    );

    await waitFor(() => {
      const button = screen.getByRole("button");
      expect(button.className).toMatch(/themeToggle/);
    }, { timeout: 3000 });
  });
});