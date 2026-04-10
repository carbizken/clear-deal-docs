import { useState, useEffect } from "react";

export interface QueuedVehicle {
  id: string;
  vin: string;
  stock_number: string;
  mileage: string;
  scanned_at: string;
  status: "queued" | "processing" | "completed" | "error";
  decoded_data?: any;
  notes: string;
}

const STORAGE_KEY = "vin_queue";

export const useVinQueue = () => {
  const [queue, setQueue] = useState<QueuedVehicle[]>([]);

  useEffect(() => {
    try { setQueue(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { /* */ }
  }, []);

  const persist = (items: QueuedVehicle[]) => {
    setQueue(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToQueue = (vin: string, stockNumber: string, mileage: string, notes?: string) => {
    const item: QueuedVehicle = {
      id: crypto.randomUUID(),
      vin: vin.toUpperCase().trim(),
      stock_number: stockNumber.trim(),
      mileage: mileage.trim(),
      scanned_at: new Date().toISOString(),
      status: "queued",
      notes: notes || "",
    };
    persist([...queue, item]);
    return item;
  };

  const updateItem = (id: string, updates: Partial<QueuedVehicle>) => {
    persist(queue.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeItem = (id: string) => {
    persist(queue.filter(q => q.id !== id));
  };

  const clearCompleted = () => {
    persist(queue.filter(q => q.status !== "completed"));
  };

  const getQueued = () => queue.filter(q => q.status === "queued");
  const getCompleted = () => queue.filter(q => q.status === "completed");

  return { queue, addToQueue, updateItem, removeItem, clearCompleted, getQueued, getCompleted };
};
