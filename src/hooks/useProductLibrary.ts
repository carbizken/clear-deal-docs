import { useState, useEffect } from "react";
import type { ProductLibraryEntry, VehicleCategory } from "@/types/product";
import { getProductPrice } from "@/types/product";

const STORAGE_KEY = "product_library";

export const useProductLibrary = (storeId: string) => {
  const [library, setLibrary] = useState<ProductLibraryEntry[]>([]);

  useEffect(() => { load(); }, [storeId]);

  const load = () => {
    try {
      const all: ProductLibraryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setLibrary(all.filter(p => p.is_active));
    } catch { /* */ }
  };

  const getAll = (): ProductLibraryEntry[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const persist = (all: ProductLibraryEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setLibrary(all.filter(p => p.is_active));
  };

  const addProduct = (data: Omit<ProductLibraryEntry, "id" | "created_at" | "updated_at">): ProductLibraryEntry => {
    const product: ProductLibraryEntry = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    persist([...getAll(), product]);
    return product;
  };

  const updateProduct = (id: string, updates: Partial<ProductLibraryEntry>) => {
    persist(getAll().map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    persist(getAll().filter(p => p.id !== id));
  };

  // Get products with prices adjusted for a specific vehicle category
  const getProductsForVehicle = (vehicleCategory: VehicleCategory): (ProductLibraryEntry & { adjustedPrice: number })[] => {
    return library.map(p => ({
      ...p,
      adjustedPrice: getProductPrice(p, vehicleCategory),
    }));
  };

  // Get products by category
  const getByCategory = (category: string): ProductLibraryEntry[] =>
    library.filter(p => p.category === category);

  // Search products
  const search = (query: string): ProductLibraryEntry[] => {
    const q = query.toLowerCase();
    return library.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.vendorName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  };

  return {
    library,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsForVehicle,
    getByCategory,
    search,
  };
};
