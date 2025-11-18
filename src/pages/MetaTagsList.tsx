import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { metaTagsApi } from '../api/metaTags';
import type { SeoMetaTag } from '../types/seo';

export default function MetaTagsList() {
  const queryClient = useQueryClient();

  const { data: metaTags, isLoading, error } = useQuery({
    queryKey: ['metaTags'],
    queryFn: () => metaTagsApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => metaTagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metaTags'] });
      alert('메타 태그가 삭제되었습니다.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`삭제 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (confirm(`"${title}" 메타 태그를 삭제하시겠습니까?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <p style={{ color: '#EF4444' }}>
            오류: {error instanceof Error ? error.message : '데이터를 불러올 수 없습니다'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>메타 태그 관리</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
            페이지별 SEO 메타 태그를 설정하세요
          </p>
        </div>
        <Link to="/meta-tags/new" className="btn btn-primary">
          <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>add</span>
          메타 태그 추가
        </Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>페이지 타입</th>
                <th>URL 경로</th>
                <th>언어</th>
                <th>제목</th>
                <th>설명</th>
                <th>상태</th>
                <th style={{ width: '150px' }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {metaTags && metaTags.length > 0 ? (
                metaTags.map((tag: SeoMetaTag) => (
                  <tr key={tag.id}>
                    <td>
                      <span className="badge badge-primary">{tag.pageType}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{tag.urlPath}</td>
                    <td>
                      <code style={{
                        backgroundColor: '#F3F4F6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {tag.locale || 'ko'}
                      </code>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tag.title || '-'}
                    </td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tag.description || '-'}
                    </td>
                    <td>
                      {tag.isActive ? (
                        <span className="badge badge-success">활성</span>
                      ) : (
                        <span className="badge badge-error">비활성</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/meta-tags/${tag.id}/edit`}
                          className="btn btn-sm btn-ghost"
                          title="수정"
                        >
                          <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(tag.id!, tag.title || tag.urlPath)}
                          className="btn btn-sm btn-ghost"
                          title="삭제"
                          disabled={deleteMutation.isPending}
                        >
                          <span className="material-icons" style={{ fontSize: '18px', color: '#EF4444' }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    <span className="material-icons" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.3 }}>
                      inbox
                    </span>
                    메타 태그가 없습니다. 새로운 메타 태그를 추가하세요.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
