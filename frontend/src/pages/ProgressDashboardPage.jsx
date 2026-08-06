import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '../components/ui/Input';
import WeeklyStats from '../features/progress/WeeklyStats';
import CategoryBreakdownChart from '../features/progress/CategoryBreakdownChart';
import ReflectionList from '../features/progress/ReflectionList';
import Tabs from '../components/ui/Tabs';
import { useProgressStore } from '../store/progressStore';
import { useWeekStore } from '../store/weekStore';
import { formatWeekLabel } from '../utils/dateHelpers';

export default function ProgressDashboardPage() {
  const { t } = useTranslation();
  const { stats, history, reflections, loading, error, loadAll } = useProgressStore();
  const { weeks, loadWeeks, currentWeek } = useWeekStore();
  const [weekId, setWeekId] = useState('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    (async () => {
      const wlist = await loadWeeks().catch(() => null);
      const target = weekId || (currentWeek ? currentWeek.id : (wlist && wlist[0] ? wlist[0].id : ''));
      if (target) {
        setWeekId(target);
        await loadAll(target).catch(() => {});
      }
    })();
  }, []);

  const changeWeek = async (id) => {
    setWeekId(id);
    await loadAll(id).catch(() => {});
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('progressPage.title')}</h1>
          <p className="page-sub">{t('progressPage.subtitle')}</p>
        </div>
      </div>

      <div className="progress-toolbar">
        <Select
          label={t('progressPage.week')}
          name="week"
          value={weekId}
          onChange={(e) => changeWeek(e.target.value)}
          options={weeks.map((w) => ({ value: w.id, label: formatWeekLabel(w.start_date) }))}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="page-loading">{t('progressPage.loading')}</div>
      ) : (
        <>
          <WeeklyStats stats={stats} />

          <Tabs tabs={[{ label: t('progressPage.last4Weeks') }, { label: t('progressPage.reflections') }]} active={tab} onChange={setTab} />
          {tab === 0 ? <CategoryBreakdownChart history={history} /> : <ReflectionList reflections={reflections} />}
        </>
      )}
    </div>
  );
}