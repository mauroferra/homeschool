import { create } from 'zustand';
import { externalTypeService } from '../services/externalTypeService';

export const useExternalTypeStore = create((set, get) => ({
  types: [],
  loading: false,
  error: null,

  async loadTypes() {
    set({ loading: true, error: null });
    try {
      const types = await externalTypeService.getTypes();
      set({ types, loading: false });
      return types;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  async createType(name) {
    const created = await externalTypeService.createType(name);
    set({ types: [...get().types, created].sort((a, b) => a.name.localeCompare(b.name)) });
    return created;
  },

  async updateType(id, name) {
    const updated = await externalTypeService.updateType(id, name);
    set({ types: get().types.map((t) => (t.id === id ? updated : t)) });
    return updated;
  },

  async deleteType(id) {
    await externalTypeService.deleteType(id);
    set({ types: get().types.filter((t) => t.id !== id) });
  },
}));