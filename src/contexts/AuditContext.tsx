import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { AuditLogEntry } from "@/types/tenant";

interface AuditContextType {
  log: (entry: Omit<AuditLogEntry, "id" | "created_at" | "ip_address">) => void;
  entries: AuditLogEntry[];
  getByEntity: (entityType: string, entityId: string) => AuditLogEntry[];
  getByStore: (storeId: string) => AuditLogEntry[];
  exportCsv: (storeId?: string) => string;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEY = "audit_log";
const MAX_ENTRIES = 10000;

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const persist = (next: AuditLogEntry[]) => {
    // Keep only the most recent entries
    const trimmed = next.slice(-MAX_ENTRIES);
    setEntries(trimmed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  };

  const log = useCallback((entry: Omit<AuditLogEntry, "id" | "created_at" | "ip_address">) => {
    const full: AuditLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      ip_address: "",  // captured server-side in production
      created_at: new Date().toISOString(),
    };
    setEntries(prev => {
      const next = [...prev, full];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(-MAX_ENTRIES)));
      return next.slice(-MAX_ENTRIES);
    });
  }, []);

  const getByEntity = (entityType: string, entityId: string) =>
    entries.filter(e => e.entity_type === entityType && e.entity_id === entityId);

  const getByStore = (storeId: string) =>
    entries.filter(e => e.store_id === storeId);

  const exportCsv = (storeId?: string) => {
    const filtered = storeId ? entries.filter(e => e.store_id === storeId) : entries;
    const header = "Timestamp,Action,Entity Type,Entity ID,User ID,Details";
    const rows = filtered.map(e =>
      `"${e.created_at}","${e.action}","${e.entity_type}","${e.entity_id}","${e.user_id}","${JSON.stringify(e.details).replace(/"/g, '""')}"`
    );
    return [header, ...rows].join("\n");
  };

  return (
    <AuditContext.Provider value={{ log, entries, getByEntity, getByStore, exportCsv }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error("useAudit must be used within AuditProvider");
  return ctx;
};
