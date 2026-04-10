import { useState, useEffect } from "react";
import type { WarrantyRecord } from "@/types/tenant";

const STORAGE_KEY = "warranty_records";

export const useWarranty = (storeId: string) => {
  const [records, setRecords] = useState<WarrantyRecord[]>([]);

  useEffect(() => {
    load();
  }, [storeId]);

  const load = () => {
    try {
      const all: WarrantyRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setRecords(all.filter(r => r.store_id === storeId));
    } catch { /* ignore */ }
  };

  const getAll = (): WarrantyRecord[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const addRecord = (data: Omit<WarrantyRecord, "id" | "created_at">) => {
    const rec: WarrantyRecord = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...getAll(), rec]));
    load();
    return rec;
  };

  const updateRecord = (id: string, updates: Partial<WarrantyRecord>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAll().map(r => r.id === id ? { ...r, ...updates } : r)));
    load();
  };

  const deleteRecord = (id: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAll().filter(r => r.id !== id)));
    load();
  };

  const getExpiringSoon = (days: number = 30) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    return records.filter(r => r.status === "active" && new Date(r.warranty_end) <= cutoff);
  };

  return { records, addRecord, updateRecord, deleteRecord, getExpiringSoon };
};
