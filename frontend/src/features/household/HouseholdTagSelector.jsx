import { Select } from '../../components/ui/Input';
import { HOUSEHOLD_TAGS } from '../../utils/constants';

export default function HouseholdTagSelector({ value = 'Home A', onChange }) {
  return (
    <Select
      label="Household"
      name="home_tag"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={HOUSEHOLD_TAGS}
    />
  );
}