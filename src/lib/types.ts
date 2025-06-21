// API configuration and types
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

// Strapi response types
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T;
}

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

// Content type interfaces
export interface TravelPackage {
  id?: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  rating?: number;
  featured?: boolean;
  cover_image?: {
    url: string;
    alternativeText?: string;
  };
}

export interface VisaService {
  country: string;
  type: string;
  price: number;
  processing_time: string;
  requirements: string;
}

export interface ESIMProduct {
  country: string;
  data_amount: string;
  validity: string;
  price: number;
  provider: string;
}

export interface ApplicationSubmission {
  id?: number;
  type: string;
  status: string;
  tracking_id: string;
  data: any;
  created_at: string;
  updated_at: string;
}


