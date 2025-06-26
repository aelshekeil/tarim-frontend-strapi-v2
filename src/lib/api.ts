import { 
  API_URL, 
  StrapiResponse, 
  StrapiEntity, 
  AuthResponse, 
  TravelPackage, 
  VisaService, 
  ESIMProduct, 
  ApplicationSubmission 
} from './types';

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
    localStorage.removeItem('user');
  }

  // Generic request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api/${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(identifier: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    
    this.setToken(response.jwt);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('auth/local/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    
    this.setToken(response.jwt);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  logout() {
    this.removeToken();
  }

  // Content fetching methods
  async getTravelPackages(featured?: boolean): Promise<any[]> {
    let endpoint = 'travel-packages?populate=cover_image';
    
    if (featured) {
      endpoint += '&filters[featured][$eq]=true';
    }

    const response = await this.request<StrapiResponse<StrapiEntity<TravelPackage>[]>>(endpoint);
    
    return response.data.map(item => ({
      id: item.id,
      ...item.attributes,
      cover_image: item.attributes.cover_image ? {
        url: `${this.baseURL}${item.attributes.cover_image.url}`,
        alternativeText: item.attributes.cover_image.alternativeText,
      } : undefined,
    }));
  }

  async getVisaServices(): Promise<VisaService[]> {
    const response = await this.request<StrapiResponse<StrapiEntity<VisaService>[]>>('visa-services');
    return response.data.map(item => ({ id: item.id, ...item.attributes }));
  }

  async getESIMProducts(): Promise<ESIMProduct[]> {
    const response = await this.request<StrapiResponse<StrapiEntity<ESIMProduct>[]>>('esim-products');
    return response.data.map(item => ({ id: item.id, ...item.attributes }));
  }

  // Form submission methods
  async submitVisaApplication(formData: any, files?: FileList): Promise<{ tracking_id: string }> {
    const data = new FormData();
    data.append('data', JSON.stringify(formData));

    if (files) {
      Array.from(files).forEach((file) => {
        data.append(`files.documents`, file);
      });
    }

    const response = await fetch(`${this.baseURL}/api/visa-applications`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit application');
    }

    const result = await response.json();
    return { tracking_id: result.data.attributes.tracking_id || result.data.id };
  }

  async submitDrivingLicenseApplication(formData: any, files?: FileList): Promise<{ tracking_id: string }> {
    const data = new FormData();
    data.append('data', JSON.stringify(formData));

    if (files) {
      Array.from(files).forEach((file) => {
        data.append(`files.documents`, file);
      });
    }

    const response = await fetch(`${this.baseURL}/api/driving-license-applications`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit application');
    }

    const result = await response.json();
    return { tracking_id: result.data.attributes.tracking_id || result.data.id };
  }

  async submitBusinessIncorporation(formData: any, files?: FileList): Promise<{ tracking_id: string }> {
    const data = new FormData();
    data.append('data', JSON.stringify(formData));

    if (files) {
      Array.from(files).forEach((file) => {
        data.append(`files.documents`, file);
      });
    }

    const response = await fetch(`${this.baseURL}/api/business-incorporations`, {
      method: 'POST',
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to submit application');
    }

    const result = await response.json();
    return { tracking_id: result.data.attributes.tracking_id || result.data.id };
  }

  // Application tracking
  async trackApplication(trackingId: string, type: string): Promise<ApplicationSubmission | null> {
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

