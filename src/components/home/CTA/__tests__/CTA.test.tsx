import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CTA from "../CTA";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("CTA", () => {
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
  });
});