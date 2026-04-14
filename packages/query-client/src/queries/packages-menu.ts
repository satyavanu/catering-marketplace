import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';

// ============ TYPES ============
interface MenuItem {
  id: string;
  section_id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_veg: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level?: 'mild' | 'medium' | 'spicy';
  pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
  price?: number;
  currency_code?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuSection {
  id: string;
  collection_id?: string;
  caterer_id?: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  items?: MenuItem[];
}

export interface MenuCollection {
  id: string;
  caterer_id: string;
  name: string;
  description?: string;
  image_url?: string;
  pricing_type: 'per_plate' | 'per_person' | 'fixed' | 'on_request';
  base_price: number;
  currency_code: string;
  min_guests: number;
  max_guests: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  menu_type?: 'catering' | 'simple';
  sections?: MenuSection[];
}

// ============ QUERY KEYS ============
export const packagesMenuKeys = {
  all: ['packagesMenu'] as const,
  
  // Collections
  collections: () => [...packagesMenuKeys.all, 'collections'] as const,
  collectionsList: () => [...packagesMenuKeys.collections(), 'list'] as const,
  collection: (id: string) => [...packagesMenuKeys.collections(), id] as const,
  
  // Simple Menus
  simpleMenus: () => [...packagesMenuKeys.all, 'simpleMenus'] as const,
  simpleMenusList: () => [...packagesMenuKeys.simpleMenus(), 'list'] as const,
  simpleMenu: (id: string) => [...packagesMenuKeys.simpleMenus(), id] as const,
  
  // Sections
  sections: () => [...packagesMenuKeys.all, 'sections'] as const,
  sectionsList: () => [...packagesMenuKeys.sections(), 'list'] as const,
  section: (id: string) => [...packagesMenuKeys.sections(), id] as const,
  sectionsByCollection: (collectionId: string) =>
    [...packagesMenuKeys.sections(), { collectionId }] as const,
  
  // Items
  items: () => [...packagesMenuKeys.all, 'items'] as const,
  itemsBySection: (sectionId: string) =>
    [...packagesMenuKeys.items(), { sectionId }] as const,
};

// ============ API CONFIGURATION ============
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Get authorization headers with access token
 */
async function getAuthHeaders(includeContentType: boolean = true): Promise<HeadersInit> {
  const session = await getSession();
  const headers = new Headers();

  if (includeContentType) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  return headers;
}

// ============ API FUNCTIONS - COLLECTIONS & SIMPLE MENUS ============
export const packagesMenuApi = {
  // ===== COLLECTIONS (CATERING PACKAGES) =====
  
  /**
   * Create a new collection (package)
   */
  createCollection: async (data: {
    name: string;
    description?: string;
    image_url?: string;
    pricing_type: 'per_plate' | 'per_person' | 'fixed' | 'on_request';
    base_price: number;
    currency_code: string;
    min_guests: number;
    max_guests: number;
    menu_type?: 'catering';
  }): Promise<MenuCollection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/my/menu/collections`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create collection: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  /**
   * Get all collections for the caterer
   */
  getCollections: async (): Promise<MenuCollection[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/my/menu/collections`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch collections: ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  },

  /**
   * Get a specific collection with its sections
   */
  getCollection: async (collectionId: string): Promise<MenuCollection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch collection: ${res.status}`);
      }

      return res.json();
    } catch (error) {
      console.error('Error fetching collection:', error);
      throw error;
    }
  },

  /**
   * Update a collection
   */
  updateCollection: async (
    collectionId: string,
    data: Partial<{
      name: string;
      description: string;
      image_url: string;
      pricing_type: string;
      base_price: number;
      currency_code: string;
      min_guests: number;
      max_guests: number;
      is_active: boolean;
      sort_order: number;
    }>
  ): Promise<MenuCollection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update collection: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  /**
   * Delete a collection
   */
  deleteCollection: async (collectionId: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete collection: ${res.status}`);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },

  // ===== SIMPLE MENUS (STANDALONE SECTIONS WITH ITEMS) =====

  /**
   * Create a simple menu (just a section with items, no collection wrapper)
   */
  createSimpleMenu: async (data: {
    name: string;
    description?: string;
    sort_order?: number;
  }): Promise<MenuSection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/my/menu/simple/sections`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create simple menu: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error creating simple menu:', error);
      throw error;
    }
  },

  /**
   * Get all standalone sections (simple menus)
   */
  getSimpleMenus: async (): Promise<MenuSection[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/my/menu/simple/sections`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch simple menus: ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching simple menus:', error);
      throw error;
    }
  },

  /**
   * Get complete simple menu (all sections with items)
   */
  getCompleteSimpleMenu: async (): Promise<MenuSection[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/api/v1/my/menu/simple`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch complete simple menu: ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching complete simple menu:', error);
      throw error;
    }
  },

  /**
   * Get a specific simple menu section with items
   */
  getSimpleMenu: async (sectionId: string): Promise<MenuSection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/simple/sections/${sectionId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch simple menu: ${res.status}`);
      }

      return res.json();
    } catch (error) {
      console.error('Error fetching simple menu:', error);
      throw error;
    }
  },

  /**
   * Update a simple menu section
   */
  updateSimpleMenu: async (
    sectionId: string,
    data: Partial<{
      name: string;
      description: string;
      is_active: boolean;
      sort_order: number;
    }>
  ): Promise<MenuSection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/simple/sections/${sectionId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update simple menu: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error updating simple menu:', error);
      throw error;
    }
  },

  /**
   * Delete a simple menu section
   */
  deleteSimpleMenu: async (sectionId: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/simple/sections/${sectionId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete simple menu: ${res.status}`);
      }
    } catch (error) {
      console.error('Error deleting simple menu:', error);
      throw error;
    }
  },

  // ===== SECTIONS WITH COLLECTION =====

  /**
   * Create a section within a collection
   */
  createCollectionSection: async (
    collectionId: string,
    data: {
      name: string;
      description?: string;
      sort_order: number;
    }
  ): Promise<MenuSection> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}/sections`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create section: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error creating collection section:', error);
      throw error;
    }
  },

  /**
   * Bulk create sections in a collection
   */
  bulkCreateCollectionSections: async (
    collectionId: string,
    data: {
      sections: Array<{
        name: string;
        description?: string;
        sort_order: number;
      }>;
    }
  ): Promise<MenuSection[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}/sections/bulk`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to bulk create sections: ${res.status}`
        );
      }

      const response = await res.json();
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error bulk creating collection sections:', error);
      throw error;
    }
  },

  /**
   * Get sections in a collection
   */
  getCollectionSections: async (collectionId: string): Promise<MenuSection[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/collections/${collectionId}/sections`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch collection sections: ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching collection sections:', error);
      throw error;
    }
  },

  // ===== ITEMS =====

  /**
   * Create an item in a section
   */
  createItem: async (
    sectionId: string,
    data: {
      name: string;
      description?: string;
      image_url?: string;
      is_veg: boolean;
      is_vegan: boolean;
      is_gluten_free: boolean;
      spice_level?: 'mild' | 'medium' | 'spicy';
      pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
      price?: number;
      currency_code?: string;
      sort_order: number;
    }
  ): Promise<MenuItem> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/sections/${sectionId}/items`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create item: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  /**
   * Bulk create items in a section
   */
  bulkCreateItems: async (
    sectionId: string,
    data: {
      items: Array<{
        name: string;
        description?: string;
        image_url?: string;
        is_veg: boolean;
        is_vegan: boolean;
        is_gluten_free: boolean;
        spice_level?: 'mild' | 'medium' | 'spicy';
        pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
        price?: number;
        currency_code?: string;
        sort_order: number;
      }>;
    }
  ): Promise<MenuItem[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/sections/${sectionId}/items/bulk`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to bulk create items: ${res.status}`
        );
      }

      const response = await res.json();
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.error('Error bulk creating items:', error);
      throw error;
    }
  },

  /**
   * Get items in a section
   */
  getItems: async (sectionId: string): Promise<MenuItem[]> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/sections/${sectionId}/items`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch items: ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  /**
   * Update an item
   */
  updateItem: async (
    itemId: string,
    data: Partial<{
      name: string;
      description: string;
      image_url: string;
      is_veg: boolean;
      is_vegan: boolean;
      is_gluten_free: boolean;
      spice_level: 'mild' | 'medium' | 'spicy';
      pricing_type: 'included' | 'extra' | 'on_request' | 'per_plate' | 'per_person';
      price: number;
      currency_code: string;
      is_active: boolean;
      sort_order: number;
    }>
  ): Promise<MenuItem> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items/${itemId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update item: ${res.status}`
        );
      }

      return res.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  /**
   * Delete an item
   */
  deleteItem: async (itemId: string): Promise<void> => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_BASE_URL}/api/v1/my/menu/items/${itemId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete item: ${res.status}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  },
};

// ============ REACT QUERY HOOKS - COLLECTIONS ============

/**
 * Get all collections for the caterer
 */
export const useCollections = () => {
  return useQuery({
    queryKey: packagesMenuKeys.collectionsList(),
    queryFn: () => packagesMenuApi.getCollections(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Get a specific collection with sections
 */
export const useCollection = (collectionId: string | null) => {
  return useQuery({
    queryKey: packagesMenuKeys.collection(collectionId || ''),
    queryFn: () => packagesMenuApi.getCollection(collectionId!),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a new collection
 */
export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof packagesMenuApi.createCollection>[0]) =>
      packagesMenuApi.createCollection(data),
    onSuccess: (newCollection) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.collectionsList(),
      });
      queryClient.setQueryData(
        packagesMenuKeys.collection(newCollection.id),
        newCollection
      );
    },
    onError: (error: Error) => {
      console.error('Create collection error:', error.message);
    },
  });
};

/**
 * Update a collection
 */
export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof packagesMenuApi.updateCollection>[1];
    }) => packagesMenuApi.updateCollection(id, data),
    onSuccess: (updatedCollection, { id }) => {
      queryClient.setQueryData(
        packagesMenuKeys.collection(id),
        updatedCollection
      );
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.collectionsList(),
      });
    },
    onError: (error: Error) => {
      console.error('Update collection error:', error.message);
    },
  });
};

/**
 * Delete a collection
 */
export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) =>
      packagesMenuApi.deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.collectionsList(),
      });
    },
    onError: (error: Error) => {
      console.error('Delete collection error:', error.message);
    },
  });
};

// ============ REACT QUERY HOOKS - SIMPLE MENUS ============

/**
 * Get all simple menus (standalone sections)
 */
export const useSimpleMenus = () => {
  return useQuery({
    queryKey: packagesMenuKeys.simpleMenusList(),
    queryFn: () => packagesMenuApi.getSimpleMenus(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Get complete simple menu (all sections with items)
 */
export const useCompleteSimpleMenu = () => {
  return useQuery({
    queryKey: packagesMenuKeys.simpleMenus(),
    queryFn: () => packagesMenuApi.getCompleteSimpleMenu(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Get a specific simple menu section with items
 */
export const useSimpleMenu = (sectionId: string | null) => {
  return useQuery({
    queryKey: packagesMenuKeys.simpleMenu(sectionId || ''),
    queryFn: () => packagesMenuApi.getSimpleMenu(sectionId!),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a simple menu section
 */
export const useCreateSimpleMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof packagesMenuApi.createSimpleMenu>[0]) =>
      packagesMenuApi.createSimpleMenu(data),
    onSuccess: (newSection) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenusList(),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenus(),
      });
      queryClient.setQueryData(
        packagesMenuKeys.simpleMenu(newSection.id),
        newSection
      );
    },
    onError: (error: Error) => {
      console.error('Create simple menu error:', error.message);
    },
  });
};

/**
 * Update a simple menu section
 */
export const useUpdateSimpleMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof packagesMenuApi.updateSimpleMenu>[1];
    }) => packagesMenuApi.updateSimpleMenu(id, data),
    onSuccess: (updatedSection, { id }) => {
      queryClient.setQueryData(
        packagesMenuKeys.simpleMenu(id),
        updatedSection
      );
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenusList(),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenus(),
      });
    },
    onError: (error: Error) => {
      console.error('Update simple menu error:', error.message);
    },
  });
};

/**
 * Delete a simple menu section
 */
export const useDeleteSimpleMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      packagesMenuApi.deleteSimpleMenu(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenusList(),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenus(),
      });
    },
    onError: (error: Error) => {
      console.error('Delete simple menu error:', error.message);
    },
  });
};

// ============ REACT QUERY HOOKS - SECTIONS ============

/**
 * Get sections in a collection
 */
export const useCollectionSections = (collectionId: string | null) => {
  return useQuery({
    queryKey: packagesMenuKeys.sectionsByCollection(collectionId || ''),
    queryFn: () => packagesMenuApi.getCollectionSections(collectionId!),
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create a section in a collection
 */
export const useCreateCollectionSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: string;
      data: Parameters<typeof packagesMenuApi.createCollectionSection>[1];
    }) => packagesMenuApi.createCollectionSection(collectionId, data),
    onSuccess: (newSection, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.sectionsByCollection(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.collection(collectionId),
      });
    },
    onError: (error: Error) => {
      console.error('Create collection section error:', error.message);
    },
  });
};

/**
 * Bulk create sections in a collection
 */
export const useBulkCreateCollectionSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      data,
    }: {
      collectionId: string;
      data: Parameters<typeof packagesMenuApi.bulkCreateCollectionSections>[1];
    }) => packagesMenuApi.bulkCreateCollectionSections(collectionId, data),
    onSuccess: (newSections, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.sectionsByCollection(collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.collection(collectionId),
      });
    },
    onError: (error: Error) => {
      console.error('Bulk create collection sections error:', error.message);
    },
  });
};

// ============ REACT QUERY HOOKS - ITEMS ============

/**
 * Get items in a section
 */
export const useItems = (sectionId: string | null) => {
  return useQuery({
    queryKey: packagesMenuKeys.itemsBySection(sectionId || ''),
    queryFn: () => packagesMenuApi.getItems(sectionId!),
    enabled: !!sectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Create an item in a section
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: Parameters<typeof packagesMenuApi.createItem>[1];
    }) => packagesMenuApi.createItem(sectionId, data),
    onSuccess: (newItem, { sectionId }) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.itemsBySection(sectionId),
      });
    },
    onError: (error: Error) => {
      console.error('Create item error:', error.message);
    },
  });
};

/**
 * Bulk create items in a section
 */
export const useBulkCreateItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: string;
      data: Parameters<typeof packagesMenuApi.bulkCreateItems>[1];
    }) => packagesMenuApi.bulkCreateItems(sectionId, data),
    onSuccess: (newItems, { sectionId }) => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.itemsBySection(sectionId),
      });
    },
    onError: (error: Error) => {
      console.error('Bulk create items error:', error.message);
    },
  });
};

/**
 * Update an item
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof packagesMenuApi.updateItem>[1];
    }) => packagesMenuApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.sectionsList(),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenus(),
      });
    },
    onError: (error: Error) => {
      console.error('Update item error:', error.message);
    },
  });
};

/**
 * Delete an item
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => packagesMenuApi.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.sectionsList(),
      });
      queryClient.invalidateQueries({
        queryKey: packagesMenuKeys.simpleMenus(),
      });
    },
    onError: (error: Error) => {
      console.error('Delete item error:', error.message);
    },
  });
};