'use client';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import {
  type ExperienceType,
  type ServiceCatalogStaticData,
  type ServiceType,
  useServiceCatalogStaticData,
} from '@catering-marketplace/query-client';

interface ServiceCatalogMetaContextType {
  serviceCatalog: ServiceCatalogStaticData | undefined;
  serviceTypes: ServiceType[];
  experienceTypes: ExperienceType[];
  isLoading: boolean;
  error: Error | null;
  getServiceType: (serviceKey: string) => ServiceType | undefined;
  getExperienceType: (experienceTypeKey: string) => ExperienceType | undefined;
  getExperienceTypesForService: (serviceKey: string) => ExperienceType[];
}

const ServiceCatalogMetaContext = createContext<
  ServiceCatalogMetaContextType | undefined
>(undefined);

export function ServiceCatalogMetaProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: serviceCatalog,
    isLoading,
    error,
  } = useServiceCatalogStaticData();

  const serviceTypes = useMemo(
    () =>
      [...(serviceCatalog?.service_types || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    [serviceCatalog?.service_types]
  );

  const experienceTypes = useMemo(
    () =>
      [...(serviceCatalog?.experience_types || [])].sort((a, b) => {
        if (a.service_key !== b.service_key) {
          return a.service_key.localeCompare(b.service_key);
        }
        return a.sort_order - b.sort_order;
      }),
    [serviceCatalog?.experience_types]
  );

  const value = useMemo<ServiceCatalogMetaContextType>(
    () => ({
      serviceCatalog,
      serviceTypes,
      experienceTypes,
      isLoading,
      error: error || null,
      getServiceType: (serviceKey: string) =>
        serviceTypes.find((item) => item.key === serviceKey),
      getExperienceType: (experienceTypeKey: string) =>
        experienceTypes.find((item) => item.key === experienceTypeKey),
      getExperienceTypesForService: (serviceKey: string) =>
        experienceTypes.filter((item) => item.service_key === serviceKey),
    }),
    [error, experienceTypes, isLoading, serviceCatalog, serviceTypes]
  );

  return (
    <ServiceCatalogMetaContext.Provider value={value}>
      {children}
    </ServiceCatalogMetaContext.Provider>
  );
}

export function useServiceCatalogMetaContext() {
  const context = useContext(ServiceCatalogMetaContext);

  if (context === undefined) {
    throw new Error(
      'useServiceCatalogMetaContext must be used within ServiceCatalogMetaProvider'
    );
  }

  return context;
}
