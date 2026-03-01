import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Conversation from "./pages/Conversation";
import KnowledgeBase from "./pages/KnowledgeBase";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

/**
 * TicketStream App Router
 * Design: Gradient Elegance - Modern helpdesk SaaS interface
 * Layout: Sidebar + TopBar + Content + Footer
 */
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Dashboard} />
        <Route path={"/tickets"} component={Tickets} />
        <Route path={"/tickets/:id"} component={Conversation} />
        <Route path={"/chat"} component={Chat} />
        <Route path={"/knowledge-base"} component={KnowledgeBase} />
        <Route path={"/settings"} component={Settings} />
      </Switch>
      <Footer />
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
