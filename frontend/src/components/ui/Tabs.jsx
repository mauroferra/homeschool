import { useState } from 'react';

export default function Tabs({ tabs = [], active, onChange }) {
  const [internal, setInternal] = useState(0);
  const current = active ?? internal;
  const setActive = (i) => {
    if (onChange) onChange(i);
    else setInternal(i);
  };
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab, i) => (
        <button
          key={tab.key ?? i}
          type="button"
          role="tab"
          aria-selected={current === i}
          className={`tab ${current === i ? 'tab-active' : ''}`}
          onClick={() => setActive(i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}