import { useTranslation } from 'react-i18next';
import { Select } from '../../components/ui/Input';
import { HOUSEHOLD_TAGS } from '../../utils/constants';

export default function HouseholdTagSelector({ value = 'Home A', onChange }) {
  const { t } = useTranslation();
  return (
    <Select
      label={t('household.label')}
      name="home_tag"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={HOUSEHOLD_TAGS.map((h) => ({ value: h, label: t(`domain.household.${h}`) }))}
    />
  );
}