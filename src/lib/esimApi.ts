import { API_URL } from './types';

export interface EsimPlan {
  id: number;
  product_name: string;
  data_gb: string;
  net_price_usd: number;
  sms: number;
  voice: number;
}

export interface Country {
  id: number;
  name: string;
  isoCode: string; // Add isoCode property
  flag_icon?: {
    url: string;
  };
  Country?: EsimPlan[]; // This holds the actual plans, matching backend response
}

export interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

// Fetch all countries with their eSIM plans
export const fetchCountriesWithPlans = async (): Promise<Country[]> => {
  try {
    const response = await fetch(`${API_URL}/api/countries?populate[Country]=true&populate[flag_icon]=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: StrapiResponse<Country[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching countries with plans:', error);
    throw error;
  }
};

// Fetch plans for a specific country
export const fetchCountryPlans = async (countryId: number): Promise<EsimPlan[]> => {
  try {
    const response = await fetch(`${API_URL}/api/countries/${countryId}?populate[Country]=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: StrapiResponse<Country> = await response.json();
    return result.data.Country || []; // Return empty array if no plans, matching backend response
  } catch (error) {
    console.error('Error fetching country plans:', error);
    throw error;
  }
};

// Search countries by name
export const searchCountries = async (query: string): Promise<Country[]> => {
  try {
    const response = await fetch(`${API_URL}/api/countries?filters[name][$containsi]=${encodeURIComponent(query)}&populate[Country]=true&populate[flag_icon]=true`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: StrapiResponse<Country[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error searching countries:', error);
    throw error;
  }
};
