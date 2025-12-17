import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Header from "../Header";
import { ReactNode } from "react";

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      LOGIN: "Log In",
      LOGOUT: "Log Out",
    };
    return translations[key] || key;
  },
}));

vi.mock("next/link", () => ({
  default: ({ 
    children, 
    href, 
    ...props 
  }: { 
    children: ReactNode; 
    href: string; 
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ui/Logo/Logo", () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="logo">Logo</div>
  ),
}));

vi.mock("@/components/ui/ThemeToggle/ThemeToggle", () => ({
  default: () => <button data-testid="theme-toggle">Theme</button>,
}));

vi.mock("@/components/ui/LanguageSwitcher/LanguageSwitcher", () => ({
  default: () => <button data-testid="language-switcher">Language</button>,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading state", () => {
    it("should not render auth buttons when loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
      });

      render(<Header />);

      expect(screen.queryByText("Log In")).not.toBeInTheDocument();
      expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
    });
  });

  describe("Unauthenticated state", () => {
    it("should render login button when not authenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      render(<Header />);

      expect(screen.getByText("Log In")).toBeInTheDocument();
      expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
    });

    it("should call signIn when login button is clicked", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByText("Log In"));

      expect(mockSignIn).toHaveBeenCalledWith("google", {
        callbackUrl: "/dashboard",
      });
    });
  });

  describe("Authenticated state", () => {
    it("should render logout button when authenticated", () => {
      mockUseSession.mockReturnValue({
        data: { user: { name: "Test User" } },
        status: "authenticated",
      });

      render(<Header />);

      expect(screen.getByText("Log Out")).toBeInTheDocument();
      expect(screen.queryByText("Log In")).not.toBeInTheDocument();
    });

    it("should call signOut when logout button is clicked", async () => {
      mockUseSession.mockReturnValue({
        data: { user: { name: "Test User" } },
        status: "authenticated",
      });

      const user = userEvent.setup();
      render(<Header />);

      await user.click(screen.getByText("Log Out"));

      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
    });
  });

  describe("Rendering", () => {
    it("should render logo and brand name", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      render(<Header />);

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("SparkPlan")).toBeInTheDocument();
    });

    it("should render theme toggle", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      render(<Header />);

      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("should render language switcher", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      render(<Header />);

      expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
    });

    it("should render link to home", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { container } = render(<Header />);

      const link = container.querySelector('a[href="/"]');
      expect(link).toBeInTheDocument();
    });
  });
});