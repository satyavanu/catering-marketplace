// Providers
export { QueryProvider } from './providers/QueryProvider';

// Config
export { queryClient, createQueryClient } from './config/query-client';
export { apiClient } from './config/axios';

// Query Hooks
export * from "./hooks";
export * from './queries/caterers';
export * from './queries/venues';
export * from './queries/decorations';
export * from './queries/reviews';
export * from './queries/categories';
export * from './queries/menu-items';
export * from './api/auth';
export * from "./queries/profile";
export * from "./queries/consents";
export * from "./queries/packages-menu";
export * from  "./queries/caterer-menu-items"
export * from "./queries/static-data";
export * from "./queries/onboardingUpload";
// Mutation Hooks
export * from './mutations/newsletter';

// Types
export * from './types';