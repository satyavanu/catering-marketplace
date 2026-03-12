export const storage = {
  setItem: (key: string, value: any) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Failed to set storage item:', e);
      }
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('Failed to get storage item:', e);
        return null;
      }
    }
    return null;
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove storage item:', e);
      }
    }
  },
  clear: () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Failed to clear storage:', e);
      }
    }
  },
};