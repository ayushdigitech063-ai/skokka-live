/**
 * TypeScript Definitions for Location Management Module (Phase 1.1)
 * Hierarchy: State -> City -> Area
 */

export interface IState {
  _id: string;
  name: string;
  code?: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  cities?: ICity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICity {
  _id: string;
  name: string;
  stateId: string | IState;
  slug: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  areas?: IArea[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IArea {
  _id: string;
  name: string;
  cityId: string | ICity;
  stateId: string | IState;
  pincode?: string;
  slug: string;
  isPopular: boolean;
  isActive: boolean;
  isDeleted: boolean;
  sortOrder: number;
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
  isActive?: boolean;
}

export interface UpdateCityInput extends Partial<CreateCityInput> {}

export interface CreateAreaInput {
  name: string;
  cityId: string;
  pincode?: string;
  isPopular?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateAreaInput extends Partial<CreateAreaInput> {}
