import { useTranslation } from 'react-i18next';
import { Select } from '../../components/ui/Input';

export default function HouseholdFilterToggle({ value = 'All', onChange }) {
  const { t } = useTranslation();
  return (
    <div className="household-filter">
      <Select
        label={t('household.label')}
        name="household"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={['All', 'Home A', 'Home B', 'Both'].map((h) => ({ value: h, label: t(`domain.household.${h}`) }))}
      />
    </div>
  );
}