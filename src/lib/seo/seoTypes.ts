/**
 * SEO Engine TypeScript Interfaces & Types
 */

export interface IDBSEOOverride {
  metaTitle?: string;
  metaDescription?: string;
  shortDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface ISEOData {
  title: string;
  description: string;
  shortDescription: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: 'website' | 'article' | 'profile';
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
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
