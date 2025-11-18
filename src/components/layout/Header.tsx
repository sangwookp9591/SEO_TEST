export default function Header() {
  return (
    <header className="main-header">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>SEO 관리</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
            ZIVO 플랫폼의 검색 엔진 최적화를 관리합니다
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6B7280' }}>관리자</span>
        </div>
      </div>
    </header>
  );
}
