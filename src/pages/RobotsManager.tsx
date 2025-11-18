import { useState } from 'react';
import {
  robotsTemplates,
  generateDefaultRobots,
  validateRobotsTxt,
  type RobotsValidationResult,
} from '../lib/robotsTemplate';

export default function RobotsManager() {
  // 초기 로드 시 기본 템플릿 설정 (lazy initialization)
  const [robotsContent, setRobotsContent] = useState<string>(() => generateDefaultRobots());
  const [validation, setValidation] = useState<RobotsValidationResult | null>(() => {
    const defaultContent = generateDefaultRobots();
    return validateRobotsTxt(defaultContent);
  });
  const [showPreview, setShowPreview] = useState(false);

  // 템플릿 선택
  const handleTemplateSelect = (templateContent: string) => {
    setRobotsContent(templateContent);
    setValidation(validateRobotsTxt(templateContent));
  };

  // 내용 변경
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setRobotsContent(newContent);
    setValidation(validateRobotsTxt(newContent));
  };

  // 유효성 검증 실행
  const handleValidate = () => {
    const result = validateRobotsTxt(robotsContent);
    setValidation(result);
    if (result.isValid) {
      alert('✅ Robots.txt 파일이 유효합니다!');
    } else {
      alert(`❌ ${result.errors.length}개의 오류가 발견되었습니다.`);
    }
  };

  // 파일 다운로드
  const handleDownload = () => {
    const blob = new Blob([robotsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 클립보드 복사
  const handleCopy = () => {
    navigator.clipboard.writeText(robotsContent);
    alert('Robots.txt 내용이 클립보드에 복사되었습니다.');
  };

  // 기본값으로 초기화
  const handleReset = () => {
    if (confirm('현재 내용을 삭제하고 기본 템플릿으로 초기화하시겠습니까?')) {
      const defaultContent = generateDefaultRobots();
      setRobotsContent(defaultContent);
      setValidation(validateRobotsTxt(defaultContent));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Robots.txt 관리</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
          검색 엔진 크롤러의 접근 규칙을 설정하세요
        </p>
      </div>

      {/* 유효성 검증 결과 */}
      {validation && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span
                className="material-icons"
                style={{
                  fontSize: '24px',
                  color: validation.isValid ? '#10B981' : '#EF4444',
                }}
              >
                {validation.isValid ? 'check_circle' : 'error'}
              </span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                {validation.isValid ? '유효한 Robots.txt 파일입니다' : `${validation.errors.length}개의 오류 발견`}
              </span>
            </div>

            {/* 오류 목록 */}
            {validation.errors.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#EF4444' }}>
                  오류:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6B7280' }}>
                  {validation.errors.map((error, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 경고 목록 */}
            {validation.warnings.length > 0 && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#F59E0B' }}>
                  경고:
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#6B7280' }}>
                  {validation.warnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 왼쪽: 에디터 */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Robots.txt 편집</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleValidate} className="btn btn-sm btn-outline">
                  <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>
                    verified
                  </span>
                  유효성 검증
                </button>
                <button onClick={handleReset} className="btn btn-sm btn-outline">
                  <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>
                    refresh
                  </span>
                  초기화
                </button>
              </div>
            </div>
            <div className="card-body">
              <textarea
                value={robotsContent}
                onChange={handleContentChange}
                className="form-input"
                rows={20}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre',
                  resize: 'vertical',
                }}
                placeholder="User-agent: *&#10;Allow: /&#10;&#10;Sitemap: https://zivo.travel/sitemap.xml"
              />
              <div style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#FEF3C7',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#92400E',
              }}>
                <span className="material-icons" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>
                  info
                </span>
                robots.txt 파일은 서버의 public 폴더 루트에 배치해야 합니다.
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="card" style={{ marginTop: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">파일 내보내기</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCopy} className="btn btn-outline" style={{ flex: 1 }}>
                  <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>
                    content_copy
                  </span>
                  클립보드 복사
                </button>
                <button onClick={handleDownload} className="btn btn-primary" style={{ flex: 1 }}>
                  <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>
                    download
                  </span>
                  다운로드
                </button>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                robots.txt URL: <code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                  https://zivo.travel/robots.txt
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 템플릿 선택 */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">템플릿 선택</h3>
              <p className="card-subtitle">템플릿을 선택하여 빠르게 시작하세요</p>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: '12px' }}>
                {robotsTemplates.map((template, index) => (
                  <div
                    key={index}
                    onClick={() => handleTemplateSelect(template.content)}
                    style={{
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1A5DF7';
                      e.currentTarget.style.backgroundColor = '#F3F6FE';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>
                      {template.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          {showPreview && robotsContent && (
            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <h3 className="card-title">미리보기</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn btn-sm btn-ghost"
                  title="닫기"
                >
                  <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
                </button>
              </div>
              <div className="card-body">
                <pre style={{
                  padding: '12px',
                  backgroundColor: '#1F2937',
                  color: '#F9FAFB',
                  borderRadius: '6px',
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  margin: 0,
                  lineHeight: '1.6',
                }}>
                  {robotsContent}
                </pre>
              </div>
            </div>
          )}

          {!showPreview && (
            <button
              onClick={() => setShowPreview(true)}
              className="btn btn-outline"
              style={{ width: '100%', marginTop: '16px' }}
            >
              <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>
                visibility
              </span>
              미리보기
            </button>
          )}

          {/* 가이드 */}
          <div className="card" style={{ marginTop: '16px' }}>
            <div className="card-header">
              <h3 className="card-title">Robots.txt 가이드</h3>
            </div>
            <div className="card-body">
              <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>주요 지시어:</p>
                <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      User-agent
                    </code>: 크롤러 지정
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Allow
                    </code>: 크롤링 허용
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Disallow
                    </code>: 크롤링 차단
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Sitemap
                    </code>: 사이트맵 위치
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Crawl-delay
                    </code>: 크롤링 간격(초)
                  </li>
                </ul>
                <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>주요 크롤러:</p>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Googlebot
                    </code>: Google
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Bingbot
                    </code>: Bing
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      Yeti
                    </code>: Naver
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <code style={{ backgroundColor: '#F3F4F6', padding: '2px 4px', borderRadius: '3px' }}>
                      *
                    </code>: 모든 크롤러
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
