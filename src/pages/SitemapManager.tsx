import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { metaTagsApi } from '../api/metaTags';

export default function SitemapManager() {
  const [showXml, setShowXml] = useState(false);

  const { data: metaTags, isLoading } = useQuery({
    queryKey: ['metaTags'],
    queryFn: () => metaTagsApi.getAll(),
  });

  // Sitemap XML 생성
  const generateSitemapXml = () => {
    if (!metaTags || metaTags.length === 0) {
      return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <!-- 등록된 메타 태그가 없습니다 -->\n</urlset>';
    }

    const baseUrl = 'https://zivo.travel';
    const activeMetaTags = metaTags.filter(tag => tag.isActive);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    activeMetaTags.forEach(tag => {
      const url = tag.canonicalUrl || `${baseUrl}${tag.urlPath}`;
      const priority = tag.sitemapPriority || 0.5;
      const changefreq = tag.sitemapChangefreq || 'weekly';
      const lastmod = tag.updatedAt || tag.createdAt || new Date().toISOString();

      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <lastmod>${lastmod.split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  };

  // Sitemap 다운로드
  const handleDownload = () => {
    const xml = generateSitemapXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sitemap 복사
  const handleCopy = () => {
    const xml = generateSitemapXml();
    navigator.clipboard.writeText(xml);
    alert('Sitemap XML이 클립보드에 복사되었습니다.');
  };

  const sitemapXml = generateSitemapXml();
  const activeCount = metaTags?.filter(tag => tag.isActive).length || 0;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Sitemap 관리</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
          등록된 메타 태그를 기반으로 sitemap.xml을 생성하고 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">전체 페이지</div>
          <div className="stat-value">{metaTags?.length || 0}</div>
          <div className="stat-change neutral">등록된 페이지</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">활성 페이지</div>
          <div className="stat-value">{activeCount}</div>
          <div className="stat-change positive">Sitemap 포함</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">비활성 페이지</div>
          <div className="stat-value">{(metaTags?.length || 0) - activeCount}</div>
          <div className="stat-change neutral">Sitemap 제외</div>
        </div>
      </div>

      {/* Sitemap 액션 */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Sitemap 파일</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowXml(!showXml)} className="btn btn-sm btn-outline">
              {showXml ? 'XML 숨기기' : 'XML 보기'}
            </button>
            <button onClick={handleCopy} className="btn btn-sm btn-outline">
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>content_copy</span>
              복사
            </button>
            <button onClick={handleDownload} className="btn btn-sm btn-primary">
              <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>download</span>
              다운로드
            </button>
          </div>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
              Sitemap URL: <code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                https://zivo.travel/sitemap.xml
              </code>
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#9CA3AF' }}>
              생성된 sitemap.xml 파일을 다운로드하여 서버의 public 폴더에 배치하세요.
            </p>
          </div>

          {showXml && (
            <pre style={{
              padding: '16px',
              backgroundColor: '#1F2937',
              color: '#F9FAFB',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '500px',
              margin: 0
            }}>
              {sitemapXml}
            </pre>
          )}
        </div>
      </div>

      {/* 페이지 목록 */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Sitemap에 포함된 페이지</h3>
          <p className="card-subtitle">{activeCount}개 페이지</p>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>URL</th>
                <th>페이지 타입</th>
                <th>우선순위</th>
                <th>변경 빈도</th>
                <th>최종 수정일</th>
              </tr>
            </thead>
            <tbody>
              {metaTags && metaTags.filter(tag => tag.isActive).length > 0 ? (
                metaTags.filter(tag => tag.isActive).map((tag) => (
                  <tr key={tag.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                      {tag.canonicalUrl || `https://zivo.travel${tag.urlPath}`}
                    </td>
                    <td>
                      <span className="badge badge-primary">{tag.pageType}</span>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: tag.sitemapPriority && tag.sitemapPriority >= 0.8 ? '#DEF7EC' : '#F3F4F6',
                        color: tag.sitemapPriority && tag.sitemapPriority >= 0.8 ? '#03543F' : '#6B7280',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {tag.sitemapPriority?.toFixed(1) || '0.5'}
                      </span>
                    </td>
                    <td>
                      <code style={{
                        backgroundColor: '#F3F4F6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {tag.sitemapChangefreq || 'weekly'}
                      </code>
                    </td>
                    <td style={{ fontSize: '13px', color: '#6B7280' }}>
                      {tag.updatedAt ? new Date(tag.updatedAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    <span className="material-icons" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.3 }}>
                      map
                    </span>
                    활성화된 페이지가 없습니다. 메타 태그를 추가하세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Robots.txt 가이드 */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Robots.txt 설정</h3>
        </div>
        <div className="card-body">
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6B7280' }}>
            robots.txt 파일에 다음 내용을 추가하여 검색 엔진에 sitemap 위치를 알려주세요:
          </p>
          <pre style={{
            padding: '12px',
            backgroundColor: '#F3F4F6',
            borderRadius: '6px',
            fontSize: '13px',
            margin: 0,
            border: '1px solid #E5E7EB'
          }}>
User-agent: *{'\n'}
Allow: /{'\n'}
{'\n'}
Sitemap: https://zivo.travel/sitemap.xml
          </pre>
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#FEF3C7',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#92400E'
          }}>
            <span className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>
              info
            </span>
            robots.txt 파일은 서버의 public 폴더 루트에 배치해야 합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
