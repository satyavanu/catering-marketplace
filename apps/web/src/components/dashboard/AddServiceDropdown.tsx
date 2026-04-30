'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ServicesIcon,
  OrdersIcon,
  CalendarIcon,
  ChevronIcon,
} from '@/components/Icons/DashboardIcons';

export type AddServiceType = 'chef' | 'meal_plan' | 'catering';

export type AddServiceOption = {
  label: string;
  description?: string;
  value: AddServiceType;
  icon: React.ReactNode;
  href: string;
};

type AddServiceDropdownProps = {
  label?: string;
  options?: AddServiceOption[];
  onSelect: (option: AddServiceOption) => void;
};

const defaultOptions: AddServiceOption[] = [
  {
    label: 'Add Chef Service',
    description: 'Personal chef or home cooking',
    value: 'chef',
    icon: <ServicesIcon size={16} />,
    href: '/partner/services/chef/new',
  },
  {
    label: 'Create Meal Plan',
    description: 'Weekly or monthly tiffin plans',
    value: 'meal_plan',
    icon: <OrdersIcon size={16} />,
    href: '/partner/services/meal-plans/new',
  },
  {
    label: 'Add Catering Offering',
    description: 'Events, parties and bulk orders',
    value: 'catering',
    icon: <CalendarIcon size={16} />,
    href: '/partner/services/catering/new',
  },
];

export default function AddServiceDropdown({
  label = '+ Add New Service',
  options = defaultOptions,
  onSelect,
}: AddServiceDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={ref} style={styles.wrapper}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={styles.trigger}
      >
        {label}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={styles.menu}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setOpen(false);
                onSelect(option);
              }}
              style={styles.option}
            >
              <span style={styles.icon}>{option.icon}</span>

              <span style={styles.text}>
                <strong>{option.label}</strong>
                {option.description && <small>{option.description}</small>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative',
    display: 'inline-block',
  },

  trigger: {
    height: 40,
    border: 'none',
    borderRadius: 12,
    padding: '0 14px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 10px 22px rgba(124, 58, 237, 0.16)',
  },

  chevron: {
    fontSize: 15,
    lineHeight: 1,
  },

  menu: {
    position: 'absolute',
    top: 48,
    right: 0,
    width: 260,
    padding: 8,
    borderRadius: 16,
    background: '#ffffff',
    border: '1px solid #eee9f7',
    boxShadow: '0 18px 45px rgba(17, 24, 39, 0.12)',
    zIndex: 50,
  },

  option: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    borderRadius: 12,
    padding: 10,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'left',
  },

  icon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    background: '#f3e8ff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    color: '#151126',
    fontSize: 13,
  },
};