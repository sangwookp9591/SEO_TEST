export default function Dashboard() {
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">메타 태그</div>
          <div className="stat-value">-</div>
          <div className="stat-change neutral">설정 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">구조화 데이터</div>
          <div className="stat-value">-</div>
          <div className="stat-change neutral">설정 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sitemap 항목</div>
          <div className="stat-value">-</div>
          <div className="stat-change neutral">설정 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">SEO 점수</div>
          <div className="stat-value">-</div>
          <div className="stat-change neutral">설정 대기</div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">SEO 관리 시작하기</h3>
            <p className="card-subtitle">ZIVO 플랫폼의 검색 엔진 최적화를 설정하세요</p>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-icons" style={{ color: '#1A5DF7' }}>check_circle</span>
                <span>메타 태그를 설정하여 검색 결과 노출을 최적화하세요</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-icons" style={{ color: '#1A5DF7' }}>check_circle</span>
                <span>Schema.org 구조화 데이터로 Rich Results를 활성화하세요</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-icons" style={{ color: '#1A5DF7' }}>check_circle</span>
                <span>Sitemap을 생성하여 검색 엔진 크롤링을 개선하세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
