import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="main-body">
          {children}
        </div>
      </main>
    </div>
  );
}
