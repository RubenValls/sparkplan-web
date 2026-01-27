import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Loading from "../Loading";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, number>) => {
    if (key === "STEP_OF" && params) {
      return `Step ${params.current} of ${params.total}`;
    }
    return key;
  },
}));

describe("Loading", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render spinner", () => {
      const { container } = render(<Loading />);
      const spinner = container.querySelector("svg");
      expect(spinner).toBeInTheDocument();
    });

    it("should render with small size", () => {
      const { container } = render(<Loading size="small" />);
      const loadingDiv = container.querySelector('[class*="loading"][class*="small"]');
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should render with medium size by default", () => {
      const { container } = render(<Loading />);
      const loadingDiv = container.querySelector('[class*="loading"][class*="medium"]');
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should render with large size", () => {
      const { container } = render(<Loading size="large" />);
      const loadingDiv = container.querySelector('[class*="loading"][class*="large"]');
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should render simple message when provided", () => {
      render(<Loading message="Loading data..." />);
      expect(screen.getByText("Loading data...")).toBeInTheDocument();
    });

    it("should not render content when no steps or message provided", () => {
      const { container } = render(<Loading />);
      const content = container.querySelector('[class*="loading__content"]');
      expect(content).not.toBeInTheDocument();
    });
  });

  describe("Steps functionality", () => {
    const steps = ["Step 1", "Step 2", "Step 3"];

    it("should render first step initially", () => {
      render(<Loading steps={steps} />);
      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.getByText("Step 1 of 3")).toBeInTheDocument();
    });

    it("should render progress bar", () => {
      const { container } = render(<Loading steps={steps} />);
      const progressBar = container.querySelector('[class*="progressBar"]');
      expect(progressBar).toBeInTheDocument();
    });

    it("should show correct initial progress percentage", () => {
      const { container } = render(<Loading steps={steps} />);
      const progressBar = container.querySelector(
        '[class*="progressBar"]'
      ) as HTMLElement;
      expect(progressBar.style.width).toMatch(/^33\.333333/);
    });

    it("should advance to next step after duration", () => {
      const duration = 9000;
      render(<Loading steps={steps} duration={duration} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText("Step 2")).toBeInTheDocument();
      expect(screen.getByText("Step 2 of 3")).toBeInTheDocument();
    });

    it("should advance through all steps", () => {
      const duration = 9000;
      render(<Loading steps={steps} duration={duration} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("Step 2")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("Step 3")).toBeInTheDocument();
    });

    it("should not advance past last step", () => {
      const duration = 9000;
      render(<Loading steps={steps} duration={duration} />);

      act(() => {
        vi.advanceTimersByTime(12000);
      });

      expect(screen.getByText("Step 3")).toBeInTheDocument();
      expect(screen.getByText("Step 3 of 3")).toBeInTheDocument();
    });

    it("should update progress bar as steps advance", () => {
      const duration = 9000;
      const { container } = render(<Loading steps={steps} duration={duration} />);

      const getProgressBar = () =>
        container.querySelector('[class*="progressBar"]') as HTMLElement;

      expect(getProgressBar().style.width).toMatch(/^33\.333333/);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(getProgressBar().style.width).toMatch(/^66\.666666/);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(getProgressBar().style.width).toBe("100%");
    });

    it("should use default duration of 15000ms", () => {
      render(<Loading steps={steps} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByText("Step 2")).toBeInTheDocument();
    });

    it("should clean up interval on unmount", () => {
      const { unmount } = render(<Loading steps={steps} />);

      const clearIntervalSpy = vi.spyOn(global, "clearInterval");

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should not start interval when steps is empty array", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      render(<Loading steps={[]} />);

      expect(setIntervalSpy).not.toHaveBeenCalled();
    });

    it("should not start interval when steps is undefined", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");

      render(<Loading />);

      expect(setIntervalSpy).not.toHaveBeenCalled();
    });
  });

  describe("Priority between steps and message", () => {
    it("should prefer steps over message when both provided", () => {
      const steps = ["Step 1", "Step 2"];
      render(<Loading steps={steps} message="Simple message" />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();
      expect(screen.queryByText("Simple message")).not.toBeInTheDocument();
    });

    it("should show message when no steps provided", () => {
      render(<Loading message="Loading..." />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA structure", () => {
      const { container } = render(<Loading message="Loading data..." />);
      const loadingDiv = container.querySelector('[class*="loading"]');
      expect(loadingDiv).toBeInTheDocument();
    });

    it("should render step counter for screen readers", () => {
      const steps = ["Step 1", "Step 2", "Step 3"];
      render(<Loading steps={steps} />);

      const stepCounter = screen.getByText("Step 1 of 3");
      expect(stepCounter).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle single step", () => {
      render(<Loading steps={["Only step"]} />);

      expect(screen.getByText("Only step")).toBeInTheDocument();
      expect(screen.getByText("Step 1 of 1")).toBeInTheDocument();
    });

    it("should handle very long step text", () => {
      const longText = "A".repeat(200);
      render(<Loading steps={[longText]} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle duration of 0", () => {
      const steps = ["Step 1", "Step 2"];
      render(<Loading steps={steps} duration={0} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();
    });

    it("should handle very short duration", () => {
      const steps = ["Step 1", "Step 2"];
      render(<Loading steps={steps} duration={100} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();
    });

    it("should handle empty message string", () => {
      const { container } = render(<Loading message="" />);
      const content = container.querySelector('[class*="loading__content"]');
      expect(content).not.toBeInTheDocument();
    });

    it("should handle steps with special characters", () => {
      const steps = ["Step <1>", "Step & 2", 'Step "3"'];
      render(<Loading steps={steps} />);

      expect(screen.getByText("Step <1>")).toBeInTheDocument();
    });
  });

  describe("Re-rendering behavior", () => {
    it("should restart from first step when steps prop changes", () => {
      const { rerender, unmount } = render(
        <Loading steps={["Old 1", "Old 2"]} duration={6000} />
      );

      expect(screen.getByText("Old 1")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByText("Old 2")).toBeInTheDocument();

      unmount();
      
      render(<Loading steps={["New 1", "New 2"]} duration={6000} />);

      expect(screen.getByText("New 1")).toBeInTheDocument();
    });

    it("should update when duration changes", () => {
      const steps = ["Step 1", "Step 2"];
      const { rerender } = render(<Loading steps={steps} duration={10000} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();

      rerender(<Loading steps={steps} duration={5000} />);

      expect(screen.getByText("Step 1")).toBeInTheDocument();
    });
  });
});