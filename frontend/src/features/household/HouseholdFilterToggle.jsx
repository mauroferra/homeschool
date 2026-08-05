import { Select } from '../../components/ui/Input';

export default function HouseholdFilterToggle({ value = 'All', onChange }) {
  return (
    <div className="household-filter">
      <Select
        label="Household"
        name="household"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={['All', 'Home A', 'Home B', 'Both']}
      />
    </div>
  );
}