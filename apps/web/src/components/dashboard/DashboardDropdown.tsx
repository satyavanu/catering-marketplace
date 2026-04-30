'use client';

import React from 'react';

export type DashboardDropdownOption = {
  label: string;
  value: string;
};

type Props = {
  value: string;
  options: DashboardDropdownOption[];
  onChange: (value: string) => void;
};

export default function DashboardDropdown({ value, options, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        height: 38,
        minWidth: 140,
        borderRadius: 12,
        border: '1px solid #eee9f7',
        background: '#ffffff',
        color: '#334155',
        padding: '0 12px',
        fontSize: 13,
        fontWeight: 600,
        outline: 'none',
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}