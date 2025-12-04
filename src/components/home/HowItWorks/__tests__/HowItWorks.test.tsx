import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HowItWorks from "../HowItWorks";

// Mock de next-intl
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("HowItWorks", () => {
  it("should render all steps", () => {
    render(<HowItWorks />);
    
    expect(screen.getByText("HEADING")).toBeInTheDocument();
    
    expect(screen.getByText("STEP_1_TITLE")).toBeInTheDocument();
    expect(screen.getByText("STEP_1_DESC")).toBeInTheDocument();
    
    expect(screen.getByText("STEP_2_TITLE")).toBeInTheDocument();
    expect(screen.getByText("STEP_2_DESC")).toBeInTheDocument();
    
    expect(screen.getByText("STEP_3_TITLE")).toBeInTheDocument();
    expect(screen.getByText("STEP_3_DESC")).toBeInTheDocument();
    
    expect(screen.getByText("STEP_4_TITLE")).toBeInTheDocument();
    expect(screen.getByText("STEP_4_DESC")).toBeInTheDocument();
  });
});