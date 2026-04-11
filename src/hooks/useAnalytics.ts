import { useMemo } from "react";
import type { Lead, Invoice, WarrantyRecord } from "@/types/tenant";

interface CachedAddendum {
  id?: string;
  created_at?: string;
  status?: string;
  total_installed?: number;
  total_with_optional?: number;
  products_snapshot?: Array<{ id: string; name: string; badge_type: string; price: number }>;
  optional_selections?: Record<string, string>;
}

interface AnalyticsData {
  totalAddendums: number;
  signedAddendums: number;
  draftAddendums: number;
  totalInstalledRevenue: number;
  totalOptionalRevenue: number;
  avgAddendumValue: number;
  productAcceptanceRates: { name: string; accepted: number; declined: number; rate: number }[];
  recentActivity: { date: string; count: number }[];
  leadCount: number;
  invoiceCount: number;
  warrantyActive: number;
}

export const useAnalytics = (storeId: string) => {
  const data = useMemo<AnalyticsData>(() => {
    // Addendum stats from localStorage-cached data
    // In production, this would query Supabase aggregates
    const addendums = getAddendums();
    const leads = getLeads(storeId);
    const invoices = getInvoices(storeId);
    const warranties = getWarranties(storeId);

    const signed = addendums.filter(a => a.status === "signed");
    const drafts = addendums.filter(a => a.status === "draft");

    const totalInstalled = addendums.reduce((sum, a) => sum + (a.total_installed || 0), 0);
    const totalOptional = addendums.reduce((sum, a) => sum + ((a.total_with_optional || 0) - (a.total_installed || 0)), 0);
    const avg = addendums.length > 0 ? (totalInstalled + totalOptional) / addendums.length : 0;

    // Product acceptance rates
    const productStats: Record<string, { name: string; accepted: number; declined: number }> = {};
    for (const a of addendums) {
      const products = a.products_snapshot || [];
      const selections = a.optional_selections || {};
      for (const p of products) {
        if (p.badge_type === "optional") {
          if (!productStats[p.id]) productStats[p.id] = { name: p.name, accepted: 0, declined: 0 };
          if (selections[p.id] === "accept") productStats[p.id].accepted++;
          else if (selections[p.id] === "decline") productStats[p.id].declined++;
        }
      }
    }
    const productAcceptanceRates = Object.values(productStats).map(ps => ({
      ...ps,
      rate: (ps.accepted + ps.declined) > 0 ? Math.round((ps.accepted / (ps.accepted + ps.declined)) * 100) : 0,
    })).sort((a, b) => b.rate - a.rate);

    // Recent activity by date
    const dateCounts: Record<string, number> = {};
    for (const a of addendums) {
      const d = a.created_at?.slice(0, 10) || "";
      if (d) dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
    const recentActivity = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);

    return {
      totalAddendums: addendums.length,
      signedAddendums: signed.length,
      draftAddendums: drafts.length,
      totalInstalledRevenue: totalInstalled,
      totalOptionalRevenue: totalOptional,
      avgAddendumValue: avg,
      productAcceptanceRates,
      recentActivity,
      leadCount: leads.length,
      invoiceCount: invoices.length,
      warrantyActive: warranties.filter(w => w.status === "active").length,
    };
  }, [storeId]);

  return data;
};

function getAddendums(): CachedAddendum[] {
  try { return JSON.parse(localStorage.getItem("cached_addendums") || "[]") as CachedAddendum[]; } catch { return []; }
}

function getLeads(storeId: string): Lead[] {
  try { return (JSON.parse(localStorage.getItem("leads") || "[]") as Lead[]).filter(l => l.store_id === storeId); } catch { return []; }
}

function getInvoices(storeId: string): Invoice[] {
  try { return (JSON.parse(localStorage.getItem("invoices") || "[]") as Invoice[]).filter(i => i.store_id === storeId); } catch { return []; }
}

function getWarranties(storeId: string): WarrantyRecord[] {
  try { return (JSON.parse(localStorage.getItem("warranty_records") || "[]") as WarrantyRecord[]).filter(w => w.store_id === storeId); } catch { return []; }
}
