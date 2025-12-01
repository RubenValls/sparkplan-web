import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Features from "../Features";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("Features", () => {
  it("should render all features", () => {
    render(<Features />);
    
    expect(screen.getByText("HEADING")).toBeInTheDocument();
    
    expect(screen.getByText("FEATURE_1_TITLE")).toBeInTheDocument();
    expect(screen.getByText("FEATURE_1_DESC")).toBeInTheDocument();
    expect(screen.getByText("⚡")).toBeInTheDocument();
    
    expect(screen.getByText("FEATURE_2_TITLE")).toBeInTheDocument();
    expect(screen.getByText("FEATURE_2_DESC")).toBeInTheDocument();
    expect(screen.getByText("🌍")).toBeInTheDocument();
    
    expect(screen.getByText("FEATURE_3_TITLE")).toBeInTheDocument();
    expect(screen.getByText("FEATURE_3_DESC")).toBeInTheDocument();
    expect(screen.getByText("☁️")).toBeInTheDocument();
  });
});