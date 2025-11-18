import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          ZIVO SEO
        </Link>
      </div>
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="material-icons sidebar-nav-icon">dashboard</span>
          <span>대시보드</span>
        </Link>
        <Link
          to="/meta-tags"
          className={`sidebar-nav-item ${isActive('/meta-tags') ? 'active' : ''}`}
        >
          <span className="material-icons sidebar-nav-icon">description</span>
          <span>메타 태그</span>
        </Link>
        <Link
          to="/schemas"
          className={`sidebar-nav-item ${isActive('/schemas') ? 'active' : ''}`}
        >
          <span className="material-icons sidebar-nav-icon">code</span>
          <span>구조화 데이터</span>
        </Link>
        <Link
          to="/sitemap"
          className={`sidebar-nav-item ${isActive('/sitemap') ? 'active' : ''}`}
        >
          <span className="material-icons sidebar-nav-icon">map</span>
          <span>Sitemap</span>
        </Link>
      </nav>
    </aside>
  );
}
