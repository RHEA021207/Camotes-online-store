import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "./components/public-layout";
import { AdminLayout } from "./components/admin-layout";

import Home from "./pages/home";
import Services from "./pages/services";
import Lookup from "./pages/lookup";
import Timeline from "./pages/timeline";
import AdminLogin from "./pages/admin/login";
import Dashboard from "./pages/admin/dashboard";
import CustomersList from "./pages/admin/customers/index";
import CustomerDetail from "./pages/admin/customers/detail";
import ServicesList from "./pages/admin/services/index";
import Settings from "./pages/admin/settings";
import Calculator from "./pages/admin/calculator";
import DailyReport from "./pages/admin/daily-report";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/services">
        <PublicLayout><Services /></PublicLayout>
      </Route>
      <Route path="/lookup">
        <PublicLayout><Lookup /></PublicLayout>
      </Route>
      <Route path="/timeline/:id">
        {params => <PublicLayout><Timeline id={params.id} /></PublicLayout>}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login">
        <AdminLogin />
      </Route>
      
      {/* Protected Admin Routes */}
      <Route path="/admin">
        <AdminLayout><Dashboard /></AdminLayout>
      </Route>
      <Route path="/admin/customers">
        <AdminLayout><CustomersList /></AdminLayout>
      </Route>
      <Route path="/admin/customers/:id">
        {params => <AdminLayout><CustomerDetail id={params.id} /></AdminLayout>}
      </Route>
      <Route path="/admin/services">
        <AdminLayout><ServicesList /></AdminLayout>
      </Route>
      <Route path="/admin/calculator">
        <AdminLayout><Calculator /></AdminLayout>
      </Route>
      <Route path="/admin/daily-report">
        <AdminLayout><DailyReport /></AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout><Settings /></AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
