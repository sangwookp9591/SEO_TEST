import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { schemasApi } from '../api/schemas';
import type { SeoSchema } from '../types/seo';
import { schemaTemplates, templateToJson, getTemplateByType } from '../lib/schemaTemplates';

export default function SchemaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SeoSchema>();
  const [jsonError, setJsonError] = useState<string>('');

  // 수정 모드일 때 기존 데이터 조회
  const { data: existingSchema } = useQuery({
    queryKey: ['schema', id],
    queryFn: () => schemasApi.getById(Number(id)),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingSchema) {
      reset(existingSchema);
    }
  }, [existingSchema, reset]);

  const createMutation = useMutation({
    mutationFn: (data: SeoSchema) => schemasApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      alert('스키마가 생성되었습니다.');
      navigate('/schemas');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`생성 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SeoSchema) => schemasApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] });
      queryClient.invalidateQueries({ queryKey: ['schema', id] });
      alert('스키마가 수정되었습니다.');
      navigate('/schemas');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`수정 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = (data: SeoSchema) => {
    // JSON 유효성 검사
    if (data.schemaJson) {
      try {
        JSON.parse(data.schemaJson);
        setJsonError('');
      } catch {
        setJsonError('유효하지 않은 JSON 형식입니다.');
        return;
      }
    }

    const payload = {
      ...data,
      createdBy: isEditMode ? existingSchema?.createdBy : 'admin',
      updatedBy: 'admin',
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  // 템플릿 선택 시 JSON 자동 채우기
  const handleTemplateSelect = (templateType: string) => {
    const template = getTemplateByType(templateType);
    if (template) {
      const jsonString = templateToJson(template.template);
      setValue('schemaJson', jsonString);
      setValue('schemaType', template.type);
      setJsonError('');
    }
  };

  // JSON 포맷팅
  const handleFormatJson = () => {
    const currentJson = watch('schemaJson');
    if (currentJson) {
      try {
        const formatted = templateToJson(JSON.parse(currentJson));
        setValue('schemaJson', formatted);
        setJsonError('');
      } catch {
        setJsonError('유효하지 않은 JSON 형식입니다.');
      }
    }
  };

  const schemaJson = watch('schemaJson');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          {isEditMode ? '스키마 수정' : '스키마 추가'}
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
          Schema.org 구조화 데이터를 설정하세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 왼쪽: 기본 정보 + JSON 에디터 */}
          <div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">기본 정보</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">페이지 타입 *</label>
                  <select {...register('pageType', { required: true })} className="form-input">
                    <option value="">선택하세요</option>
                    <option value="hospital">병원</option>
                    <option value="service">서비스</option>
                    <option value="search">검색</option>
                  </select>
                  {errors.pageType && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">엔티티 ID</label>
                  <input
                    type="number"
                    {...register('entityId', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="1"
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    병원 ID 또는 서비스 ID (전역 페이지는 비워두세요)
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">URL 경로 *</label>
                  <input
                    type="text"
                    {...register('urlPath', { required: true })}
                    className="form-input"
                    placeholder="/hospitals/1"
                  />
                  {errors.urlPath && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">언어 (Locale) *</label>
                  <select {...register('locale', { required: true })} className="form-input" defaultValue="ko">
                    <option value="ko">한국어 (ko)</option>
                    <option value="en">English (en)</option>
                    <option value="ja">日本語 (ja)</option>
                    <option value="zh-CN">简体中文 (zh-CN)</option>
                    <option value="zh-TW">繁體中文 (zh-TW)</option>
                    <option value="zh-HK">繁體中文-香港 (zh-HK)</option>
                  </select>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    동일한 URL 경로에 대해 다국어 스키마를 설정할 수 있습니다
                  </p>
                  {errors.locale && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">스키마 타입 *</label>
                  <input
                    type="text"
                    {...register('schemaType', { required: true })}
                    className="form-input"
                    placeholder="MedicalOrganization"
                  />
                  {errors.schemaType && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      defaultChecked={true}
                    />
                    <span>활성화</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <h3 className="card-title">JSON-LD 스키마 *</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="btn btn-sm btn-outline"
                  >
                    포맷 정리
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <textarea
                    {...register('schemaJson', { required: true })}
                    className="form-input"
                    rows={20}
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      backgroundColor: '#1F2937',
                      color: '#F9FAFB',
                      padding: '12px'
                    }}
                    placeholder='{"@context": "https://schema.org", "@type": "...", ...}'
                  />
                  {errors.schemaJson && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                  {jsonError && <span style={{ color: '#EF4444', fontSize: '12px', display: 'block', marginTop: '4px' }}>{jsonError}</span>}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/schemas')}
                className="btn btn-outline"
              >
                취소
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {isEditMode ? '수정' : '생성'}
              </button>
            </div>
          </div>

          {/* 오른쪽: 템플릿 선택 + JSON 미리보기 */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '24px' }}>
              <div className="card-header">
                <h3 className="card-title">스키마 템플릿</h3>
                <p className="card-subtitle">템플릿을 선택하여 빠르게 시작하세요</p>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gap: '12px' }}>
                  {schemaTemplates.map((template) => (
                    <div
                      key={template.type}
                      onClick={() => handleTemplateSelect(template.type)}
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
                      <code style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '2px 6px',
                        backgroundColor: '#F3F4F6',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 500
                      }}>
                        {template.type}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {schemaJson && (
              <div className="card" style={{ marginTop: '16px', position: 'sticky', top: 'calc(24px + 500px)' }}>
                <div className="card-header">
                  <h3 className="card-title">JSON 미리보기</h3>
                </div>
                <div className="card-body">
                  <pre style={{
                    padding: '12px',
                    backgroundColor: '#1F2937',
                    color: '#F9FAFB',
                    borderRadius: '6px',
                    fontSize: '11px',
                    overflow: 'auto',
                    maxHeight: '400px',
                    margin: 0
                  }}>
                    {schemaJson}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
