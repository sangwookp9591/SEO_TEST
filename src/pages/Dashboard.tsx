import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { metaTagsApi } from '../api/metaTags';
import { schemasApi } from '../api/schemas';

export default function Dashboard() {
  const { data: metaTags } = useQuery({
    queryKey: ['metaTags'],
    queryFn: () => metaTagsApi.getAll(),
  });

  const { data: schemas } = useQuery({
    queryKey: ['schemas'],
    queryFn: () => schemasApi.getAll(),
  });

  const metaTagsCount = metaTags?.length || 0;
  const schemasCount = schemas?.length || 0;
  const sitemapCount = metaTags?.filter(tag => tag.isActive).length || 0;

  // 간단한 SEO 점수 계산 (메타 태그 + 스키마 비율)
  const calculateSeoScore = () => {
    if (metaTagsCount === 0) return 0;
    const metaScore = Math.min((metaTagsCount / 10) * 50, 50); // 최대 50점
    const schemaScore = Math.min((schemasCount / 10) * 50, 50); // 최대 50점
    return Math.round(metaScore + schemaScore);
  };

  const seoScore = calculateSeoScore();

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">메타 태그</div>
          <div className="stat-value">{metaTagsCount}</div>
          <div className={`stat-change ${metaTagsCount > 0 ? 'positive' : 'neutral'}`}>
            {metaTagsCount > 0 ? `${metaTagsCount}개 페이지` : '설정 대기'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">구조화 데이터</div>
          <div className="stat-value">{schemasCount}</div>
          <div className={`stat-change ${schemasCount > 0 ? 'positive' : 'neutral'}`}>
            {schemasCount > 0 ? `${schemasCount}개 스키마` : '설정 대기'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sitemap 항목</div>
          <div className="stat-value">{sitemapCount}</div>
          <div className={`stat-change ${sitemapCount > 0 ? 'positive' : 'neutral'}`}>
            {sitemapCount > 0 ? `${sitemapCount}개 활성` : '설정 대기'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">SEO 점수</div>
          <div className="stat-value">{seoScore}</div>
          <div className={`stat-change ${seoScore >= 70 ? 'positive' : seoScore >= 40 ? 'neutral' : 'neutral'}`}>
            {seoScore >= 70 ? '우수' : seoScore >= 40 ? '보통' : '개선 필요'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
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

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">빠른 액션</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/meta-tags/new" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>add</span>
                메타 태그 추가
              </Link>
              <Link to="/schemas/new" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>code</span>
                스키마 추가
              </Link>
              <Link to="/sitemap" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>map</span>
                Sitemap 관리
              </Link>
              <Link to="/robots" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>smart_toy</span>
                Robots.txt 관리
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
