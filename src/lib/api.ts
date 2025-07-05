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

  constructor() {
    this.baseURL = API_URL;
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  removeToken() {
    localStorage.removeItem('jwt');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem('jwt');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(endpoint, `${this.baseURL}/api/`).href;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData); // Log the error data
      throw new Error(errorData.message || errorData.error?.message || JSON.stringify(errorData) || 'Something went wrong');
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

  async updateProfile(userId: number, data: { username?: string; email?: string }): Promise<any> {
    return this.request<any>(`users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword?: string; password?: string, passwordConfirmation?: string }): Promise<any> {
    const token = localStorage.getItem('jwt');
    const url = new URL('auth/change-password', `${this.baseURL}/api/`).href;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(errorData.message || errorData.error?.message || JSON.stringify(errorData) || 'Something went wrong');
    }

    return response.json();
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

    const token = localStorage.getItem('jwt');
    const response = await fetch(`${this.baseURL}/api/visa-applications`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit application');
    }

    const result = await response.json();
    return result.data as ApplicationSubmission;
  }

  async submitInternationalDrivingLicenseApplication(
    applicationData: { fullName: string; email: string; paymentStatus: 'pending' | 'completed' | 'failed' },
    files: { licenseFront: File; passportPage: File; personalPhoto: File }
  ): Promise<ApplicationSubmission> {
    const uploadedLicenseFront = await this.uploadFile(files.licenseFront);
    const uploadedPassportPage = await this.uploadFile(files.passportPage);
    const uploadedPersonalPhoto = await this.uploadFile(files.personalPhoto);

    const data = {
      ...applicationData,
      licenseFront: uploadedLicenseFront.id,
      passportPage: uploadedPassportPage.id,
      personalPhoto: uploadedPersonalPhoto.id,
      type: 'international-driving-license', // Set the type for tracking
    };

    const response = await this.post<StrapiResponse<StrapiEntity<ApplicationSubmission['attributes']>>>(
      'international-driving-license-applications',
      { data }
    );

    return response.data as ApplicationSubmission;
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

    const token = localStorage.getItem('jwt');
    const response = await fetch(`${this.baseURL}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
