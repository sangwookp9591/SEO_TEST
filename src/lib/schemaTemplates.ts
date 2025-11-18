// Schema.org 템플릿 정의

export interface SchemaTemplate {
  name: string;
  type: string;
  description: string;
  template: object;
}

// Hospital / Medical Organization 템플릿
export const hospitalTemplate: SchemaTemplate = {
  name: '병원 (MedicalOrganization)',
  type: 'MedicalOrganization',
  description: '병원 또는 의료 기관을 위한 구조화 데이터',
  template: {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: '병원 이름',
    description: '병원 설명',
    url: 'https://zivo.travel/hospitals/1',
    logo: 'https://zivo.travel/images/hospital-logo.png',
    image: 'https://zivo.travel/images/hospital-main.jpg',
    telephone: '+82-2-1234-5678',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '강남대로 123',
      addressLocality: '서울',
      addressRegion: '강남구',
      postalCode: '06000',
      addressCountry: 'KR',
    },
    medicalSpecialty: ['성형외과', '피부과', '치과'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '324',
    },
  },
};

// Medical Service 템플릿
export const medicalServiceTemplate: SchemaTemplate = {
  name: '의료 서비스 (MedicalProcedure)',
  type: 'MedicalProcedure',
  description: '특정 의료 시술이나 서비스를 위한 구조화 데이터',
  template: {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: '서비스 이름',
    description: '서비스 설명',
    procedureType: '시술 유형',
    bodyLocation: '시술 부위',
    preparation: '사전 준비 사항',
    followup: '사후 관리',
    howPerformed: '시술 방법',
    offers: {
      '@type': 'Offer',
      price: '1000000',
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
    },
  },
};

// Product 템플릿 (의료 상품)
export const productTemplate: SchemaTemplate = {
  name: '상품 (Product)',
  type: 'Product',
  description: '의료 패키지 상품을 위한 구조화 데이터',
  template: {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '상품 이름',
    description: '상품 설명',
    image: 'https://zivo.travel/images/product.jpg',
    brand: {
      '@type': 'Brand',
      name: '브랜드 이름',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://zivo.travel/services/1',
      priceCurrency: 'KRW',
      price: '1000000',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: '판매자 이름',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '150',
    },
  },
};

// FAQ 템플릿
export const faqTemplate: SchemaTemplate = {
  name: 'FAQ (FAQPage)',
  type: 'FAQPage',
  description: '자주 묻는 질문 페이지를 위한 구조화 데이터',
  template: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '질문 1',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '답변 1',
        },
      },
      {
        '@type': 'Question',
        name: '질문 2',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '답변 2',
        },
      },
    ],
  },
};

// Breadcrumb 템플릿
export const breadcrumbTemplate: SchemaTemplate = {
  name: '빵 부스러기 (BreadcrumbList)',
  type: 'BreadcrumbList',
  description: '페이지 네비게이션 경로를 위한 구조화 데이터',
  template: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://zivo.travel',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '병원',
        item: 'https://zivo.travel/hospitals',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '병원 상세',
      },
    ],
  },
};

// 모든 템플릿 목록
export const schemaTemplates: SchemaTemplate[] = [
  hospitalTemplate,
  medicalServiceTemplate,
  productTemplate,
  faqTemplate,
  breadcrumbTemplate,
];

// 템플릿을 타입별로 찾기
export const getTemplateByType = (type: string): SchemaTemplate | undefined => {
  return schemaTemplates.find(t => t.type === type);
};

// 템플릿을 JSON 문자열로 변환 (pretty print)
export const templateToJson = (template: object): string => {
  return JSON.stringify(template, null, 2);
};
