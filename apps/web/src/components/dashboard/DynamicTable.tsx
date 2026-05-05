'use client';

import React from 'react';

export type DynamicTableColumn<T> = {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => React.ReactNode;
};

export type DynamicTableAction<T> = {
  label: string | ((row: T) => string);
  icon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
  disabled?: (row: T) => boolean;
  isLoading?: (row: T) => boolean;
  onClick: (row: T) => void;
};

type Props<T> = {
  data: T[];
  columns: DynamicTableColumn<T>[];
  actions?: DynamicTableAction<T>[];
  getRowKey: (row: T) => string;
  emptyText?: string;
};

export default function DynamicTable<T>({
  data,
  columns,
  actions = [],
  getRowKey,
  emptyText = 'No records found.',
}: Props<T>) {
  return (
    <div style={styles.wrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...styles.th,
                  width: column.width,
                  textAlign: column.align || 'left',
                }}
              >
                {column.label}
              </th>
            ))}

            {actions.length > 0 && (
              <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions.length ? 1 : 0)}
                style={styles.empty}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={getRowKey(row)} style={styles.tr}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      ...styles.td,
                      textAlign: column.align || 'left',
                    }}
                  >
                    {column.render(row)}
                  </td>
                ))}

                {actions.length > 0 && (
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actions}>
                      {actions.map((action, index) => {
                        const label =
                          typeof action.label === 'function'
                            ? action.label(row)
                            : action.label;
                        const disabled = action.disabled?.(row) || false;
                        const loading = action.isLoading?.(row) || false;

                        return (
                          <button
                            key={`${label}-${index}`}
                            title={label}
                            type="button"
                            disabled={disabled || loading}
                            onClick={() => action.onClick(row)}
                            style={{
                              ...styles.actionButton,
                              ...(action.variant === 'primary'
                                ? styles.primaryAction
                                : {}),
                              ...(action.variant === 'danger'
                                ? styles.dangerAction
                                : {}),
                              ...(disabled || loading
                                ? styles.disabledAction
                                : {}),
                            }}
                          >
                            {loading
                              ? action.loadingIcon || action.icon || label
                              : action.icon || label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    width: '100%',
    overflowX: 'auto',
    border: '1px solid #eee9f7',
    borderRadius: 18,
    background: '#ffffff',
  },

  table: {
    width: '100%',
    minWidth: 900,
    borderCollapse: 'separate',
    borderSpacing: 0,
  },

  th: {
    padding: '13px 16px',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#8b8aa3',
    background: '#faf8ff',
    borderBottom: '1px solid #f2ecfb',
    whiteSpace: 'nowrap',
  },

  tr: {
    borderBottom: '1px solid #f6f2fb',
  },

  td: {
    padding: '15px 16px',
    fontSize: 13,
    color: '#334155',
    borderBottom: '1px solid #f6f2fb',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },

  empty: {
    padding: 36,
    textAlign: 'center',
    color: '#64748b',
    fontSize: 14,
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },

  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: '1px solid #eee9f7',
    background: '#ffffff',
    color: '#7c3aed',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  primaryAction: {
    background: '#7c3aed',
    color: '#ffffff',
    border: 'none',
  },

  dangerAction: {
    background: '#fff1f2',
    color: '#dc2626',
    border: '1px solid #fecdd3',
  },

  disabledAction: {
    opacity: 0.55,
    cursor: 'not-allowed',
  },
};
