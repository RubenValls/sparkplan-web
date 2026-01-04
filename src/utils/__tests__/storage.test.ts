import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getStorageItem, setStorageItem, removeStorageItem } from "../storage";

describe("storage utils", () => {
  let localStorageMock: { [key: string]: string };
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorageMock = {};
    
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      length: 0,
      key: vi.fn(),
    } as Storage;

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("getStorageItem", () => {
    it("should return null when key does not exist", () => {
      const result = getStorageItem("nonexistent");

      expect(result).toBeNull();
    });

    it("should return string value", () => {
      localStorageMock["theme"] = "dark";

      const result = getStorageItem("theme");

      expect(result).toBe("dark");
    });

    it("should parse JSON value", () => {
      const user = { name: "John", age: 30 };
      localStorageMock["user"] = JSON.stringify(user);

      const result = getStorageItem<{ name: string; age: number }>("user");

      expect(result).toEqual(user);
    });

    it("should return string if JSON parse fails", () => {
      localStorageMock["text"] = "not a json";

      const result = getStorageItem("text");

      expect(result).toBe("not a json");
    });

    it("should handle nested JSON objects", () => {
      const config = {
        theme: "dark",
        settings: {
          notifications: true,
          language: "es",
        },
      };
      localStorageMock["config"] = JSON.stringify(config);

      const result = getStorageItem<typeof config>("config");

      expect(result).toEqual(config);
    });

    it("should return null and log error if localStorage.getItem throws", () => {
      global.localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage access denied");
      });

      const result = getStorageItem("key");

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading from localStorage:",
        expect.any(Error)
      );
    });
  });

  describe("setStorageItem", () => {
    it("should store string value", () => {
      const result = setStorageItem("theme", "dark");

      expect(result).toBe(true);
      expect(localStorageMock["theme"]).toBe("dark");
    });

    it("should store number value as JSON", () => {
      const result = setStorageItem("count", 42);

      expect(result).toBe(true);
      expect(localStorageMock["count"]).toBe("42");
    });

    it("should stringify object value", () => {
      const user = { name: "John", age: 30 };

      const result = setStorageItem("user", user);

      expect(result).toBe(true);
      expect(localStorageMock["user"]).toBe(JSON.stringify(user));
    });

    it("should stringify array value", () => {
      const items = ["apple", "banana", "cherry"];

      const result = setStorageItem("fruits", items);

      expect(result).toBe(true);
      expect(localStorageMock["fruits"]).toBe(JSON.stringify(items));
    });

    it("should handle boolean values", () => {
      const result = setStorageItem("isActive", true);

      expect(result).toBe(true);
      expect(localStorageMock["isActive"]).toBe("true");
    });

    it("should return false and log error if localStorage.setItem throws", () => {
      global.localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      const result = setStorageItem("key", "value");

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error writing to localStorage:",
        expect.any(Error)
      );
    });

    it("should overwrite existing value", () => {
      localStorageMock["theme"] = "light";

      setStorageItem("theme", "dark");

      expect(localStorageMock["theme"]).toBe("dark");
    });
  });

  describe("removeStorageItem", () => {
    it("should remove existing item", () => {
      localStorageMock["theme"] = "dark";

      removeStorageItem("theme");

      expect(localStorageMock["theme"]).toBeUndefined();
    });

    it("should not throw error when removing non-existent item", () => {
      expect(() => removeStorageItem("nonexistent")).not.toThrow();
    });

    it("should log error if localStorage.removeItem throws", () => {
      global.localStorage.removeItem = vi.fn().mockImplementation(() => {
        throw new Error("Storage access denied");
      });

      removeStorageItem("key");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error removing from localStorage:",
        expect.any(Error)
      );
    });

    it("should remove multiple items independently", () => {
      localStorageMock["theme"] = "dark";
      localStorageMock["lang"] = "es";

      removeStorageItem("theme");

      expect(localStorageMock["theme"]).toBeUndefined();
      expect(localStorageMock["lang"]).toBe("es");
    });
  });
});