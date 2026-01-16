import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WelcomeCard from "../WelcomeCard";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      GREETING: "Hello",
      SUBTITLE: "Let's turn your ideas into action plans",
    };
    return translations[key] || key;
  },
}));

describe("WelcomeCard", () => {
  describe("User name display", () => {
    it("should display first name from full name", () => {
      render(<WelcomeCard user="John Doe" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/John/)).toBeInTheDocument();
    });

    it("should display single word name", () => {
      render(<WelcomeCard user="Madonna" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/Madonna/)).toBeInTheDocument();
    });

    it('should display "User" when user is null', () => {
      render(<WelcomeCard user={null} />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/User/)).toBeInTheDocument();
    });

    it('should display "User" when user is undefined', () => {
      render(<WelcomeCard user={undefined} />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/User/)).toBeInTheDocument();
    });

    it('should display "User" when user is empty string', () => {
      render(<WelcomeCard user="" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/User/)).toBeInTheDocument();
    });
  });

  describe("Rendering", () => {
    it("should render greeting and subtitle", () => {
      render(<WelcomeCard user="Alice" />);
      
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
      expect(
        screen.getByText("Let's turn your ideas into action plans")
      ).toBeInTheDocument();
    });

    it("should render Sparkles icon", () => {
      const { container } = render(<WelcomeCard user="Bob" />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle very long names (extracts first name)", () => {
      render(<WelcomeCard user="Christopher Alexander Montgomery Richardson" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/Christopher/)).toBeInTheDocument();
    });

    it("should handle names with special characters", () => {
      render(<WelcomeCard user="José María" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/José/)).toBeInTheDocument();
    });

    it("should handle single names with numbers", () => {
      render(<WelcomeCard user="User123" />);
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText(/User123/)).toBeInTheDocument();
    });
  });
});