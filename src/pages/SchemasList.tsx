import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { schemasApi } from '../api/schemas';
import type { SeoSchema } from '../types/seo';

export default function SchemasList() {
  const queryClient = useQueryClient();

  const { data: schemas, isLoading, error } = useQuery({
    queryKey: ['schemas'],
    queryFn: () => schemasApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => schemasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      alert('스키마가 삭제되었습니다.');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`삭제 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleDelete = (id: number, schemaType: string) => {
    if (confirm(`"${schemaType}" 스키마를 삭제하시겠습니까?`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatJson = (jsonString: string) => {
    try {
      const obj = JSON.parse(jsonString);
      return JSON.stringify(obj, null, 2);
    } catch {
      return jsonString;
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
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>구조화 데이터 관리</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
            Schema.org JSON-LD 구조화 데이터를 설정하세요
          </p>
        </div>
        <Link to="/schemas/new" className="btn btn-primary">
          <span className="material-icons" style={{ fontSize: '18px', marginRight: '4px' }}>add</span>
          스키마 추가
        </Link>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>페이지 타입</th>
                <th>URL 경로</th>
                <th>스키마 타입</th>
                <th>JSON 미리보기</th>
                <th>상태</th>
                <th style={{ width: '150px' }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {schemas && schemas.length > 0 ? (
                schemas.map((schema: SeoSchema) => (
                  <tr key={schema.id}>
                    <td>
                      <span className="badge badge-primary">{schema.pageType}</span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{schema.urlPath}</td>
                    <td>
                      <code style={{
                        backgroundColor: '#F3F4F6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        {schema.schemaType}
                      </code>
                    </td>
                    <td>
                      <details style={{ cursor: 'pointer' }}>
                        <summary style={{ fontSize: '13px', color: '#6B7280' }}>
                          JSON 보기
                        </summary>
                        <pre style={{
                          marginTop: '8px',
                          padding: '12px',
                          backgroundColor: '#1F2937',
                          color: '#F9FAFB',
                          borderRadius: '6px',
                          fontSize: '11px',
                          overflow: 'auto',
                          maxHeight: '300px',
                          maxWidth: '400px'
                        }}>
                          {formatJson(schema.schemaJson || '{}')}
                        </pre>
                      </details>
                    </td>
                    <td>
                      {schema.isActive ? (
                        <span className="badge badge-success">활성</span>
                      ) : (
                        <span className="badge badge-error">비활성</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          to={`/schemas/${schema.id}/edit`}
                          className="btn btn-sm btn-ghost"
                          title="수정"
                        >
                          <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(schema.id!, schema.schemaType || '')}
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
                    <span className="material-icons" style={{ fontSize: '48px', display: 'block', marginBottom: '16px', opacity: 0.3 }}>
                      code
                    </span>
                    구조화 데이터가 없습니다. 새로운 스키마를 추가하세요.
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
