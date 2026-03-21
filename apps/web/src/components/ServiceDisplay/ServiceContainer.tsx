'use client';

import React, { useState, useCallback } from 'react';
import FilterSection, { FilterConfig } from '../ServiceFilters/FilterSection';
import ServiceGrid from './ServiceGrid';
import ViewModeToggle from './ViewModeToggle';

interface ServiceContainerProps<T> {
  initialItems: T[];
  filterConfig: FilterConfig[];
  cardComponent: React.ComponentType<{ item: T }>;
  title: string;
  description: string;
  gridColumns?: string;
  onFilterApply?: (filters: Record<string, string | string[]>) => T[];
  viewModeTitle?: string;
  mapPlaceholder?: string;
}

const ServiceContainer = React.forwardRef<HTMLDivElement, ServiceContainerProps<any>>(
  ({
    initialItems,
    filterConfig,
    cardComponent,
    title,
    description,
    gridColumns,
    onFilterApply,
    viewModeTitle,
    mapPlaceholder,
  }, ref) => {
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [filters, setFilters] = useState<Record<string, string | string[]>>(
      Object.fromEntries(filterConfig.map(config => [config.name, config.type === 'multiselect' ? [] : '']))
    );
    const [filteredItems, setFilteredItems] = useState(initialItems);

    const isFiltersActive = Object.values(filters).some(val => 
      Array.isArray(val) ? val.length > 0 : val !== ''
    );

    const handleFilterChange = useCallback((filterName: string, value: string | string[]) => {
      setFilters(prev => ({
        ...prev,
        [filterName]: value,
      }));
    }, []);

    const handleSearch = useCallback(() => {
      if (onFilterApply) {
        const results = onFilterApply(filters);
        setFilteredItems(results);
      } else {
        // Default filter logic if no onFilterApply provided
        const results = initialItems.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return true;
            const itemValue = (item as any)[key];
            if (Array.isArray(value)) {
              return value.some(v => String(itemValue).toLowerCase().includes(v.toLowerCase()));
            }
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          });
        });
        setFilteredItems(results);
      }
    }, [filters, initialItems, onFilterApply]);

    const handleReset = useCallback(() => {
      setFilters(
        Object.fromEntries(filterConfig.map(config => [config.name, config.type === 'multiselect' ? [] : '']))
      );
      setFilteredItems(initialItems);
    }, [filterConfig, initialItems]);

    return (
      <div ref={ref}>
        {/* Filters Section with View Mode Toggle */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            marginBottom: '40px',
            marginTop: '80px',
          }}
        >
          {/* Header with View Toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Find Your Perfect Service
            </h2>
            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Filter Section */}
          <FilterSection
            filters={filters}
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
            isFiltersActive={isFiltersActive}
          />
        </div>

        {/* Service Grid */}
        <ServiceGrid
          items={filteredItems}
          viewMode={viewMode}
          cardComponent={cardComponent}
          title={viewModeTitle || title}
          description={`Displaying ${filteredItems.length} results`}
          gridColumns={gridColumns}
          mapPlaceholder={mapPlaceholder}
        />
      </div>
    );
  }
);

ServiceContainer.displayName = 'ServiceContainer';

export default ServiceContainer;