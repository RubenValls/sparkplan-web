import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CTA from "../CTA";
import { signIn } from "next-auth/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));


describe("CTA", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with session false", () => {
    render(<CTA />);
    expect(screen.getByText("HEADING")).toBeInTheDocument();
    expect(screen.getByText("TEXT")).toBeInTheDocument();
    expect(screen.getByText("START_NOW")).toBeInTheDocument();
  });

  it("should handle button click", async () => {
      const user = userEvent.setup();
      render(<CTA />);
      
      await user.click(screen.getByRole("button"));
      
      expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard" });
    });
});