import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Logo from "../Logo";

describe("Logo", () => {
  it("should render without className", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveClass();
  });

  it("should render with custom className", () => {
    const { container } = render(<Logo className="custom-logo" />);
    const svg = container.querySelector("svg");
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("custom-logo");
  });
});