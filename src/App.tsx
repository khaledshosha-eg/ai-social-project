import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// استدعاء الصفحات
import Index from "./pages/Index"; 
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          {/* تم حذف التوجل الخارجي لعدم التكرار مع تصميم الهوم بيج */}
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              {/* الصفحة الرئيسية: التصميم الزجاجي الاحترافي */}
              <Route path="/" element={<Index />} />
              
              {/* المسارات الأخرى */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/results" element={<ResultsPage />} />
              
              {/* صفحة الخطأ 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;