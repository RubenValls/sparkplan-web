import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDateISO, formatDateLocale, getFileTimestamp } from "../date";

describe("date utils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatDateISO", () => {
    it("should format current date as ISO string (YYYY-MM-DD)", () => {
      const mockDate = new Date("2024-01-15T10:30:00Z");
      vi.setSystemTime(mockDate);

      const result = formatDateISO();

      expect(result).toBe("2024-01-15");
    });

    it("should format provided date as ISO string", () => {
      const customDate = new Date("2023-12-25T15:45:00Z");

      const result = formatDateISO(customDate);

      expect(result).toBe("2023-12-25");
    });

    it("should handle leap year dates", () => {
      const leapDate = new Date("2024-02-29T12:00:00Z");

      const result = formatDateISO(leapDate);

      expect(result).toBe("2024-02-29");
    });

    it("should handle start of year", () => {
      const newYear = new Date("2024-01-01T00:00:00Z");

      const result = formatDateISO(newYear);

      expect(result).toBe("2024-01-01");
    });

    it("should handle end of year", () => {
      const endYear = new Date("2024-12-31T23:59:59Z");

      const result = formatDateISO(endYear);

      expect(result).toBe("2024-12-31");
    });
  });

  describe("formatDateLocale", () => {
    it("should format date with default locale (en-US)", () => {
      const date = new Date("2024-01-15T10:30:00Z");

      const result = formatDateLocale(date);

      expect(result).toMatch(/1\/15\/2024|15\/1\/2024/);
    });

    it("should format date with Spanish locale", () => {
      const date = new Date("2024-01-15T10:30:00Z");

      const result = formatDateLocale(date, "es-ES");

      expect(result).toMatch(/15\/1\/2024/);
    });

    it("should format current date when no date provided", () => {
      const mockDate = new Date("2024-03-20T10:30:00Z");
      vi.setSystemTime(mockDate);

      const result = formatDateLocale();

      expect(result).toMatch(/3\/20\/2024|20\/3\/2024/);
    });

    it("should handle different locales", () => {
      const date = new Date("2024-06-10T10:30:00Z");

      const resultUS = formatDateLocale(date, "en-US");
      const resultES = formatDateLocale(date, "es-ES");
      const resultGB = formatDateLocale(date, "en-GB");

      expect(resultUS).toBeTruthy();
      expect(resultES).toBeTruthy();
      expect(resultGB).toBeTruthy();
      
      expect(resultUS).not.toBe(resultES);
    });
  });

  describe("getFileTimestamp", () => {
    it("should return current timestamp as string", () => {
      const mockTime = new Date("2024-01-15T10:30:00Z").getTime();
      vi.setSystemTime(mockTime);

      const result = getFileTimestamp();

      expect(result).toBe(mockTime.toString());
    });

    it("should return different values when called at different times", () => {
      vi.setSystemTime(new Date("2024-01-15T10:30:00Z"));
      const timestamp1 = getFileTimestamp();

      vi.setSystemTime(new Date("2024-01-15T10:30:01Z"));
      const timestamp2 = getFileTimestamp();

      expect(timestamp1).not.toBe(timestamp2);
      expect(Number(timestamp2)).toBeGreaterThan(Number(timestamp1));
    });

    it("should return a numeric string", () => {
      const result = getFileTimestamp();

      expect(result).toMatch(/^\d+$/);
      expect(Number(result)).not.toBeNaN();
    });

    it("should return timestamp with appropriate length", () => {
      const result = getFileTimestamp();

      expect(result.length).toBe(13);
    });
  });
});