import apiClient from './client';
import type { SeoMetaTag, ApiResponse } from '../types/seo';

/**
 * SEO 메타 태그 API
 */
export const metaTagsApi = {
  /**
   * 메타 태그 목록 조회
   */
  getAll: async (pageType?: string): Promise<SeoMetaTag[]> => {
    const params = pageType ? { pageType } : {};
    const response = await apiClient.get<SeoMetaTag[]>('/api/seo/meta-tags', { params });
    return response.data;
  },

  /**
   * 메타 태그 상세 조회
   */
  getById: async (id: number): Promise<SeoMetaTag> => {
    const response = await apiClient.get<SeoMetaTag>(`/api/seo/meta-tags/${id}`);
    return response.data;
  },

  /**
   * 메타 태그 생성
   */
  create: async (data: SeoMetaTag): Promise<ApiResponse<SeoMetaTag>> => {
    const response = await apiClient.post<ApiResponse<SeoMetaTag>>('/api/seo/meta-tags', data);
    return response.data;
  },

  /**
   * 메타 태그 수정
   */
  update: async (id: number, data: SeoMetaTag): Promise<ApiResponse<SeoMetaTag>> => {
    const response = await apiClient.put<ApiResponse<SeoMetaTag>>(`/api/seo/meta-tags/${id}`, data);
    return response.data;
  },

  /**
   * 메타 태그 삭제
   */
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/api/seo/meta-tags/${id}`);
    return response.data;
  },
};
