import {describe, it, expect, vi, beforeEach} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import {useLang, LanguageProvider} from "../LanguageContext";
import {ReactNode} from "react";
import userEvent from "@testing-library/user-event";

// Mock next-intl
vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({children, locale}: {children: ReactNode; locale?: string}) => (
    <div data-testid="next-intl-provider" data-locale={locale}>
      {children}
    </div>
  )
}));

// Helper Component
function TestComponent() {
  const {lang, setLang} = useLang();

  return (
    <div>
      <p data-testid="lang">{lang}</p>
      <button onClick={() => setLang("es")}>change</button>
    </div>
  );
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("uses English as default language", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId("lang").textContent).toBe("en");
  });

  it("updates language and saves it to localStorage", async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    await userEvent.click(screen.getByText("change"));

    await waitFor(() => {
      expect(screen.getByTestId("lang").textContent).toBe("es");
    });

    expect(localStorage.getItem("lang")).toBe("es");
  });

  it("renders NextIntlClientProvider", () => {
    render(
      <LanguageProvider>
        <div>child</div>
      </LanguageProvider>
    );

    expect(screen.getByTestId("next-intl-provider")).toBeTruthy();
  });

  it("throws error when useLang is used outside LanguageProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useLang must be used inside LanguageProvider");

    consoleError.mockRestore();
  });
});