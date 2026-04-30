'use client';

import React from 'react';

export type DataTableColumn<T> = {
  key: string;
  label: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
};

export type DataTableAction<T> = {
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: (row: T) => void;
};

type DataTableProps<T> = {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  emptyText?: string;
  getRowKey: (row: T) => string;
};

export default function DataTable<T>({
  title,
  subtitle,
  data,
  columns,
  actions = [],
  emptyText = 'No records found.',
  getRowKey,
}: DataTableProps<T>) {
  return (
    <div style={styles.card}>
      {(title || subtitle) && (
        <div style={styles.header}>
          <div>
            {title && <h2 style={styles.title}>{title}</h2>}
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      )}

      <div style={styles.tableWrap}>
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
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
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
                      {column.render ? column.render(row) : null}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={styles.actions}>
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => action.onClick(row)}
                            style={{
                              ...styles.actionButton,
                              ...(action.variant === 'primary'
                                ? styles.primaryAction
                                : {}),
                              ...(action.variant === 'danger'
                                ? styles.dangerAction
                                : {}),
                            }}
                          >
                            {action.icon}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#ffffff',
    border: '1px solid rgba(124, 58, 237, 0.12)',
    borderRadius: 22,
    boxShadow: '0 18px 45px rgba(17, 24, 39, 0.04)',
    overflow: 'hidden',
  },

  header: {
    padding: '20px 22px',
    borderBottom: '1px solid #f1edf8',
  },

  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 500,
    color: '#151126',
  },

  subtitle: {
    margin: '5px 0 0',
    fontSize: 13,
    color: '#64748b',
  },

  tableWrap: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 860,
  },

  th: {
    padding: '14px 18px',
    fontSize: 12,
    color: '#64748b',
    fontWeight: 450,
    background: '#fbf8ff',
    borderBottom: '1px solid #f1edf8',
    whiteSpace: 'nowrap',
  },

  tr: {
    borderBottom: '1px solid #f5f1fa',
  },

  td: {
    padding: '15px 18px',
    fontSize: 13,
    color: '#334155',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  },

  empty: {
    padding: 32,
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
    minHeight: 34,
    padding: '0 12px',
    borderRadius: 10,
    border: '1px solid #ede9fe',
    background: '#ffffff',
    color: '#6d28d9',
    fontSize: 12,
    fontWeight: 450,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },

  primaryAction: {
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    color: '#ffffff',
    border: 'none',
  },

  dangerAction: {
    background: '#fff1f2',
    color: '#dc2626',
    border: '1px solid #fecdd3',
  },
};