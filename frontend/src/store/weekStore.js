import { create } from 'zustand';
import { weekService } from '../services/weekService';
import { startOfWeek, dateOnlyISO, addWeek, addMonths, addDays, parseISO, getMonthGrid } from '../utils/dateHelpers';

export const EXTERNAL_BLOCK = 'External Activity';

export const useWeekStore = create((set, get) => ({
  weeks: [],
  currentWeek: null,
  instances: [],
  loading: false,
  error: null,
  viewDate: null,
  monthInstances: [],

  async loadWeeks() {
    const weeks = await weekService.getWeeks();
    set({ weeks });
    if (!get().currentWeek && weeks.length) {
      await get().loadWeek(weeks[0].id);
    }
    return weeks;
  },

  async loadWeek(id) {
    set({ loading: true, error: null });
    try {
      const [week, instances] = await Promise.all([
        weekService.getWeek(id),
        weekService.getInstances(id),
      ]);
      set({ currentWeek: week, instances, loading: false });
      return week;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  async ensureWeekForDate(date) {
    const start = dateOnlyISO(startOfWeek(date));
    let week = get().weeks.find((w) => w.start_date === start);
    if (!week) {
      const created = await weekService.createWeek(start);
      const weeks = [created, ...get().weeks];
      week = created;
      set({ weeks });
    }
    await get().loadWeek(week.id);
    return week;
  },

  async goToWeek(delta) {
    if (!get().currentWeek) return;
    const target = addWeek(get().currentWeek.start_date, delta);
    await get().ensureWeekForDate(target);
  },

  async setViewDate(date) {
    await get().ensureWeekForDate(date);
    set({ viewDate: dateOnlyISO(date) });
    return get().viewDate;
  },

  async goToDay(date, delta) {
    const anchor = date ? parseISO(date) : new Date();
    return get().setViewDate(addDays(anchor, delta));
  },

  async loadMonth(date) {
    const grid = getMonthGrid(date);
    const first = dateOnlyISO(grid[0][0]);
    const last = dateOnlyISO(grid[grid.length - 1][6]);
    const inRange = get().weeks.filter((w) => w.start_date >= first && w.start_date <= last);
    const results = await Promise.all(
      inRange.map((w) => weekService.getInstances(w.id))
    );
    set({ monthInstances: results.flat(), viewDate: dateOnlyISO(date) });
    return grid;
  },

  async goToMonth(date, delta) {
    const anchor = date ? parseISO(date) : new Date();
    return get().loadMonth(addMonths(anchor, delta));
  },

  async addInstance(payload) {
    const week = get().currentWeek;
    await weekService.createInstance(week.id, payload);
    await get().loadWeek(week.id);
  },

  async addAdHocInstance(payload) {
    const week = get().currentWeek;
    const created = await weekService.createAdHocInstance(week.id, payload);
    await get().loadWeek(week.id);
    return created;
  },

  async addExternalInstance(payload) {
    const week = get().currentWeek;
    const created = await weekService.createExternalInstance(week.id, {
      day_of_week: payload.day_of_week,
      home_tag: payload.home_tag || 'Home A',
      external_type_id: payload.external_type_id || null,
      title: payload.title || null,
    });
    await get().loadWeek(week.id);
    return created;
  },

  async updateInstance(id, payload) {
    await weekService.updateInstance(id, payload);
    await get().loadWeek(get().currentWeek.id);
  },

  async deleteInstance(id) {
    await weekService.deleteInstance(id);
    await get().loadWeek(get().currentWeek.id);
  },

  async updateReflection(text) {
    const week = get().currentWeek;
    const updated = await weekService.updateWeekReflection(week.id, text);
    set({ currentWeek: updated });
  },
}));