import {
  API_URL,
  StrapiResponse,
  StrapiEntity,
  AuthResponse,
  TravelPackage,
  ESIMProduct,
  ApplicationSubmission,
  StrapiImage,
} from './types';

class StrapiAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('jwt');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
  }

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

  // Add missing GET method
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // Add missing POST method
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

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

  async getTravelPackages(featuredOnly?: boolean): Promise<TravelPackage[]> {
    let endpoint = 'travel-packages?populate=cover_image';
    if (featuredOnly) {
      endpoint += '&filters[featured][$eq]=true';
    }

    const response = await this.request<StrapiResponse<StrapiEntity<TravelPackage['attributes']>[]>>(endpoint);

    return response.data
      .map(item => {
        if (!item?.attributes) return null;

        // ✅ Reference cover_image directly to ensure StrapiImage is used
        const cover: StrapiImage | null | undefined = item.attributes.cover_image?.data;

        return {
          ...item,
          attributes: {
            ...item.attributes,
            cover_image: { data: cover ?? null },
          },
        } as TravelPackage;
      })
      .filter(Boolean) as TravelPackage[];
  }

  async getESIMProducts(): Promise<ESIMProduct[]> {
    const response = await this.request<StrapiResponse<StrapiEntity<ESIMProduct['attributes']>[]>>('esim-products');
    return response.data.map(item => item as ESIMProduct);
  }

  async submitVisaApplication(applicationData: any, files?: FileList): Promise<ApplicationSubmission> {
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
  }

  async trackApplication(type: string, trackingId: string): Promise<ApplicationSubmission | null> {
    const endpoint = `${type}-applications?filters[tracking_id][$eq]=${trackingId}`;
    const response = await this.request<StrapiResponse<StrapiEntity<ApplicationSubmission['attributes']>[]>>(endpoint);

    if (response.data.length === 0) return null;

    return response.data[0] as ApplicationSubmission;
  }

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

const strapiAPI = new StrapiAPI();
export default strapiAPI;