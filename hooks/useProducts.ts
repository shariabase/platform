import { useState, useCallback, useMemo } from 'react';
import { Product, ProductStatus, AssetType, Jurisdiction, Workflow, WorkflowStage } from '../types';
import {
  ProductTemplateWithDetails,
  ProductCreationData,
  ProductCategory,
  PRODUCT_TEMPLATES,
  getTemplateById,
  getTemplatesByCategory,
  getPopularTemplates,
} from '../types/products';

// --------------------------------------------
// Hook State Types
// --------------------------------------------

interface UseProductsState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface UseProductsReturn extends UseProductsState {
  // Product CRUD
  fetchProducts: () => Promise<void>;
  createProduct: (data: ProductCreationData, userId: string) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // Selection
  selectProduct: (product: Product | null) => void;
  
  // Queries
  getProductById: (id: string) => Product | undefined;
  getProductsByStatus: (status: ProductStatus) => Product[];
  getProductsByAssetType: (assetType: AssetType) => Product[];
  
  // Templates
  templates: ProductTemplateWithDetails[];
  getTemplate: (id: string) => ProductTemplateWithDetails | undefined;
  getTemplatesByCategory: (category: ProductCategory) => ProductTemplateWithDetails[];
  getPopularTemplates: () => ProductTemplateWithDetails[];
  
  // Utilities
  clearError: () => void;
}

// --------------------------------------------
// Mock Data
// --------------------------------------------

const generateMockProducts = (): Product[] => {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86400000);
  const weekAgo = new Date(now.getTime() - 604800000);

  return [
    {
      id: 'prod-1',
      templateId: 'tpl-murabaha-home',
      name: 'Home Financing Murabaha - Premium',
      assetType: 'murabaha',
      jurisdiction: 'UAE',
      tenor: 240,
      parameters: {
        propertyValue: 2500000,
        downPayment: 20,
        profitRate: 4.5,
        propertyType: 'Villa',
      },
      status: 'pending-sharia-review',
      createdBy: 'user-1',
      createdAt: dayAgo,
      updatedAt: now,
      workflowId: 'wf-1',
    },
    {
      id: 'prod-2',
      templateId: 'tpl-murabaha-vehicle',
      name: 'Vehicle Financing - Standard',
      assetType: 'murabaha',
      jurisdiction: 'Saudi Arabia',
      tenor: 60,
      parameters: {
        vehicleValue: 150000,
        downPayment: 15,
        profitRate: 5.0,
        vehicleType: 'SUV',
        isNew: 'New',
      },
      status: 'pending-legal-review',
      createdBy: 'user-1',
      createdAt: weekAgo,
      updatedAt: dayAgo,
      workflowId: 'wf-2',
    },
    {
      id: 'prod-3',
      templateId: 'tpl-ijara-equipment',
      name: 'Medical Equipment Ijara',
      assetType: 'ijara',
      jurisdiction: 'Malaysia',
      tenor: 84,
      parameters: {
        equipmentValue: 5000000,
        leaseRate: 6.5,
        residualValue: 10,
        equipmentType: 'Medical',
        maintenanceBy: 'Lessee',
      },
      status: 'sharia-approved',
      createdBy: 'user-1',
      createdAt: weekAgo,
      updatedAt: weekAgo,
      workflowId: 'wf-3',
    },
    {
      id: 'prod-4',
      templateId: 'tpl-wakala-deposit',
      name: 'Corporate Wakala Deposit',
      assetType: 'wakala',
      jurisdiction: 'Bahrain',
      tenor: 12,
      parameters: {
        depositAmount: 10000000,
        expectedProfit: 4.25,
        wakalaFee: 0.5,
        autoRenew: 'Yes',
      },
      status: 'active',
      createdBy: 'user-1',
      createdAt: weekAgo,
      updatedAt: weekAgo,
      workflowId: 'wf-4',
    },
  ];
};

// --------------------------------------------
// Main Hook
// --------------------------------------------

export const useProducts = (): UseProductsReturn => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  });

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockProducts = generateMockProducts();

      setState((prev) => ({
        ...prev,
        products: mockProducts,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch products',
      }));
    }
  }, []);

  // Create a new product
  const createProduct = useCallback(
    async (data: ProductCreationData, userId: string): Promise<Product> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const template = getTemplateById(data.templateId);
        const now = new Date();
        const productId = `prod-${Date.now()}`;
        const workflowId = `wf-${Date.now()}`;

        const newProduct: Product = {
          id: productId,
          templateId: data.templateId,
          name: data.name,
          assetType: data.assetType,
          jurisdiction: data.jurisdiction,
          tenor: data.tenor,
          parameters: data.parameters,
          status: 'draft',
          createdBy: userId,
          createdAt: now,
          updatedAt: now,
          workflowId,
        };

        setState((prev) => ({
          ...prev,
          products: [newProduct, ...prev.products],
          isLoading: false,
        }));

        return newProduct;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to create product',
        }));
        throw err;
      }
    },
    []
  );

  // Update a product
  const updateProduct = useCallback(
    async (productId: string, updates: Partial<Product>) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        setState((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === productId
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          ),
          selectedProduct:
            prev.selectedProduct?.id === productId
              ? { ...prev.selectedProduct, ...updates, updatedAt: new Date() }
              : prev.selectedProduct,
          isLoading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to update product',
        }));
        throw err;
      }
    },
    []
  );

  // Delete a product
  const deleteProduct = useCallback(async (productId: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setState((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
        selectedProduct:
          prev.selectedProduct?.id === productId ? null : prev.selectedProduct,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to delete product',
      }));
      throw err;
    }
  }, []);

  // Select a product
  const selectProduct = useCallback((product: Product | null) => {
    setState((prev) => ({ ...prev, selectedProduct: product }));
  }, []);

  // Get product by ID
  const getProductByIdFn = useCallback(
    (id: string): Product | undefined => {
      return state.products.find((p) => p.id === id);
    },
    [state.products]
  );

  // Get products by status
  const getProductsByStatus = useCallback(
    (status: ProductStatus): Product[] => {
      return state.products.filter((p) => p.status === status);
    },
    [state.products]
  );

  // Get products by asset type
  const getProductsByAssetType = useCallback(
    (assetType: AssetType): Product[] => {
      return state.products.filter((p) => p.assetType === assetType);
    },
    [state.products]
  );

  // Template methods
  const getTemplateFn = useCallback(
    (id: string): ProductTemplateWithDetails | undefined => {
      return getTemplateById(id);
    },
    []
  );

  const getTemplatesByCategoryFn = useCallback(
    (category: ProductCategory): ProductTemplateWithDetails[] => {
      return getTemplatesByCategory(category);
    },
    []
  );

  const getPopularTemplatesFn = useCallback((): ProductTemplateWithDetails[] => {
    return getPopularTemplates();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    selectProduct,
    getProductById: getProductByIdFn,
    getProductsByStatus,
    getProductsByAssetType,
    templates: PRODUCT_TEMPLATES,
    getTemplate: getTemplateFn,
    getTemplatesByCategory: getTemplatesByCategoryFn,
    getPopularTemplates: getPopularTemplatesFn,
    clearError,
  };
};

export default useProducts;
