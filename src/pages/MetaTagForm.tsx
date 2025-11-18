import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { metaTagsApi } from '../api/metaTags';
import type { SeoMetaTag } from '../types/seo';

export default function MetaTagForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SeoMetaTag>();

  // 수정 모드일 때 기존 데이터 조회
  const { data: existingTag } = useQuery({
    queryKey: ['metaTag', id],
    queryFn: () => metaTagsApi.getById(Number(id)),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (existingTag) {
      reset(existingTag);
    }
  }, [existingTag, reset]);

  const createMutation = useMutation({
    mutationFn: (data: SeoMetaTag) => metaTagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metaTags'] });
      alert('메타 태그가 생성되었습니다.');
      navigate('/meta-tags');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`생성 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: SeoMetaTag) => metaTagsApi.update(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metaTags'] });
      queryClient.invalidateQueries({ queryKey: ['metaTag', id] });
      alert('메타 태그가 수정되었습니다.');
      navigate('/meta-tags');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      alert(`수정 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  const onSubmit = (data: SeoMetaTag) => {
    const payload = {
      ...data,
      createdBy: isEditMode ? existingTag?.createdBy : 'admin',
      updatedBy: 'admin',
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const title = watch('title');
  const description = watch('description');

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
          {isEditMode ? '메타 태그 수정' : '메타 태그 추가'}
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
          페이지의 SEO 메타 태그를 설정하세요
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* 왼쪽: 폼 */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                    동일한 URL 경로에 대해 다국어 메타 태그를 설정할 수 있습니다
                  </p>
                  {errors.locale && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다</span>}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <h3 className="card-title">메타 태그</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">제목 (Title) *</label>
                  <input
                    type="text"
                    {...register('title', { required: true, maxLength: 60 })}
                    className="form-input"
                    placeholder="서울 메디컬 센터 | 고급 의료 서비스 | ZIVO"
                    maxLength={60}
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    {title?.length || 0} / 60자 (권장: 50-60자)
                  </p>
                  {errors.title && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다 (최대 60자)</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">설명 (Description) *</label>
                  <textarea
                    {...register('description', { required: true, maxLength: 160 })}
                    className="form-input"
                    rows={3}
                    placeholder="서울 메디컬 센터는 성형외과, 피부과, 치과 전문 종합병원입니다."
                    maxLength={160}
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    {description?.length || 0} / 160자 (권장: 120-160자)
                  </p>
                  {errors.description && <span style={{ color: '#EF4444', fontSize: '12px' }}>필수 항목입니다 (최대 160자)</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">키워드 (Keywords)</label>
                  <input
                    type="text"
                    {...register('keywords')}
                    className="form-input"
                    placeholder="성형외과, 피부과, 치과, 의료관광"
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    쉼표로 구분하여 입력하세요
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <h3 className="card-title">Open Graph (SNS 공유)</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">OG 제목</label>
                  <input
                    type="text"
                    {...register('ogTitle')}
                    className="form-input"
                    placeholder="제목을 입력하지 않으면 메타 제목이 사용됩니다"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">OG 설명</label>
                  <textarea
                    {...register('ogDescription')}
                    className="form-input"
                    rows={2}
                    placeholder="설명을 입력하지 않으면 메타 설명이 사용됩니다"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">OG 이미지 URL</label>
                  <input
                    type="url"
                    {...register('ogImage')}
                    className="form-input"
                    placeholder="https://zivo.travel/images/hospital-og.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '16px' }}>
              <div className="card-header">
                <h3 className="card-title">Sitemap 설정</h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">우선순위 (Priority)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    {...register('sitemapPriority', { valueAsNumber: true })}
                    className="form-input"
                    placeholder="0.5"
                  />
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                    0.0 ~ 1.0 (기본값: 0.5)
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">변경 빈도 (Change Frequency)</label>
                  <select {...register('sitemapChangefreq')} className="form-input">
                    <option value="weekly">Weekly (주간)</option>
                    <option value="daily">Daily (일간)</option>
                    <option value="monthly">Monthly (월간)</option>
                    <option value="always">Always (항상)</option>
                    <option value="hourly">Hourly (시간)</option>
                    <option value="yearly">Yearly (연간)</option>
                    <option value="never">Never (없음)</option>
                  </select>
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

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate('/meta-tags')}
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
          </form>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">미리보기</h3>
              <p className="card-subtitle">구글 검색 결과</p>
            </div>
            <div className="card-body">
              <div style={{
                padding: '16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{
                  fontSize: '20px',
                  color: '#1A0DAB',
                  marginBottom: '4px',
                  fontWeight: 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {title || '제목을 입력하세요'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#5F6368',
                  marginBottom: '4px'
                }}>
                  https://zivo.travel{watch('urlPath') || '/'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4D5156',
                  lineHeight: '1.5',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {description || '설명을 입력하세요'}
                </div>
              </div>

              {title && title.length > 60 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#92400E'
                }}>
                  ⚠️ 제목이 60자를 초과합니다. 검색 결과에서 잘릴 수 있습니다.
                </div>
              )}

              {description && description.length > 160 && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#FEF3C7',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#92400E'
                }}>
                  ⚠️ 설명이 160자를 초과합니다. 검색 결과에서 잘릴 수 있습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
