import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { weekService } from '../../services/weekService';
import { useWeekStore } from '../../store/weekStore';

export function useActivityDetail(instanceId, { onChanged, onRemoved } = {}) {
  const { t } = useTranslation();
  const refreshWeek = useWeekStore((s) => s.loadWeek);
  const currentWeek = useWeekStore((s) => s.currentWeek);

  const [instance, setInstance] = useState(null);
  const [status, setStatus] = useState('');
  const [reflection, setReflection] = useState('');
  const [homeTag, setHomeTag] = useState('Home A');
  const [blockType, setBlockType] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setInstance(null);
    setError('');
    setSaved(false);
    (async () => {
      try {
        const found = await weekService.getInstance(instanceId);
        if (cancelled) return;
        setInstance(found);
        setStatus(found.status || '');
        setReflection(found.reflection_text || '');
        setHomeTag(found.home_tag || 'Home A');
        setBlockType(found.block_type || '');
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => { cancelled = true; };
  }, [instanceId]);

  const refreshAfterChange = async () => {
    if (currentWeek) await refreshWeek(currentWeek.id);
    onChanged?.();
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await weekService.updateInstance(instance.id, { status, reflection_text: reflection, home_tag: homeTag, block_type: blockType });
      setInstance({ ...instance, status, reflection_text: reflection, home_tag: homeTag, block_type: blockType });
      await refreshAfterChange();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t('activity.removeConfirm'))) return;
    await weekService.deleteInstance(instance.id);
    await refreshAfterChange();
    onRemoved?.();
  };

  return {
    instance, status, reflection, homeTag, blockType, saving, saved, error,
    setStatus, setReflection, setHomeTag, setBlockType, save, remove,
  };
}
