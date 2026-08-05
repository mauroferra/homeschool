import { create } from 'zustand';
import { activityService } from '../services/activityService';

export const useActivityStore = create((set, get) => ({
  templates: [],
  loading: false,
  error: null,

  async loadTemplates(themeId) {
    set({ loading: true, error: null });
    try {
      const templates = await activityService.getTemplates(themeId);
      set({ templates, loading: false });
      return templates;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  async createTemplate(payload) {
    const created = await activityService.createTemplate(payload);
    set({ templates: [...get().templates, created] });
    return created;
  },

  async updateTemplate(id, payload) {
    const updated = await activityService.updateTemplate(id, payload);
    set({ templates: get().templates.map((t) => (t.id === id ? updated : t)) });
    return updated;
  },

  async deleteTemplate(id) {
    await activityService.deleteTemplate(id);
    set({ templates: get().templates.filter((t) => t.id !== id) });
  },
}));