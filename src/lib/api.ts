import {
  API_URL,
  StrapiResponse,
  StrapiEntity,
  AuthResponse,
  TravelPackage,
  ESIMProduct,
  ApplicationSubmission,
  StrapiImage // StrapiImage is used here
} from './types';

class StrapiAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor( ) {
    this.baseURL = API_URL;
    // Try to get token from localStorage
    this.token = localStorage.getItem('jwt');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('jwt');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/api/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong');
    }

    return response.json();
  }

  // Auth methods
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('auth/local/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(identifier: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  }

  // Content fetching methods
  async getTravelPackages(featuredOnly?: boolean): Promise<TravelPackage[]> {
    let endpoint = 'travel-packages?populate=cover_image';
    if (featuredOnly) {
      endpoint += '&filters[featured][$eq]=true';
    }

    try {
      const response = await this.request<StrapiResponse<StrapiEntity<Omit<TravelPackage, 'id' | 'cover_image'>>[]>>(endpoint);
      
      // Log the raw response data for debugging
      console.log('Raw Strapi travel packages response:', response);

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => {
        if (!item || !item.attributes) {
          console.warn('Skipping invalid item from Strapi response:', item);
          return null; // Filter out invalid items
        }

        const coverImageRaw = item.attributes.cover_image;
        let cover_image: TravelPackage['cover_image'] = null;

        // Expecting cover_image to be { data: StrapiEntity<StrapiImage> | null }
        if (coverImageRaw && coverImageRaw.data && coverImageRaw.data.attributes) {
          cover_image = {
            data: {
              id: coverImageRaw.data.id,
              attributes: coverImageRaw.data.attributes,
            },
          };
        }

        return {
          id: item.id,
          title: item.attributes.title,
          description: item.attributes.description,
          destination: item.attributes.destination,
          price: item.attributes.price,
          duration: item.attributes.duration,
          rating: item.attributes.rating,
          featured: item.attributes.featured,
          cover_image: cover_image,
        };
      }).filter(Boolean) as TravelPackage[]; // Filter out any nulls from invalid items
    } catch (error) {
      console.error('Error fetching travel packages:', error);
      throw error; // Re-throw to be caught by useAPI hook
    }
  }

  async getESIMProducts(): Promise<ESIMProduct[]> {
    try {
      const response = await this.request<StrapiResponse<StrapiEntity<ESIMProduct>[]>>('esim-products');
      return response.data.map(item => ({
        id: item.id,
        ...item.attributes,
      }));
    } catch (error) {
      console.error('Error fetching eSIM products:', error);
      throw error;
    }
  }

  async submitVisaApplication(applicationData: any, files: File[]): Promise<ApplicationSubmission> {
    try {
      // First, upload files
      const uploadedFileIds: number[] = [];
      for (const file of files) {
        const uploadedFile = await this.uploadFile(file);
        uploadedFileIds.push(uploadedFile.id);
      }

      // Then, submit application data with file IDs
      const payload = {
        data: {
          ...applicationData,
          documents: uploadedFileIds, // Link uploaded files
        },
      };
      const response = await this.request<StrapiResponse<StrapiEntity<ApplicationSubmission>>>('visa-applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return {
        id: response.data.id,
        ...response.data.attributes,
      };
    } catch (error) {
      console.error('Error submitting visa application:', error);
      throw error;
    }
  }

  async trackApplication(type: string, trackingId: string): Promise<ApplicationSubmission | null> {
    try {
      const endpoint = `${type}-applications?filters[tracking_id][$eq]=${trackingId}`;
      const response = await this.request<StrapiResponse<StrapiEntity<ApplicationSubmission>[]>>(endpoint);

      if (response.data.length === 0) {
        return null;
      }

      return {
        ...response.data[0].attributes,
        id: response.data[0].id,
      };
    } catch (error) {
      console.error('Error tracking application:', error);
      return null;
    }
  }

  // File upload
  async uploadFile(file: File): Promise<{ id: number; url: string }> {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const result = await response.json();
    return {
      id: result[0].id,
      url: `${this.baseURL}${result[0].url}`,
    };
  }
}

// Create and export a singleton instance
export const strapiAPI = new StrapiAPI();
export default strapiAPI;
