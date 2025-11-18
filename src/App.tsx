import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MetaTagsList from './pages/MetaTagsList';
import MetaTagForm from './pages/MetaTagForm';
import SchemasList from './pages/SchemasList';
import SchemaForm from './pages/SchemaForm';
import SitemapManager from './pages/SitemapManager';
import RobotsManager from './pages/RobotsManager';
import './admin-design-system.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meta-tags" element={<MetaTagsList />} />
            <Route path="/meta-tags/new" element={<MetaTagForm />} />
            <Route path="/meta-tags/:id/edit" element={<MetaTagForm />} />
            <Route path="/schemas" element={<SchemasList />} />
            <Route path="/schemas/new" element={<SchemaForm />} />
            <Route path="/schemas/:id/edit" element={<SchemaForm />} />
            <Route path="/sitemap" element={<SitemapManager />} />
            <Route path="/robots" element={<RobotsManager />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
