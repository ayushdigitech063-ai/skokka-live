/**
 * TypeScript Definitions for Location Management Module (Phase 1.1)
 * Hierarchy: State -> City -> Area
 */

export interface IStateFAQ {
  _id?: string;
  question: string;
  answer: string;
}

export interface IStateSEOData {
  customSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  popularDistricts?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: IStateFAQ[];
  categorySeo?: ICategorySeo[];
}

export interface IState {
  _id: string;
  name: string;
  code?: string;
  slug: string;
  customSlug?: string;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  popularDistricts?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: IStateFAQ[];
  categorySeo?: ICategorySeo[];
  cities?: ICity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategorySeo {
  categorySlug: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  pageContent?: string;
  customSchema?: string;
  faqs?: Array<{ question: string; answer: string; _id?: string }>;
}

export interface ICityFAQ {
  _id?: string;
  question: string;
  answer: string;
}

export interface ICitySEOData {
  customSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  microServiceAreas?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: ICityFAQ[];
  categorySeo?: ICategorySeo[];
}

export interface ICity {
  _id: string;
  name: string;
  stateId: string | IState;
  slug: string;
  customSlug?: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  microServiceAreas?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: ICityFAQ[];
  categorySeo?: ICategorySeo[];
  areas?: IArea[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAreaFAQ {
  _id?: string;
  question: string;
  answer: string;
}

export interface IAreaSEOData {
  customSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  pageContent?: string;
  customSchema?: string;
  faqs?: IAreaFAQ[];
}

export interface IArea {
  _id: string;
  name: string;
  cityId: string | ICity;
  stateId: string | IState;
  pincode?: string;
  slug: string;
  customSlug?: string;
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  pageContent?: string;
  customSchema?: string;
  faqs?: IAreaFAQ[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ILocationTreeState extends IState {
  cities: (ICity & {
    areas: IArea[];
  })[];
}

export interface CreateStateInput {
  name: string;
  code?: string;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  customSlug?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  popularDistricts?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: IStateFAQ[];
  isActive?: boolean;
}

export interface UpdateStateInput extends Partial<CreateStateInput> {}

export interface CreateCityInput {
  name: string;
  stateId: string;
  tier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  isPopular?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  customSlug?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  microServiceAreas?: string[];
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: ICityFAQ[];
  isActive?: boolean;
}

export interface UpdateCityInput extends Partial<CreateCityInput> {}

export interface CreateAreaInput {
  name: string;
  cityId: string;
  pincode?: string;
  isPopular?: boolean;
  sortOrder?: number;
  customSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  pageContent?: string;
  canonicalUrl?: string;
  robots?: string;
  redirectUrl?: string;
  redirectType?: 'none' | '301' | '302';
  customSchema?: string;
  faqs?: IAreaFAQ[];
  isActive?: boolean;
}

export interface UpdateAreaInput extends Partial<CreateAreaInput> {}
