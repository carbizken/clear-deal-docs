import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DealerSettingsProvider } from "@/contexts/DealerSettingsContext";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuditProvider } from "@/contexts/AuditContext";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import SavedAddendums from "./pages/SavedAddendums.tsx";
import BuyersGuide from "./pages/BuyersGuide.tsx";
import NotFound from "./pages/NotFound.tsx";
import MobileSigning from "./pages/MobileSigning.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <TenantProvider>
          <DealerSettingsProvider>
            <AuditProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/saved" element={<SavedAddendums />} />
                  <Route path="/buyers-guide" element={<BuyersGuide />} />
                  <Route path="/sign/:token" element={<MobileSigning />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuditProvider>
          </DealerSettingsProvider>
        </TenantProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
