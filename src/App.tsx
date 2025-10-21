import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import QAReports from "./pages/QAReports";
import QARequest from "./pages/QARequest";
import QACenterMap from "./pages/QACenterMap";
import MarketPrices from "./pages/MarketPrices";
import Orders from "./pages/Orders";
import Knowledge from "./pages/Knowledge";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/qa-reports" element={<QAReports />} />
          <Route path="/qa-request" element={<QARequest />} />
          <Route path="/qa-center-map" element={<QACenterMap />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


