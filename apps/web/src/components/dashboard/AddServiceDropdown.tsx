'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ServicesIcon,
  OrdersIcon,
  CalendarIcon,
  EarningsIcon,
  ChevronIcon,
} from '@/components/Icons/DashboardIcons';
import {
  useServiceTypes,
  type ServiceType as CatalogServiceType,
} from '@catering-marketplace/query-client';

export enum ServiceTypeKey {
  Chef = 'chef',
  MealPlan = 'meal_plan',
  Catering = 'catering',
  RestaurantPrivateEvent = 'restaurant_private_event',
}

export type AddServiceType = ServiceTypeKey | string;

export type AddServiceOption = {
  label: string;
  description?: string;
  value: AddServiceType;
  icon: React.ReactNode;
  href?: string;
  isActive?: boolean;
  sortOrder?: number;
};

type AddServiceDropdownProps = {
  label?: string;
  options?: AddServiceOption[];
  onSelect: (option: AddServiceOption) => void;
};

const serviceTypeIconMap: Record<ServiceTypeKey, React.ReactNode> = {
  [ServiceTypeKey.Chef]: <ServicesIcon size={16} />,
  [ServiceTypeKey.MealPlan]: <OrdersIcon size={16} />,
  [ServiceTypeKey.Catering]: <CalendarIcon size={16} />,
  [ServiceTypeKey.RestaurantPrivateEvent]: <EarningsIcon size={16} />,
};

const serviceTypeHrefMap: Partial<Record<ServiceTypeKey, string>> = {
  [ServiceTypeKey.Chef]: '/partner/services/chef/new',
  [ServiceTypeKey.MealPlan]: '/partner/services/meal-plans/new',
  [ServiceTypeKey.Catering]: '/partner/services/catering/new',
  [ServiceTypeKey.RestaurantPrivateEvent]:
    '/partner/services/restaurant-events/new',
};

const fallbackOptions: AddServiceOption[] = [
  {
    label: 'Private Chef',
    description: 'Personal chef or home cooking',
    value: ServiceTypeKey.Chef,
    icon: serviceTypeIconMap[ServiceTypeKey.Chef],
    href: serviceTypeHrefMap[ServiceTypeKey.Chef],
    isActive: true,
    sortOrder: 1,
  },
  {
    label: 'Catering',
    description: 'Events, parties and bulk orders',
    value: ServiceTypeKey.Catering,
    icon: serviceTypeIconMap[ServiceTypeKey.Catering],
    href: serviceTypeHrefMap[ServiceTypeKey.Catering],
    isActive: true,
    sortOrder: 2,
  },
  {
    label: 'Meal Plans',
    description: 'Weekly or monthly meal plans',
    value: ServiceTypeKey.MealPlan,
    icon: serviceTypeIconMap[ServiceTypeKey.MealPlan],
    href: serviceTypeHrefMap[ServiceTypeKey.MealPlan],
    isActive: false,
    sortOrder: 3,
  },
];

function isKnownServiceTypeKey(key: string): key is ServiceTypeKey {
  return Object.values(ServiceTypeKey).includes(key as ServiceTypeKey);
}

function mapServiceTypeToOption(
  serviceType: CatalogServiceType
): AddServiceOption {
  const knownKey = isKnownServiceTypeKey(serviceType.key)
    ? serviceType.key
    : undefined;

  return {
    label: serviceType.label,
    description: serviceType.description,
    value: serviceType.key,
    icon: knownKey ? serviceTypeIconMap[knownKey] : <ServicesIcon size={16} />,
    href: knownKey ? serviceTypeHrefMap[knownKey] : undefined,
    isActive:
      serviceType.key === ServiceTypeKey.MealPlan
        ? false
        : serviceType.is_active,
    sortOrder: serviceType.sort_order,
  };
}

export default function AddServiceDropdown({
  label = '+ Add New Service',
  options,
  onSelect,
}: AddServiceDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { data: rawServiceTypes, isLoading } = useServiceTypes();
  const serviceTypes = rawServiceTypes as CatalogServiceType[] | undefined;
  const dropdownOptions = (
    options ??
    (serviceTypes?.length
      ? serviceTypes.map(mapServiceTypeToOption)
      : fallbackOptions)
  )
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

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
          {isLoading && !serviceTypes?.length && (
            <div style={styles.loading}>Loading services...</div>
          )}

          {dropdownOptions.map((option) => {
            const disabled = option.isActive === false || !option.href;

            return (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  setOpen(false);
                  onSelect(option);
                }}
                style={{
                  ...styles.option,
                  ...(disabled ? styles.optionDisabled : {}),
                }}
              >
                <span
                  style={{
                    ...styles.icon,
                    ...(disabled ? styles.iconDisabled : {}),
                  }}
                >
                  {option.icon}
                </span>

                <span
                  style={{
                    ...styles.text,
                    ...(disabled ? styles.textDisabled : {}),
                  }}
                >
                  <strong>{option.label}</strong>
                  {option.description && <small>{option.description}</small>}
                  {disabled && (
                    <small style={styles.disabledLabel}>
                      {option.isActive === false ? 'Inactive' : 'Coming soon'}
                    </small>
                  )}
                </span>
              </button>
            );
          })}
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

  optionDisabled: {
    cursor: 'not-allowed',
    opacity: 0.62,
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

  iconDisabled: {
    background: '#f1f5f9',
    color: '#94a3b8',
  },

  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    color: '#151126',
    fontSize: 13,
  },

  textDisabled: {
    color: '#64748b',
  },

  disabledLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },

  loading: {
    padding: '10px 12px',
    color: '#64748b',
    fontSize: 13,
  },
};
