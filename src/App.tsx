
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Logger } from "@/lib/logger";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        Logger.error('ReactQuery', 'Query error', error);
      },
      onSuccess: (data, query) => {
        Logger.success('ReactQuery', `Query success: ${query.queryKey.join('-')}`, {
          dataType: typeof data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : undefined
        });
      }
    },
    mutations: {
      onError: (error, variables, context) => {
        Logger.error('ReactQuery', 'Mutation error', { error, variables, context });
      },
      onSuccess: (data, variables, context) => {
        Logger.success('ReactQuery', 'Mutation success', { data, variables, context });
      }
    }
  }
});

const App = () => {
  Logger.component('App', 'Application starting up');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
