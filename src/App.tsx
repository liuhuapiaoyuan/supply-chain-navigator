import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import QuickQuery from "./pages/QuickQuery";
import Simulation from "./pages/Simulation";
import SupplyChain from "./pages/SupplyChain";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";
import ProductSetup from "./pages/ProductSetup";
import Forecast from "./pages/Forecast";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/query" element={<QuickQuery />} />
            <Route path="/simulation" element={<Simulation />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/product-setup" element={<ProductSetup />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
