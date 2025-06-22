// API configuration and types
export const API_URL = import.meta.env.VITE_API_URL || 'https://back.tarimtours.com';

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

// Define the structure for the image object returned by Strapi
export interface StrapiImage {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: any; // You can define this more strictly if needed
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
}

// Content type interfaces
export interface TravelPackage {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  rating?: number;
  featured?: boolean;
  // cover_image is now expected to be an object with a 'data' property
  cover_image?: { data: StrapiEntity<StrapiImage> | null } | null;
}

export interface VisaService {
  country: string;
  type: string;
  price: number;
  processing_time: string;
  requirements: string;
}

export interface ESIMProduct {
  id: number;
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
