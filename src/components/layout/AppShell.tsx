import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Package,
  Users,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  ChevronsUpDown,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
  ScrollText,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import { useDealerSettings } from "@/contexts/DealerSettingsContext";
import { useAudit } from "@/contexts/AuditContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppShellProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  section?: string;
  featureKey?: string;
}

const NAV: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, section: "Workspace" },
  { label: "New Addendum", path: "/", icon: FileText, section: "Workspace" },
  { label: "Saved Addendums", path: "/saved", icon: FolderOpen, section: "Workspace" },
  { label: "Buyers Guide", path: "/buyers-guide", icon: ScrollText, section: "Workspace", featureKey: "feature_buyers_guide" },

  { label: "Products", path: "/admin?tab=products", icon: Package, section: "Configuration" },
  { label: "Product Rules", path: "/admin?tab=rules", icon: Wrench, section: "Configuration", featureKey: "feature_product_rules" },
  { label: "Branding", path: "/admin?tab=branding", icon: Sparkles, section: "Configuration" },
  { label: "Feature Toggles", path: "/admin?tab=settings", icon: Settings, section: "Configuration" },

  { label: "Analytics", path: "/admin?tab=analytics", icon: BarChart3, section: "Insights", featureKey: "feature_analytics" },
  { label: "Leads", path: "/admin?tab=leads", icon: Users, section: "Insights", featureKey: "feature_lead_capture" },
  { label: "Compliance Log", path: "/admin?tab=audit", icon: ShieldCheck, section: "Insights" },
];

const AppShell = ({ children }: AppShellProps) => {
  const { user, signOut } = useAuth();
  const { tenant, currentStore, stores, setCurrentStore } = useTenant();
  const { settings } = useDealerSettings();
  const { entries } = useAudit();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = NAV.filter(n => !n.featureKey || (settings as any)[n.featureKey]);
  const sections = Array.from(new Set(filteredNav.map(n => n.section).filter(Boolean)));

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const userInitial = user?.email?.[0]?.toUpperCase() || "U";
  const recentNotifications = entries.slice(-5).reverse();

  const isActive = (path: string): boolean => {
    const [pathname, query] = path.split("?");
    if (location.pathname !== pathname) return false;
    if (!query) return !location.search;
    return location.search.includes(query);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-sidebar transform transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-sidebar-foreground">
              {tenant?.name || "Clear Deal"}
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store Selector */}
        {stores.length > 0 && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-sidebar-accent transition-colors text-left group">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <Store className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Store</p>
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {currentStore?.name || "No store"}
                    </p>
                  </div>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs">Switch Store</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {stores.map(s => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={() => setCurrentStore(s)}
                    className={currentStore?.id === s.id ? "bg-accent" : ""}
                  >
                    <Store className="w-3.5 h-3.5 mr-2" />
                    {s.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Nav */}
        <nav className="px-3 py-3 space-y-5 overflow-y-auto h-[calc(100vh-8rem)]">
          {sections.map(section => (
            <div key={section}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {section}
              </p>
              <div className="space-y-0.5">
                {filteredNav
                  .filter(n => n.section === section)
                  .map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMobileOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="lg:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-1.5 rounded-md hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search (cmd+K placeholder) */}
              <button className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/50 hover:bg-muted transition-colors text-muted-foreground text-sm min-w-[280px]">
                <Search className="w-4 h-4" />
                <span>Search...</span>
                <kbd className="ml-auto text-[10px] bg-background border border-border rounded px-1.5 py-0.5 font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Bell className="w-4 h-4" />
                    {recentNotifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Recent Activity</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {recentNotifications.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      No recent activity
                    </div>
                  ) : (
                    recentNotifications.map(e => (
                      <div key={e.id} className="px-3 py-2 text-xs border-b border-border last:border-0">
                        <p className="font-medium text-foreground">{e.action.replace(/_/g, " ")}</p>
                        <p className="text-muted-foreground truncate">{e.entity_type} · {e.entity_id}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(e.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-md hover:bg-muted transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                      {userInitial}
                    </div>
                    <span className="text-sm font-medium hidden md:inline">
                      {user?.email?.split("@")[0] || "User"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm font-medium">{user?.email || "Signed in"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{currentStore?.name}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/admin?tab=branding")}>
                    <Settings className="w-3.5 h-3.5 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-3.5 h-3.5 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
