import { useEffect, useState } from 'react';
import { Select } from '../components/ui/Input';
import WeeklyStats from '../features/progress/WeeklyStats';
import CategoryBreakdownChart from '../features/progress/CategoryBreakdownChart';
import ReflectionList from '../features/progress/ReflectionList';
import Tabs from '../components/ui/Tabs';
import { useProgressStore } from '../store/progressStore';
import { useWeekStore } from '../store/weekStore';
import { formatWeekLabel } from '../utils/dateHelpers';

export default function ProgressDashboardPage() {
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
          <h1 className="page-title">Progress</h1>
          <p className="page-sub">Completed activities, category coverage and notes.</p>
        </div>
      </div>

      <div className="progress-toolbar">
        <Select
          label="Week"
          name="week"
          value={weekId}
          onChange={(e) => changeWeek(e.target.value)}
          options={weeks.map((w) => ({ value: w.id, label: formatWeekLabel(w.start_date) }))}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="page-loading">Loading progress…</div>
      ) : (
        <>
          <WeeklyStats stats={stats} />

          <Tabs tabs={[{ label: 'Last 4 weeks' }, { label: 'Reflections' }]} active={tab} onChange={setTab} />
          {tab === 0 ? <CategoryBreakdownChart history={history} /> : <ReflectionList reflections={reflections} />}
        </>
      )}
    </div>
  );
}