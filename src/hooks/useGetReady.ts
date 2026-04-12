import { useState, useEffect } from "react";

export type GetReadyStatus = "pending" | "in_progress" | "inspection" | "detail" | "photo" | "ready" | "inventory";

export interface GetReadyItem {
  id: string;
  label: string;
  category: "accessory" | "inspection" | "detail" | "photo" | "other";
  assignedTo: string;
  status: "pending" | "complete";
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface GetReadyRecord {
  id: string;
  storeId: string;
  vin: string;
  stockNumber: string;
  ymm: string;
  condition: "new" | "used";

  // Timeline — proves accessories installed BEFORE inventory date
  acquiredDate: string;        // Date dealer acquired the vehicle
  getReadyStartDate: string;   // Date get-ready process began
  getReadyCompleteDate: string; // Date car was marked ready for sale
  inventoryDate: string;       // Date car hit active inventory for sale

  // Checklist items
  items: GetReadyItem[];

  // Accessories to install (from products)
  accessoriesToInstall: { productId: string; productName: string; installed: boolean; installedDate?: string; installedBy?: string }[];

  // Inspection
  inspectionRequired: boolean;
  inspectionFormType?: string;  // e.g. "CT-K208"
  inspectionComplete: boolean;
  inspectionDate?: string;
  inspectionBy?: string;
  inspectionSignatureData?: string;
  autocurbInspectionId?: string; // Link to autocurb.io inspection if available

  // Service department assignment
  assignedTechnician: string;
  serviceAdvisor: string;
  roNumber: string;

  // Overall status
  status: GetReadyStatus;

  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

const STORAGE_KEY = "get_ready_records";

export const useGetReady = (storeId: string) => {
  const [records, setRecords] = useState<GetReadyRecord[]>([]);

  useEffect(() => { load(); }, [storeId]);

  const load = () => {
    try {
      const all: GetReadyRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setRecords(all.filter(r => r.storeId === storeId));
    } catch { /* */ }
  };

  const getAll = (): GetReadyRecord[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  };

  const persist = (all: GetReadyRecord[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setRecords(all.filter(r => r.storeId === storeId));
  };

  const createGetReady = (data: {
    vin: string;
    stockNumber: string;
    ymm: string;
    condition: "new" | "used";
    acquiredDate: string;
    accessoriesToInstall: { productId: string; productName: string }[];
    inspectionRequired: boolean;
    inspectionFormType?: string;
    assignedTechnician?: string;
    serviceAdvisor?: string;
    roNumber?: string;
    createdBy: string;
  }): GetReadyRecord => {
    const now = new Date().toISOString();

    // Build default checklist
    const items: GetReadyItem[] = [];

    // Add accessory installation items
    data.accessoriesToInstall.forEach(acc => {
      items.push({
        id: crypto.randomUUID(),
        label: `Install: ${acc.productName}`,
        category: "accessory",
        assignedTo: data.assignedTechnician || "",
        status: "pending",
      });
    });

    // Add inspection if required
    if (data.inspectionRequired) {
      items.push({
        id: crypto.randomUUID(),
        label: `Safety Inspection${data.inspectionFormType ? ` (${data.inspectionFormType})` : ""}`,
        category: "inspection",
        assignedTo: data.serviceAdvisor || "",
        status: "pending",
      });
    }

    // Standard get-ready items
    items.push(
      { id: crypto.randomUUID(), label: "Detail — interior", category: "detail", assignedTo: "", status: "pending" },
      { id: crypto.randomUUID(), label: "Detail — exterior wash", category: "detail", assignedTo: "", status: "pending" },
      { id: crypto.randomUUID(), label: "Photos for listing", category: "photo", assignedTo: "", status: "pending" },
    );

    const record: GetReadyRecord = {
      id: crypto.randomUUID(),
      storeId,
      vin: data.vin,
      stockNumber: data.stockNumber,
      ymm: data.ymm,
      condition: data.condition,
      acquiredDate: data.acquiredDate,
      getReadyStartDate: now,
      getReadyCompleteDate: "",
      inventoryDate: "",
      items,
      accessoriesToInstall: data.accessoriesToInstall.map(a => ({
        ...a,
        installed: false,
      })),
      inspectionRequired: data.inspectionRequired,
      inspectionFormType: data.inspectionFormType,
      inspectionComplete: false,
      assignedTechnician: data.assignedTechnician || "",
      serviceAdvisor: data.serviceAdvisor || "",
      roNumber: data.roNumber || "",
      status: "pending",
      createdAt: now,
      createdBy: data.createdBy,
      updatedAt: now,
    };

    persist([...getAll(), record]);
    return record;
  };

  const completeItem = (recordId: string, itemId: string, completedBy: string) => {
    const all = getAll();
    const record = all.find(r => r.id === recordId);
    if (!record) return;
    const item = record.items.find(i => i.id === itemId);
    if (!item) return;
    item.status = "complete";
    item.completedAt = new Date().toISOString();
    item.completedBy = completedBy;
    record.updatedAt = new Date().toISOString();

    // Check if all items complete → mark get-ready as ready
    if (record.items.every(i => i.status === "complete")) {
      record.status = "ready";
      record.getReadyCompleteDate = new Date().toISOString();
    } else {
      record.status = "in_progress";
    }

    persist(all);
  };

  const markInventory = (recordId: string) => {
    const all = getAll();
    const record = all.find(r => r.id === recordId);
    if (!record) return;

    // Validate get-ready is complete before allowing inventory date
    if (record.status !== "ready") return;

    record.inventoryDate = new Date().toISOString();
    record.status = "inventory";
    record.updatedAt = new Date().toISOString();
    persist(all);
  };

  const completeInspection = (recordId: string, data: {
    inspectedBy: string;
    signatureData?: string;
    autocurbInspectionId?: string;
  }) => {
    const all = getAll();
    const record = all.find(r => r.id === recordId);
    if (!record) return;
    record.inspectionComplete = true;
    record.inspectionDate = new Date().toISOString();
    record.inspectionBy = data.inspectedBy;
    record.inspectionSignatureData = data.signatureData;
    record.autocurbInspectionId = data.autocurbInspectionId;
    record.updatedAt = new Date().toISOString();

    // Mark inspection checklist item as complete
    const inspItem = record.items.find(i => i.category === "inspection");
    if (inspItem) {
      inspItem.status = "complete";
      inspItem.completedAt = new Date().toISOString();
      inspItem.completedBy = data.inspectedBy;
    }

    persist(all);
  };

  const markAccessoryInstalled = (recordId: string, productId: string, installedBy: string) => {
    const all = getAll();
    const record = all.find(r => r.id === recordId);
    if (!record) return;
    const acc = record.accessoriesToInstall.find(a => a.productId === productId);
    if (!acc) return;
    acc.installed = true;
    acc.installedDate = new Date().toISOString();
    acc.installedBy = installedBy;
    record.updatedAt = new Date().toISOString();

    // Mark matching checklist item as complete
    const item = record.items.find(i => i.label.includes(acc.productName) && i.category === "accessory");
    if (item) {
      item.status = "complete";
      item.completedAt = new Date().toISOString();
      item.completedBy = installedBy;
    }

    persist(all);
  };

  const getByVin = (vin: string): GetReadyRecord | null =>
    records.find(r => r.vin === vin) || null;

  const getPending = (): GetReadyRecord[] =>
    records.filter(r => r.status !== "inventory");

  // Validate: get-ready complete date must be BEFORE inventory date
  const validateTimeline = (record: GetReadyRecord): { valid: boolean; message: string } => {
    if (!record.getReadyCompleteDate || !record.inventoryDate) {
      return { valid: true, message: "Timeline not yet complete" };
    }
    if (new Date(record.getReadyCompleteDate) <= new Date(record.inventoryDate)) {
      return { valid: true, message: "Timeline valid: get-ready completed before inventory date" };
    }
    return {
      valid: false,
      message: "WARNING: Get-ready completion date is AFTER inventory date. This may indicate accessories were installed after the vehicle was listed for sale.",
    };
  };

  return {
    records,
    createGetReady,
    completeItem,
    markInventory,
    completeInspection,
    markAccessoryInstalled,
    getByVin,
    getPending,
    validateTimeline,
  };
};
