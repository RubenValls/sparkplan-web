import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSwitcher from "../LanguageSwitcher";

const mockSetLang = vi.fn();

vi.mock("@/contexts/LanguageContext", () => ({
  useLang: vi.fn(),
}));

// Mock de lucide-react
vi.mock("lucide-react", () => ({
  Globe: () => <div data-testid="globe-icon">Globe</div>,
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with lang 'en' and toggle to 'es'", async () => {
    const { useLang } = await import("@/contexts/LanguageContext");
    vi.mocked(useLang).mockReturnValue({
      lang: "en",
      setLang: mockSetLang,
    });

    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    expect(screen.getByText("ES")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to Spanish")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(mockSetLang).toHaveBeenCalledWith("es");
  });

  it("should render with lang 'es' and toggle to 'en'", async () => {
    const { useLang } = await import("@/contexts/LanguageContext");
    vi.mocked(useLang).mockReturnValue({
      lang: "es",
      setLang: mockSetLang,
    });

    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByLabelText("Switch to English")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(mockSetLang).toHaveBeenCalledWith("en");
  });
});