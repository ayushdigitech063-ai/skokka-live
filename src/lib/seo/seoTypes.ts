/**
 * SEO Engine TypeScript Interfaces & Types
 */

export interface IDBSEOOverride {
  metaTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  pageContent?: string;
  customSlug?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  focusKeywords?: string[];
  microServiceAreas?: string[];
  faqs?: { question: string; answer: string }[];
}

export interface ISEOData {
  title: string;
  description: string;
  shortDescription: string;
  canonical: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  pageContent?: string;
  keywords?: string[];
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: 'website' | 'article' | 'profile';
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  faqs?: { question: string; answer: string }[];
  microServiceAreas?: string[];
}

export interface ICitySEOParams {
  cityName: string;
  stateName?: string;
  dbOverride?: IDBSEOOverride;
}

export interface IAreaSEOParams {
  areaName: string;
  cityName: string;
  stateName?: string;
  dbOverride?: IDBSEOOverride;
}

export interface ICategorySEOParams {
  categoryName: string;
  cityName?: string;
  dbOverride?: IDBSEOOverride;
}

export interface IProfileSEOParams {
  name: string;
  cityName?: string;
  areaName?: string;
  cityArea?: string;
  category?: string;
  photoUrl?: string;
  dbOverride?: IDBSEOOverride;
}
