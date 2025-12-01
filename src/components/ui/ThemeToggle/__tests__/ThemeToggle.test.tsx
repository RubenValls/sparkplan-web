import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../ThemeToggle";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Moon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="moon-icon">Moon</div>
  ),
  Sun: ({ className }: { className?: string }) => (
    <div className={className} data-testid="sun-icon">Sun</div>
  ),
}));

describe("ThemeToggle", () => {
  let localStorageMock: { [key: string]: string };
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
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

    // Spy on console.log
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  it("should render placeholder when not mounted", () => {
    const { container } = render(<ThemeToggle />);
    const placeholder = container.querySelector('[aria-hidden="true"]');
    
    expect(placeholder).toBeInTheDocument();
  });

  it("should initialize with light theme and toggle to dark", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Esperar a que el componente esté montado
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    // Debe mostrar Moon (para cambiar a dark)
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();

    // Click para cambiar a dark
    await user.click(screen.getByRole("button"));

    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith("data-theme", "dark");
    expect(consoleLogSpy).toHaveBeenCalledWith("Theme toggled to", "dark");
  });

  it("should initialize with saved dark theme and toggle to light", async () => {
    localStorageMock["theme"] = "dark";
    
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    // Debe mostrar Sun (para cambiar a light)
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();

    // Click para cambiar a light
    await user.click(screen.getByRole("button"));

    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith("data-theme", "light");
    expect(consoleLogSpy).toHaveBeenCalledWith("Theme toggled to", "light");
  });

  it("should use system preference when no saved theme", async () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    // Con matchMedia devolviendo true para dark, debe mostrar Sun
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });
});