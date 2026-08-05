import { create } from 'zustand';
import { progressService } from '../services/progressService';

export const useProgressStore = create((set, get) => ({
  stats: null,
  history: [],
  reflections: [],
  loading: false,
  error: null,

  async loadAll(weekId) {
    set({ loading: true, error: null });
    try {
      const [stats, history, reflections] = await Promise.all([
        progressService.getWeeklyStats(weekId),
        progressService.getLastFourWeeks(),
        progressService.getReflections(weekId),
      ]);
      set({ stats, history, reflections: reflections.reflections || [], loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  async loadStats(weekId) {
    const stats = await progressService.getWeeklyStats(weekId);
    set({ stats });
    return stats;
  },
}));