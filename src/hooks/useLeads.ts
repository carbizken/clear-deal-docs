import { useState, useEffect } from "react";
import type { Lead } from "@/types/tenant";

const STORAGE_KEY = "leads";

export const useLeads = (storeId: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    load();
  }, [storeId]);

  const load = () => {
    try {
      const all: Lead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setLeads(all.filter(l => l.store_id === storeId));
    } catch { /* ignore */ }
  };

  const getAll = (): Lead[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const addLead = (data: Omit<Lead, "id" | "captured_at" | "updated_at">) => {
    const lead: Lead = {
      ...data,
      id: crypto.randomUUID(),
      captured_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...getAll(), lead]));
    load();
    return lead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const all = getAll().map(l => l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    load();
  };

  const deleteLead = (id: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAll().filter(l => l.id !== id)));
    load();
  };

  const exportCsv = (): string => {
    const header = "Name,Phone,Email,Vehicle,VIN,Source,Status,Captured At";
    const rows = leads.map(l =>
      `"${l.name}","${l.phone}","${l.email}","${l.vehicle_interest}","${l.vehicle_vin}","${l.source}","${l.status}","${l.captured_at}"`
    );
    return [header, ...rows].join("\n");
  };

  return { leads, addLead, updateLead, deleteLead, exportCsv };
};
