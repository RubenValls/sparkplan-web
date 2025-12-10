import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "../Hero";
import { signIn } from "next-auth/react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("Hero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all content", () => {
    render(<Hero />);
    
    expect(screen.getByText("TITLE")).toBeInTheDocument();
    expect(screen.getByText("SUBTITLE")).toBeInTheDocument();
    expect(screen.getByText("GET_STARTED")).toBeInTheDocument();
  });

  it("should handle button click", async () => {
    const user = userEvent.setup();
    render(<Hero />);
    
    await user.click(screen.getByRole("button"));
    
    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard" });
  });
});