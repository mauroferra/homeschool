import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWeekStore } from '../store/weekStore';
import { useActivityStore } from '../store/activityStore';
import { useThemeStore } from '../store/themeStore';
import { useExternalTypeStore } from '../store/externalTypeStore';
import { CURRICULUM_BLOCK_TYPES } from '../utils/constants';
import WeekNavigation from '../features/weekplanner/WeekNavigation';
import WeekGrid from '../features/weekplanner/WeekGrid';
import DayColumn from '../features/weekplanner/DayColumn';
import MonthGrid from '../features/weekplanner/MonthGrid';
import ViewToggle from '../features/weekplanner/ViewToggle';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import ActivityForm from '../features/activities/ActivityForm';
import ActivityDetailModal from '../features/activities/ActivityDetailModal';
import ExternalActivityForm from '../features/weekplanner/ExternalActivityForm';
import {
  startOfWeek, dateOnlyISO, parseISO, addDays, weekdayIndex, isSameDay, isSameMonth,
  formatWeekLabel, formatDayLabel, formatMonthLabel,
} from '../utils/dateHelpers';
import { useLocalized } from '../utils/localize';

export default function WeekOverviewPage() {
  const { t } = useTranslation();
  const L = useLocalized();
  const {
    weeks, currentWeek, instances, loading, error,
    viewDate, monthInstances,
    loadWeek, loadWeeks, ensureWeekForDate, goToWeek, setViewDate, loadMonth, goToDay, goToMonth,
    addInstance, addAdHocInstance, addExternalInstance,
  } = useWeekStore();
  const { templates, loadTemplates } = useActivityStore();
  const { themes, loadThemes } = useThemeStore();
  const { loadTypes } = useExternalTypeStore();

  const [ready, setReady] = useState(false);
  const [view, setView] = useState('week');
  const [addModal, setAddModal] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [tab, setTab] = useState(0);
  const [pickedTemplate, setPickedTemplate] = useState('');
  const [pickedType, setPickedType] = useState(CURRICULUM_BLOCK_TYPES[0]);

  useEffect(() => {
    (async () => {
      try {
        const thisWeekIso = dateOnlyISO(startOfWeek(new Date()));
        const [, , , weeksList] = await Promise.all([loadThemes(), loadTemplates(), loadTypes(), loadWeeks()]);
        const thisWeek = weeksList.find((w) => w.start_date === thisWeekIso);
        if (thisWeek) await loadWeek(thisWeek.id);
        else await ensureWeekForDate(new Date());
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) return <div className="page-loading">{t('week.loading')}</div>;
  if (!currentWeek) return <div className="page-loading">{t('week.setup')}</div>;

  const startDate = currentWeek.start_date;
  const anchorDate = viewDate ? parseISO(viewDate) : new Date();
  const startIso = dateOnlyISO(startOfWeek(new Date()));

  const changeView = (next) => {
    setView(next);
    if (next === 'week') {
      if (viewDate) ensureWeekForDate(parseISO(viewDate));
    } else if (next === 'day') {
      setViewDate(parseISO(startDate));
    } else if (next === 'month') {
      loadMonth(parseISO(startDate));
    }
  };

  const onPrev = () => {
    if (view === 'day') goToDay(viewDate, -1);
    else if (view === 'month') goToMonth(viewDate, -1);
    else goToWeek(-1);
  };
  const onNext = () => {
    if (view === 'day') goToDay(viewDate, 1);
    else if (view === 'month') goToMonth(viewDate, 1);
    else goToWeek(1);
  };
  const onToday = () => {
    if (view === 'day') setViewDate(new Date());
    else if (view === 'month') loadMonth(new Date());
    else ensureWeekForDate(new Date());
  };

  const navLabel = view === 'day' ? formatDayLabel(anchorDate)
    : view === 'month' ? formatMonthLabel(anchorDate)
      : formatWeekLabel(startDate);
  const todayLabel = view === 'day' ? t('week.today') : view === 'month' ? t('week.thisMonth') : t('week.thisWeek');
  const isToday = view === 'day' ? isSameDay(anchorDate, new Date())
    : view === 'month' ? isSameMonth(anchorDate, new Date())
      : startDate === startIso;

  const visibleCount = view === 'month' ? monthInstances.length
    : view === 'day' ? instances.filter((i) => i.day_of_week === weekdayIndex(anchorDate)).length
      : instances.length;

const openInstance = (inst) => setDetailId(inst.id);
  const openDay = async (date) => {
    await setViewDate(date);
    setView('day');
  };
  const openAdd = (date) => {
    setPickedTemplate('');
    setPickedType(CURRICULUM_BLOCK_TYPES[0]);
    setAddModal({ date, dayOfWeek: weekdayIndex(date) });
  };

  const refreshMonth = async () => {
    if (viewDate) await loadMonth(parseISO(viewDate));
  };

  const onDetailChanged = async () => {
    if (view === 'month' && viewDate) await loadMonth(parseISO(viewDate));
  };

  const addFromTemplate = async () => {
    if (!pickedTemplate) return;
    await ensureWeekForDate(addModal.date);
    await addInstance({
      day_of_week: addModal.dayOfWeek,
      block_type: pickedType,
      activity_id: Number(pickedTemplate),
      home_tag: 'Home A',
    });
    setAddModal(null);
    if (view === 'month') refreshMonth();
  };

  const createAdHoc = async (payload) => {
    await ensureWeekForDate(addModal.date);
    await addAdHocInstance({
      day_of_week: addModal.dayOfWeek,
      block_type: pickedType,
      home_tag: payload.home_tag || 'Home A',
      title: payload.title,
      category: payload.category,
      description: payload.description,
      estimated_duration: payload.estimated_duration,
      links: payload.links,
    });
    setAddModal(null);
    if (view === 'month') refreshMonth();
  };

  const createExternal = async ({ external_type_id, title }) => {
    await ensureWeekForDate(addModal.date);
    await addExternalInstance({
      day_of_week: addModal.dayOfWeek,
      home_tag: 'Home A',
      external_type_id,
      title,
    });
    setAddModal(null);
    if (view === 'month') refreshMonth();
  };

  return (
    <div className="page week-page">
      <WeekNavigation
        label={navLabel}
        todayLabel={todayLabel}
        active={isToday}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
      />

      <div className="week-toolbar">
        <ViewToggle value={view} onChange={changeView} />
        <span className="instances-count">{t('week.scheduled', { count: visibleCount })}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {view === 'week' && (
        <>
          <div className="week-grid-view">
            <WeekGrid startDate={startDate} instances={instances} onOpenInstance={openInstance} onAdd={openAdd} onOpenDay={openDay} />
          </div>

          <div className="mobile-day-scroller">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = addDays(parseISO(startDate), i);
              return (
                <DayColumn key={i} date={date} dayIndex={i} instances={instances} onOpenInstance={openInstance} onAdd={openAdd} onOpenDay={openDay} />
              );
            })}
          </div>
        </>
      )}

      {view === 'day' && (
        <div className="day-view">
          <DayColumn
            date={anchorDate}
            dayIndex={weekdayIndex(anchorDate)}
            instances={instances}
            onOpenInstance={openInstance}
            onAdd={openAdd}
          />
        </div>
      )}

      {view === 'month' && (
        <MonthGrid
          anchorDate={anchorDate}
          instances={monthInstances}
          weeks={weeks}
          onOpenInstance={openInstance}
          onAdd={openAdd}
          onOpenDay={openDay}
        />
      )}

      <Modal open={!!addModal} title={t('week.addActivity')} onClose={() => setAddModal(null)} size="md">
        <Tabs tabs={[{ label: t('week.fromTemplate') }, { label: t('week.newActivity') }, { label: t('week.external') }]} active={tab} onChange={setTab} />
        {tab === 0 ? (
          <div className="form-stack">
            <Select
              label={t('week.type')}
              name="block_type"
              value={pickedType}
              onChange={(e) => setPickedType(e.target.value)}
              options={CURRICULUM_BLOCK_TYPES.map((bt) => ({ value: bt, label: t(`domain.block.${bt}`) }))}
            />
            <Select
              label={t('week.template')}
              name="template"
              value={pickedTemplate}
              onChange={(e) => setPickedTemplate(e.target.value)}
              options={templates.map((tpl) => ({ value: tpl.id, label: `${L(tpl, 'title')} · ${t(`domain.category.${tpl.category}`)}` }))}
              placeholder={t('week.chooseTemplate')}
            />
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => setAddModal(null)}>{t('week.cancel')}</Button>
              <Button disabled={!pickedTemplate} onClick={addFromTemplate}>{t('week.add')}</Button>
            </div>
          </div>
        ) : tab === 2 ? (
          <ExternalActivityForm onSubmit={createExternal} onCancel={() => setAddModal(null)} />
        ) : (
          <ActivityForm
            themes={themes}
            submitLabel={t('week.addActivity')}
            onSubmit={createAdHoc}
            onCancel={() => setAddModal(null)}
            extraFields={
              <Select
                label={t('week.type')}
                name="block_type"
                value={pickedType}
                onChange={(e) => setPickedType(e.target.value)}
                options={CURRICULUM_BLOCK_TYPES.map((bt) => ({ value: bt, label: t(`domain.block.${bt}`) }))}
              />
            }
          />
        )}
      </Modal>
      {detailId && <ActivityDetailModal instanceId={detailId} onClose={() => setDetailId(null)} onChanged={onDetailChanged} />}
    </div>
  );
}
