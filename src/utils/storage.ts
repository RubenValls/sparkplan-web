export function getStorageItem<T = string>(key: string): T | null {
  if (typeof window === "undefined") return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return null;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const stringValue = typeof value === "string" 
      ? value 
      : JSON.stringify(value);
    
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
    return false;
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage:`, error);
  }
}