import apiClient from './client';
import type { SeoSchema } from '../types/seo';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const schemasApi = {
  // 전체 스키마 목록 조회
  getAll: async (pageType?: string): Promise<SeoSchema[]> => {
    const params = pageType ? { pageType } : undefined;
    const response = await apiClient.get<SeoSchema[]>('/api/seo/schemas', { params });
    return response.data;
  },

  // 특정 스키마 조회
  getById: async (id: number): Promise<SeoSchema> => {
    const response = await apiClient.get<SeoSchema>(`/api/seo/schemas/${id}`);
    return response.data;
  },

  // URL 경로로 스키마 조회
  getByUrlPath: async (urlPath: string): Promise<SeoSchema> => {
    const response = await apiClient.get<SeoSchema>('/api/seo/schemas/by-url', {
      params: { urlPath },
    });
    return response.data;
  },

  // 스키마 생성
  create: async (data: SeoSchema): Promise<ApiResponse<SeoSchema>> => {
    const response = await apiClient.post('/api/seo/schemas', data);
    return response.data;
  },

  // 스키마 수정
  update: async (id: number, data: SeoSchema): Promise<ApiResponse<SeoSchema>> => {
    const response = await apiClient.put(`/api/seo/schemas/${id}`, data);
    return response.data;
  },

  // 스키마 삭제
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/api/seo/schemas/${id}`);
    return response.data;
  },
};
