import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "../Hero";

// Mock de next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("Hero", () => {
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
    // No lanza error = test pasa
  });
});