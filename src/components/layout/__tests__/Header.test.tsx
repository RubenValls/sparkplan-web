import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Header from "../Header";
import { ReactNode } from "react";

const mockSignIn = vi.fn();
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();
const mockUsePathname = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      AUTH: {
        LOGIN: "Log In",
        LOGOUT: "Log Out",
      },
      HEADER: {
        PRICING: "Pricing",
        DASHBOARD: "Dashboard",
      },
    };
    return translations[namespace]?.[key] || key;
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

vi.mock("@/components/ui/SettingsMenu/SettingsMenu", () => ({
  default: () => <button data-testid="settings-menu">Settings</button>,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/dashboard");
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

    it("should render Pricing link when on dashboard", () => {
      mockUseSession.mockReturnValue({
        data: { user: { name: "Test User" } },
        status: "authenticated",
      });
      mockUsePathname.mockReturnValue("/dashboard");

      render(<Header />);

      expect(screen.getByText("Pricing")).toBeInTheDocument();
      const link = screen.getByText("Pricing").closest("a");
      expect(link).toHaveAttribute("href", "/plans");
    });

    it("should render Dashboard link when on plans page", () => {
      mockUseSession.mockReturnValue({
        data: { user: { name: "Test User" } },
        status: "authenticated",
      });
      mockUsePathname.mockReturnValue("/plans");

      render(<Header />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      const link = screen.getByText("Dashboard").closest("a");
      expect(link).toHaveAttribute("href", "/dashboard");
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

    it("should render settings menu", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      render(<Header />);

      expect(screen.getByTestId("settings-menu")).toBeInTheDocument();
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