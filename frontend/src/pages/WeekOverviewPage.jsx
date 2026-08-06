import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWeekStore } from '../store/weekStore';
import { useActivityStore } from '../store/activityStore';
import { useThemeStore } from '../store/themeStore';
import WeekNavigation from '../features/weekplanner/WeekNavigation';
import WeekGrid from '../features/weekplanner/WeekGrid';
import DayColumn from '../features/weekplanner/DayColumn';
import HouseholdFilterToggle from '../features/household/HouseholdFilterToggle';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import ActivityForm from '../features/activities/ActivityForm';
import { startOfWeek, dateOnlyISO } from '../utils/dateHelpers';

export default function WeekOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    currentWeek, instances, loading, error, householdFilter,
    loadWeek, loadWeeks, ensureWeekForDate, goToWeek, addInstance, addAdHocInstance, setHouseholdFilter,
  } = useWeekStore();
  const { templates, loadTemplates } = useActivityStore();
  const { themes, loadThemes } = useThemeStore();

  const [ready, setReady] = useState(false);
  const [addModal, setAddModal] = useState(null);
  const [tab, setTab] = useState(0);
  const [pickedTemplate, setPickedTemplate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const thisWeekIso = dateOnlyISO(startOfWeek(new Date()));
        const [wkThemes, , weeksList] = await Promise.all([loadThemes(), loadTemplates(), loadWeeks()]);
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

  const openInstance = (inst) => navigate(`/activity/${inst.id}`);
  const openAdd = (blockType, day = 0) => { setPickedTemplate(''); setAddModal({ dayOfWeek: day, blockType }); };

  const addFromTemplate = async () => {
    if (!pickedTemplate) return;
    await addInstance({
      day_of_week: addModal.dayOfWeek,
      block_type: addModal.blockType,
      activity_id: Number(pickedTemplate),
      home_tag: 'Home A',
    });
    setAddModal(null);
  };

  const createAdHoc = async (payload) => {
    await addAdHocInstance({
      day_of_week: addModal.dayOfWeek,
      block_type: addModal.blockType,
      home_tag: payload.home_tag || 'Home A',
      title: payload.title,
      category: payload.category,
      description: payload.description,
      estimated_duration: payload.estimated_duration,
      links: payload.links,
    });
    setAddModal(null);
  };

  return (
    <div className="page week-page">
      <WeekNavigation
        startDate={startDate}
        onPrev={() => goToWeek(-1)}
        onNext={() => goToWeek(1)}
        onToday={() => ensureWeekForDate(new Date())}
        today={startDate === dateOnlyISO(startOfWeek(new Date()))}
      />

      <div className="week-toolbar">
        <HouseholdFilterToggle value={householdFilter} onChange={setHouseholdFilter} />
        <span className="instances-count">{t('week.scheduled', { count: instances.length })}</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="week-grid-view">
        <WeekGrid startDate={startDate} instances={instances} onOpenInstance={openInstance} onAdd={openAdd} />
      </div>

      <div className="mobile-day-scroller">
        {Array.from({ length: 7 }).map((_, i) => (
          <DayColumn key={i} startDate={startDate} dayIndex={i} instances={instances} onOpenInstance={openInstance} onAdd={openAdd} />
        ))}
      </div>

      <Modal open={!!addModal} title={addModal ? t('week.addActivityTitle', { block: t(`domain.block.${addModal.blockType}`) }) : ''} onClose={() => setAddModal(null)} size="md">
        <Tabs tabs={[{ label: t('week.fromTemplate') }, { label: t('week.newActivity') }]} active={tab} onChange={setTab} />
        {tab === 0 ? (
          <div className="form-stack">
            <Select
              label={t('week.template')}
              name="template"
              value={pickedTemplate}
              onChange={(e) => setPickedTemplate(e.target.value)}
              options={templates.map((tpl) => ({ value: tpl.id, label: `${tpl.title} · ${tpl.category}` }))}
              placeholder={t('week.chooseTemplate')}
            />
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => setAddModal(null)}>{t('week.cancel')}</Button>
              <Button disabled={!pickedTemplate} onClick={addFromTemplate}>{t('week.add')}</Button>
            </div>
          </div>
        ) : (
          <ActivityForm themes={themes} submitLabel={t('week.addActivity')} onSubmit={createAdHoc} onCancel={() => setAddModal(null)} />
        )}
      </Modal>
    </div>
  );
}