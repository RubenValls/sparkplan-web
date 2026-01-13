import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import PlanResult from "../PlanResult";

describe("PlanResult", () => {
  it("should render error state", () => {
    render(<PlanResult success={false} message="Error message" />);
    
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("should return null when success without plan", () => {
    const { container } = render(<PlanResult success={true} message="Success" />);
    
    expect(container.firstChild).toBeNull();
  });

  it("should render success state with plan", () => {
    render(
      <PlanResult
        success={true}
        message="Success message"
        plan="## 1. Test Section"
      />
    );

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("SparkPlan")).toBeInTheDocument();
  });

  it("should call onDownloadPDF when button clicked", async () => {
    const handleDownload = vi.fn();
    const user = userEvent.setup();

    render(
      <PlanResult
        success={true}
        message="Success"
        plan="# Plan"
        onDownloadPDF={handleDownload}
      />
    );

    await user.click(screen.getByText("PDF"));
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });

  it("should call onSaveToDrive when button clicked", async () => {
    const handleSave = vi.fn();
    const user = userEvent.setup();

    render(
      <PlanResult
        success={true}
        message="Success"
        plan="# Plan"
        onSaveToDrive={handleSave}
      />
    );

    await user.click(screen.getByText("Drive"));
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it("should render inline code", () => {
    const { container } = render(
      <PlanResult success={true} message="Success" plan="Text with `inline code` here" />
    );

    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
  });

  it("should render code block with className", () => {
    const { container } = render(
      <PlanResult 
        success={true} 
        message="Success" 
        plan="```js\ncode\n```" 
      />
    );

    const codes = container.querySelectorAll('code');
    const codeWithClass = Array.from(codes).find(code => code.className);
    expect(codeWithClass).toBeInTheDocument();
  });

  it("should render all markdown elements", () => {
    const { container } = render(
      <PlanResult 
        success={true} 
        message="Success" 
        plan={`### H3 Title

#### H4 Title

Paragraph text

- List item
- Another item

1. Ordered item
2. Another ordered

> Blockquote text

| Header |
|--------|
| Cell   |

---
`}
      />
    );

    expect(container.querySelector('[class*="planResult__h3"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__h4"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__p"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__ul"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__ol"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__li"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__blockquote"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__table"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="planResult__hr"]')).toBeInTheDocument();
  });

  it("should render code block", () => {
    const { container } = render(
      <PlanResult 
        success={true} 
        message="Success" 
        plan={`Some text before

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

Some text after`}
      />
    );

    // Buscar el <pre> que envuelve el code block
    const codeBlock = container.querySelector('pre[class*="planResult__codeBlock"]');
    expect(codeBlock).toBeInTheDocument();
  });
});