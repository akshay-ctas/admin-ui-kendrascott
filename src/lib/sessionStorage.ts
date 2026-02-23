class SessionStorageService {
  set(key: string, value: unknown): boolean {
    if (value === undefined) {
      console.warn(
        `SessionStorage: skipping set for key "${key}" — value is undefined`,
      );
      return false;
    }

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`SessionStorage set error for key "${key}":`, error);
      return false;
    }
  }

  get<T = unknown>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(key);

      if (!data || data === "undefined" || data === "null") return null;

      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`SessionStorage get error for key "${key}":`, error);
      sessionStorage.removeItem(key);
      return null;
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  clear(): void {
    sessionStorage.clear();
  }
}

export const sessionStore = new SessionStorageService();
