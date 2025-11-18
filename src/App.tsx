import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import MetaTagsList from './pages/MetaTagsList';
import MetaTagForm from './pages/MetaTagForm';
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
            <Route path="/schemas" element={<div className="card"><div className="card-body">구조화 데이터 페이지 (개발 예정)</div></div>} />
            <Route path="/sitemap" element={<div className="card"><div className="card-body">Sitemap 페이지 (개발 예정)</div></div>} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
