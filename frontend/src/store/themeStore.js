import { create } from 'zustand';
import { themeService } from '../services/themeService';

export const useThemeStore = create((set, get) => ({
  themes: [],
  loading: false,
  error: null,

  async loadThemes() {
    set({ loading: true, error: null });
    try {
      const themes = await themeService.getThemes();
      set({ themes, loading: false });
      return themes;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  async createTheme(payload) {
    const created = await themeService.createTheme(payload);
    set({ themes: [...get().themes, created] });
    return created;
  },

  async updateTheme(id, payload) {
    const updated = await themeService.updateTheme(id, payload);
    set({ themes: get().themes.map((t) => (t.id === id ? updated : t)) });
    return updated;
  },

  async deleteTheme(id) {
    await themeService.deleteTheme(id);
    set({ themes: get().themes.filter((t) => t.id !== id) });
  },
}));