import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WelcomeCard from "../WelcomeCard";
import { User } from "next-auth";

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
      const user: User = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      };

      render(<WelcomeCard user={user} />);
      expect(screen.getByText(/Hello John!/)).toBeInTheDocument();
    });

    it("should display full name when user has single word name", () => {
      const user: User = {
        id: "2",
        name: "Madonna",
        email: "madonna@example.com",
      };

      render(<WelcomeCard user={user} />);
      expect(screen.getByText(/Hello Madonna!/)).toBeInTheDocument();
    });

    it('should display "User" when name is null', () => {
      const user: User = {
        id: "3",
        name: null,
        email: "test@example.com",
      };

      render(<WelcomeCard user={user} />);
      expect(screen.getByText(/Hello User!/)).toBeInTheDocument();
    });

    it('should display "User" when name is undefined', () => {
      const user: User = {
        id: "4",
        name: undefined,
        email: "test@example.com",
      };

      render(<WelcomeCard user={user} />);
      expect(screen.getByText(/Hello User!/)).toBeInTheDocument();
    });

    it('should display "User" when name is empty string', () => {
      const user: User = {
        id: "5",
        name: "",
        email: "test@example.com",
      };

      render(<WelcomeCard user={user} />);
      expect(screen.getByText(/Hello User!/)).toBeInTheDocument();
    });
  });

  describe("Rendering", () => {
    it("should render greeting and subtitle", () => {
      const user: User = {
        id: "6",
        name: "Alice",
        email: "alice@example.com",
      };

      render(<WelcomeCard user={user} />);
      
      expect(screen.getByText(/Hello Alice!/)).toBeInTheDocument();
      expect(
        screen.getByText("Let's turn your ideas into action plans")
      ).toBeInTheDocument();
    });

    it("should render Sparkles icon", () => {
      const user: User = {
        id: "7",
        name: "Bob",
        email: "bob@example.com",
      };

      const { container } = render(<WelcomeCard user={user} />);
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });
});