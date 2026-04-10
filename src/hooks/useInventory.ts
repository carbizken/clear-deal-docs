import { useState, useEffect } from "react";
import type { InventoryVehicle } from "@/types/tenant";

const STORAGE_KEY = "inventory_vehicles";

export const useInventory = (storeId: string) => {
  const [vehicles, setVehicles] = useState<InventoryVehicle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const all: InventoryVehicle[] = JSON.parse(saved);
        setVehicles(all.filter(v => v.store_id === storeId));
      } catch { /* ignore */ }
    }
  }, [storeId]);

  const persist = (all: InventoryVehicle[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setVehicles(all.filter(v => v.store_id === storeId));
  };

  const getAll = (): InventoryVehicle[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const addVehicle = (data: Omit<InventoryVehicle, "id" | "imported_at" | "updated_at">) => {
    const vehicle: InventoryVehicle = {
      ...data,
      id: crypto.randomUUID(),
      imported_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    persist([...getAll(), vehicle]);
    return vehicle;
  };

  const importCsv = (csvText: string): { imported: number; errors: string[] } => {
    const lines = csvText.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return { imported: 0, errors: ["CSV must have a header row and at least one data row"] };

    const header = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));
    const errors: string[] = [];
    const newVehicles: InventoryVehicle[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      header.forEach((h, idx) => { row[h] = (values[idx] || "").trim(); });

      const vin = row.vin || row.vehicle_vin || "";
      if (!vin) { errors.push(`Row ${i + 1}: Missing VIN`); continue; }

      newVehicles.push({
        id: crypto.randomUUID(),
        store_id: storeId,
        vin,
        year: row.year || row.vehicle_year || "",
        make: row.make || row.vehicle_make || "",
        model: row.model || row.vehicle_model || "",
        trim: row.trim || row.vehicle_trim || "",
        stock_number: row.stock_number || row.stock || row.stocknumber || "",
        mileage: parseInt(row.mileage || row.miles || "0") || 0,
        condition: (row.condition || "used").toLowerCase() as any,
        color_exterior: row.color_exterior || row.exterior_color || row.color || "",
        color_interior: row.color_interior || row.interior_color || "",
        body_style: row.body_style || row.bodystyle || row.body || "",
        transmission: row.transmission || "",
        drive_type: row.drive_type || row.drivetrain || "",
        fuel_type: row.fuel_type || row.fuel || "",
        engine: row.engine || "",
        price: parseFloat(row.price || row.selling_price || "0") || 0,
        msrp: parseFloat(row.msrp || "0") || 0,
        description: row.description || "",
        image_url: row.image_url || row.image || row.photo || "",
        source_url: row.source_url || row.url || "",
        status: "in_stock",
        addendum_id: null,
        imported_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (newVehicles.length > 0) {
      persist([...getAll(), ...newVehicles]);
    }

    return { imported: newVehicles.length, errors };
  };

  const updateVehicle = (id: string, updates: Partial<InventoryVehicle>) => {
    const all = getAll().map(v => v.id === id ? { ...v, ...updates, updated_at: new Date().toISOString() } : v);
    persist(all);
  };

  const deleteVehicle = (id: string) => {
    persist(getAll().filter(v => v.id !== id));
  };

  return { vehicles, addVehicle, updateVehicle, deleteVehicle, importCsv };
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}
