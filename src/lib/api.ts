import { API_URL, StrapiResponse, StrapiEntity, AuthResponse, TravelPackage, ESIMProduct, ApplicationSubmission, StrapiImage, StrapiImageAttributes } from './types';

class StrapiAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
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
      const response = await this.request<StrapiResponse<StrapiEntity<TravelPackage['attributes']>[]>>(endpoint);
      
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

        // Directly return the StrapiEntity, as TravelPackage is already defined as StrapiEntity<TravelPackageAttributes>
        return item as TravelPackage;
      }).filter(Boolean) as TravelPackage[]; // Filter out any nulls from invalid items
    } catch (error) {
      console.error('Error fetching travel packages:', error);
      throw error; // Re-throw to be caught by useAPI hook
    }
  }

  async getESIMProducts(): Promise<ESIMProduct[]> {
    try {
      const response = await this.request<StrapiResponse<StrapiEntity<ESIMProduct['attributes']>[]>>('esim-products');
      return response.data.map(item => item as ESIMProduct);
    } catch (error) {
      console.error('Error fetching eSIM products:', error);
      throw error;
    }
  }

  async submitVisaApplication(applicationData: any, files: FileList | undefined): Promise<ApplicationSubmission> {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(applicationData));

      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }

      const response = await fetch(`${this.baseURL}/api/visa-applications`, {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const result = await response.json();
      return result.data as ApplicationSubmission;
    } catch (error) {
      console.error('Error submitting visa application:', error);
      throw error;
    }
  }

  async trackApplication(type: string, trackingId: string): Promise<ApplicationSubmission | null> {
    try {
      const endpoint = `${type}-applications?filters[tracking_id][$eq]=${trackingId}`;
      const response = await this.request<StrapiResponse<StrapiEntity<ApplicationSubmission['attributes']>[]>>(endpoint);

      if (response.data.length === 0) {
        return null;
      }

      return response.data[0] as ApplicationSubmission;
    } catch (error) {
      console.error('Error tracking application:', error);
      return null;
    }
  }

  // File upload - This method is no longer directly used by submitVisaApplication in this structure
  // Keeping it for potential future direct file uploads if needed elsewhere.
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


