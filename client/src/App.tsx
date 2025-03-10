import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SubmitGroup from "@/pages/SubmitGroup";
import GroupDetail from "@/pages/GroupDetail";
import About from "@/pages/About";
import Layout from "@/components/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/submit" component={SubmitGroup}/>
      <Route path="/about" component={About}/>
      <Route path="/group/:id/:slug?" component={GroupDetail}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
