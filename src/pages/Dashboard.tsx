import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useAudit } from "@/contexts/AuditContext";
import { useNavigate } from "react-router-dom";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import {
  FileText,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { currentStore } = useTenant();
  const { entries } = useAudit();
  const navigate = useNavigate();

  const { data: addendums } = useQuery({
    queryKey: ["addendums-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addendums")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const all = addendums || [];
  const signed = all.filter(a => a.status === "signed");
  const drafts = all.filter(a => a.status === "draft");

  const signedToday = signed.filter(a => isToday(new Date(a.created_at)));
  const signedWeek = signed.filter(a => isThisWeek(new Date(a.created_at)));
  const createdThisMonth = all.filter(a => isThisMonth(new Date(a.created_at)));

  const revenueMonth = createdThisMonth.reduce((sum, a) => sum + (Number(a.total_with_optional) || 0), 0);
  const revenueWeek = signedWeek.reduce((sum, a) => sum + (Number(a.total_with_optional) || 0), 0);

  const recentAddendums = all.slice(0, 5);
  const recentActivity = entries.slice(-8).reverse();

  // Top products by acceptance
  const productStats: Record<string, { name: string; accepted: number; declined: number }> = {};
  for (const a of all) {
    const products = (a.products_snapshot as any[]) || [];
    const selections = (a.optional_selections as Record<string, string>) || {};
    for (const p of products) {
      if (p.badge_type === "optional") {
        if (!productStats[p.id]) productStats[p.id] = { name: p.name, accepted: 0, declined: 0 };
        if (selections[p.id] === "accept") productStats[p.id].accepted++;
        else if (selections[p.id] === "decline") productStats[p.id].declined++;
      }
    }
  }
  const topProducts = Object.values(productStats)
    .map(ps => ({ ...ps, rate: ps.accepted + ps.declined > 0 ? Math.round((ps.accepted / (ps.accepted + ps.declined)) * 100) : 0 }))
    .filter(p => p.accepted + p.declined > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = user?.email?.split("@")[0].split(".")[0] || "there";
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-display text-foreground">
            {greeting}, {capitalized}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStore?.name} · {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Addendum
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Signed today"
          value={signedToday.length.toString()}
          trend={`${signedWeek.length} this week`}
          icon={CheckCircle2}
          accent="text-teal"
        />
        <StatCard
          label="Active drafts"
          value={drafts.length.toString()}
          trend={drafts.length > 0 ? "Awaiting completion" : "All clear"}
          icon={FileText}
          accent="text-blue"
        />
        <StatCard
          label="Revenue this month"
          value={`$${revenueMonth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          trend={`$${revenueWeek.toLocaleString(undefined, { maximumFractionDigits: 0 })} this week`}
          icon={DollarSign}
          accent="text-teal"
        />
        <StatCard
          label="Total addendums"
          value={all.length.toString()}
          trend={`${signed.length} signed`}
          icon={TrendingUp}
          accent="text-foreground"
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent addendums */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-premium">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Recent Addendums</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest activity across your store</p>
            </div>
            <button
              onClick={() => navigate("/saved")}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div>
            {recentAddendums.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No addendums yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create your first addendum to see it here
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Addendum
                </button>
              </div>
            ) : (
              recentAddendums.map(a => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/?id=${a.id}`)}
                  className="w-full flex items-center gap-3 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {a.vehicle_ymm || "Draft addendum"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a.customer_name || "No customer"} · {format(new Date(a.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        a.status === "signed"
                          ? "bg-teal/10 text-teal"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.status}
                    </span>
                    {a.total_with_optional != null && (
                      <span className="text-xs font-medium text-foreground">
                        ${Number(a.total_with_optional).toLocaleString()}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right column: top products + activity */}
        <div className="space-y-6">
          {/* Top products */}
          <div className="bg-card rounded-xl border border-border shadow-premium">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Top Products</h2>
              <p className="text-xs text-muted-foreground mt-0.5">By acceptance rate</p>
            </div>
            <div className="px-5 py-3">
              {topProducts.length === 0 ? (
                <div className="py-6 text-center">
                  <Sparkles className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No data yet</p>
                </div>
              ) : (
                topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <span className="text-xs text-muted-foreground font-mono w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                      <div className="w-full h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-teal"
                          style={{ width: `${p.rate}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums">{p.rate}%</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-card rounded-xl border border-border shadow-premium">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Compliance log</p>
            </div>
            <div>
              {recentActivity.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                </div>
              ) : (
                recentActivity.map(e => (
                  <div key={e.id} className="px-5 py-2.5 border-b border-border last:border-0">
                    <p className="text-xs font-medium text-foreground">
                      {e.action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(e.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  trend,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof FileText;
  accent: string;
}) => (
  <div className="bg-card rounded-xl border border-border p-5 shadow-premium hover:shadow-premium-md transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Icon className={`w-4 h-4 ${accent}`} />
    </div>
    <div className="text-2xl font-semibold tracking-tight text-foreground font-display tabular-nums">
      {value}
    </div>
    <p className="text-xs text-muted-foreground mt-1">{trend}</p>
  </div>
);

export default Dashboard;
