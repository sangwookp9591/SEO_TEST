/**
 * SEO 관리 TypeScript 타입 정의
 */

export interface SeoMetaTag {
  id?: number;
  pageType: string;
  entityId?: number;
  urlPath: string;
  locale?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  sitemapPriority?: number;
  sitemapChangefreq?: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeoSchema {
  id?: number;
  pageType: string;
  entityId?: number;
  urlPath: string;
  locale?: string;
  schemaType: string;
  schemaJson: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
}
