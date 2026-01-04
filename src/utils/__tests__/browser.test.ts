import { describe, it, expect, beforeEach, vi } from "vitest";
import { prefersDarkMode, getBrowserLanguage, isClient } from "../browser";

describe("browser utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("prefersDarkMode", () => {
    it("should return false when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulate SSR
      delete global.window;

      const result = prefersDarkMode();

      expect(result).toBe(false);

      global.window = originalWindow;
    });

    it("should return true when user prefers dark mode", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === "(prefers-color-scheme: dark)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const result = prefersDarkMode();

      expect(result).toBe(true);
    });

    it("should return false when user prefers light mode", () => {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const result = prefersDarkMode();

      expect(result).toBe(false);
    });
  });

  describe("getBrowserLanguage", () => {
    it("should return 'en' when window is undefined", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulate SSR
      delete global.window;

      const result = getBrowserLanguage();

      expect(result).toBe("en");

      global.window = originalWindow;
    });

    it("should return language code from navigator.language", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "es-ES",
      });

      const result = getBrowserLanguage();

      expect(result).toBe("es");
    });

    it("should return language code from en-US", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "en-US",
      });

      const result = getBrowserLanguage();

      expect(result).toBe("en");
    });

    it("should return language code from fr-FR", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "fr-FR",
      });

      const result = getBrowserLanguage();

      expect(result).toBe("fr");
    });

    it("should handle simple language codes without region", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "en",
      });

      const result = getBrowserLanguage();

      expect(result).toBe("en");
    });

    it("should handle pt-BR (Portuguese Brazil)", () => {
      Object.defineProperty(window.navigator, "language", {
        writable: true,
        value: "pt-BR",
      });

      const result = getBrowserLanguage();

      expect(result).toBe("pt");
    });
  });

  describe("isClient", () => {
    it("should return true when window is defined", () => {
      const result = isClient();

      expect(result).toBe(true);
    });

    it("should return false when window is undefined (SSR)", () => {
      const originalWindow = global.window;
      // @ts-expect-error - Simulate SSR
      delete global.window;

      const result = isClient();

      expect(result).toBe(false);

      global.window = originalWindow;
    });
  });
});