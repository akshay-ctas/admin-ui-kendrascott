class SessionStorageService {
  set(key: string, value: unknown): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  get<T = unknown>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(key);
      const result = data ? JSON.parse(data) : null;

      return result;
    } catch (error) {
      console.error(error);
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
