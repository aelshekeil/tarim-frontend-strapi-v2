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

export interface StrapiUserAttributes {
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StrapiUser = StrapiEntity<StrapiUserAttributes>;

export interface AuthResponse {
  jwt: string;
  user: StrapiUserAttributes; // Note: Strapi's auth/local returns user attributes directly, not an entity
}

// Define the structure for the image object returned by Strapi
export interface StrapiImageAttributes {
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

export type StrapiImage = StrapiEntity<StrapiImageAttributes>;

// Define image formats as seen in TravelPackages.tsx
export interface ImageFormat {
  url: string;
}

export interface CoverImage {
  url: string;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
  };
}

// Content type interfaces (defining only attributes)
export interface TravelPackageAttributes {
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  rating?: number;
  featured?: boolean;
  cover_image?: { data: StrapiImage | null }; // This is how Strapi returns relations
}

export type TravelPackage = StrapiEntity<TravelPackageAttributes>;

// Define a flattened type for TravelPackage as returned by the API with populate=*
export interface FlattenedTravelPackage {
  id: number;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  rating?: number;
  featured?: boolean;
  cover_image?: CoverImage; // Changed to use CoverImage
}

export interface VisaServiceAttributes {
  country: string;
  type: string;
  price: number;
  processing_time: string;
  requirements: string;
}

export type VisaService = StrapiEntity<VisaServiceAttributes>;

export interface ESIMProductAttributes {
  country: string;
  data_amount: string;
  validity: string;
  price: number;
  provider: string;
}

export type ESIMProduct = StrapiEntity<ESIMProductAttributes>;

export interface ApplicationSubmissionAttributes {
  type: string;
  status: string;
  tracking_id: string;
  data: any;
}

export interface InternationalDrivingLicenseApplicationAttributes {
  fullName: string;
  email: string;
  licenseFront: { data: StrapiImage | null } | null;
  passportPage: { data: StrapiImage | null } | null;
  personalPhoto: { data: StrapiImage | null } | null;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

export type InternationalDrivingLicenseApplication = StrapiEntity<InternationalDrivingLicenseApplicationAttributes>;

export interface ApplicationSubmissionAttributes {
  type: string;
  status: string;
  tracking_id: string;
  data: any;
  created_at: string;
  updated_at: string;
  full_name: string;
  nationality: string; 
}

export type ApplicationSubmission = StrapiEntity<ApplicationSubmissionAttributes>;

// For ApplicationTracking component
export interface TrackingResult {
  type: string;
  status: string;
  tracking_id: string;
  data: any;
  created_at: string;
  updated_at: string;
  full_name: string; 
  nationality: string; 
}

// Alternative ESIMProduct interface (if you need a different structure)
export interface ESIMProductSimple {
  id: string;
  country: string;
  data_amount: string;
  validity: number;
  price: number;
  // ... other properties
}
