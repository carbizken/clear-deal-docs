import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Tenant, Store } from "@/types/tenant";

interface TenantContextType {
  tenant: Tenant | null;
  stores: Store[];
  currentStore: Store | null;
  setCurrentStore: (store: Store) => void;
  addStore: (store: Omit<Store, "id" | "created_at">) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
  updateTenant: (updates: Partial<Tenant>) => void;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const TENANT_KEY = "wl_tenant";
const STORES_KEY = "wl_stores";
const CURRENT_STORE_KEY = "wl_current_store";

const DEFAULT_TENANT: Tenant = {
  id: "default",
  name: "HarteCash",
  slug: "hartecash",
  logo_url: "",
  primary_color: "#1a2b4a",
  secondary_color: "#2563eb",
  created_at: new Date().toISOString(),
  is_active: true,
};

const DEFAULT_STORE: Store = {
  id: "store-default",
  tenant_id: "default",
  name: "Harte Auto Group",
  slug: "harte-auto",
  address: "",
  city: "",
  state: "CT",
  zip: "",
  phone: "",
  logo_url: "",
  tagline: "Connecticut's Premier Family-Owned Dealer Group Since 1995",
  primary_color: "",
  created_at: new Date().toISOString(),
  is_active: true,
};

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTenant = localStorage.getItem(TENANT_KEY);
    const savedStores = localStorage.getItem(STORES_KEY);
    const savedCurrentId = localStorage.getItem(CURRENT_STORE_KEY);

    const t = savedTenant ? { ...DEFAULT_TENANT, ...JSON.parse(savedTenant) } : DEFAULT_TENANT;
    const s = savedStores ? JSON.parse(savedStores) : [DEFAULT_STORE];

    setTenant(t);
    setStores(s);
    setCurrentStoreState(s.find((st: Store) => st.id === savedCurrentId) || s[0] || null);
    setLoading(false);
  }, []);

  const persist = (t: Tenant, s: Store[]) => {
    localStorage.setItem(TENANT_KEY, JSON.stringify(t));
    localStorage.setItem(STORES_KEY, JSON.stringify(s));
  };

  const setCurrentStore = (store: Store) => {
    setCurrentStoreState(store);
    localStorage.setItem(CURRENT_STORE_KEY, store.id);
  };

  const addStore = (data: Omit<Store, "id" | "created_at">) => {
    const newStore: Store = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    const next = [...stores, newStore];
    setStores(next);
    if (tenant) persist(tenant, next);
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    const next = stores.map(s => s.id === id ? { ...s, ...updates } : s);
    setStores(next);
    if (currentStore?.id === id) setCurrentStoreState({ ...currentStore, ...updates });
    if (tenant) persist(tenant, next);
  };

  const deleteStore = (id: string) => {
    const next = stores.filter(s => s.id !== id);
    setStores(next);
    if (currentStore?.id === id) {
      const fallback = next[0] || null;
      setCurrentStoreState(fallback);
      if (fallback) localStorage.setItem(CURRENT_STORE_KEY, fallback.id);
    }
    if (tenant) persist(tenant, next);
  };

  const updateTenant = (updates: Partial<Tenant>) => {
    const next = { ...tenant!, ...updates };
    setTenant(next);
    persist(next, stores);
  };

  return (
    <TenantContext.Provider value={{ tenant, stores, currentStore, setCurrentStore, addStore, updateStore, deleteStore, updateTenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
};
