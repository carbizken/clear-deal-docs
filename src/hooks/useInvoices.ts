import { useState, useEffect } from "react";
import type { Invoice, PayrollEntry } from "@/types/tenant";

const INVOICES_KEY = "invoices";
const PAYROLL_KEY = "payroll_entries";

export const useInvoices = (storeId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payroll, setPayroll] = useState<PayrollEntry[]>([]);

  useEffect(() => {
    load();
  }, [storeId]);

  const load = () => {
    try {
      const allInv: Invoice[] = JSON.parse(localStorage.getItem(INVOICES_KEY) || "[]");
      setInvoices(allInv.filter(i => i.store_id === storeId));
      const allPay: PayrollEntry[] = JSON.parse(localStorage.getItem(PAYROLL_KEY) || "[]");
      setPayroll(allPay.filter(p => p.store_id === storeId));
    } catch { /* ignore */ }
  };

  const getAllInvoices = (): Invoice[] => {
    try { return JSON.parse(localStorage.getItem(INVOICES_KEY) || "[]"); } catch { return []; }
  };

  const getAllPayroll = (): PayrollEntry[] => {
    try { return JSON.parse(localStorage.getItem(PAYROLL_KEY) || "[]"); } catch { return []; }
  };

  const addInvoice = (data: Omit<Invoice, "id" | "created_at" | "updated_at">) => {
    const inv: Invoice = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const all = [...getAllInvoices(), inv];
    localStorage.setItem(INVOICES_KEY, JSON.stringify(all));

    // Auto-create payroll entry
    if (data.technician_name && data.labor_hours > 0) {
      const now = new Date();
      const week = `${now.getFullYear()}-W${String(Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7)).padStart(2, "0")}`;
      const entry: PayrollEntry = {
        id: crypto.randomUUID(),
        store_id: storeId,
        technician_name: data.technician_name,
        invoice_id: inv.id,
        vehicle_vin: data.vehicle_vin,
        work_description: data.work_performed.join(", "),
        piece_rate: data.labor_rate,
        quantity: data.labor_hours,
        total_pay: data.labor_hours * data.labor_rate,
        pay_period: week,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      const allP = [...getAllPayroll(), entry];
      localStorage.setItem(PAYROLL_KEY, JSON.stringify(allP));
    }

    load();
    return inv;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const all = getAllInvoices().map(i => i.id === id ? { ...i, ...updates, updated_at: new Date().toISOString() } : i);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(all));
    load();
  };

  const deleteInvoice = (id: string) => {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(getAllInvoices().filter(i => i.id !== id)));
    load();
  };

  const updatePayroll = (id: string, updates: Partial<PayrollEntry>) => {
    const all = getAllPayroll().map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(all));
    load();
  };

  const getPayrollByPeriod = (period: string) => payroll.filter(p => p.pay_period === period);

  const getPayrollByTechnician = (name: string) => payroll.filter(p => p.technician_name === name);

  return { invoices, payroll, addInvoice, updateInvoice, deleteInvoice, updatePayroll, getPayrollByPeriod, getPayrollByTechnician };
};
