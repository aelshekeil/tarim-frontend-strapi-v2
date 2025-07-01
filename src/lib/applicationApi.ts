import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://back.tarimtours.com/';

export interface DrivingLicenseApplicationData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  countryOfBirth: string;
  nationality: string;
  address: string;
  issuingCountry: string;
  expiryDate: string;
  licenseNumber: string;
  idCopy: File;
  photo: File;
  oldLicenseCopy: File;
  additionalDocuments?: File[];
}

export interface VisaApplicationData {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  nationality: string;
  destinationCountry: string;
  visaType: string;
  travelDate: string;
  passportCopy: File;
  photo: File;
  additionalDocuments?: File[];
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { jwt } = JSON.parse(user);
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  }
  return config;
});

export const submitDrivingLicenseApplication = async (data: DrivingLicenseApplicationData) => {
  const formData = new FormData();
  const { idCopy, photo, oldLicenseCopy, additionalDocuments, ...otherData } = data;
  Object.keys(otherData).forEach(key => {
    formData.append(key, otherData[key as keyof typeof otherData]);
  });
  formData.append('files.idCopy', idCopy);
  formData.append('files.photo', photo);
  formData.append('files.oldLicenseCopy', oldLicenseCopy);
  if (additionalDocuments) {
    additionalDocuments.forEach(file => {
      formData.append('files.additionalDocuments', file);
    });
  }

  const response = await api.post('/api/driving-license-applications', formData);
  return response.data;
};

export const submitVisaApplication = async (data: VisaApplicationData) => {
  const formData = new FormData();
  const { passportCopy, photo, additionalDocuments, ...otherData } = data;
  Object.keys(otherData).forEach(key => {
    formData.append(key, otherData[key as keyof typeof otherData]);
  });
  formData.append('files.passportCopy', passportCopy);
  formData.append('files.photo', photo);
  if (additionalDocuments) {
    additionalDocuments.forEach(file => {
      formData.append('files.additionalDocuments', file);
    });
  }

  const response = await api.post('/api/visa-applications', formData);
  return response.data;
};

export const trackApplication = async (trackingNumber: string) => {
  const response = await api.get(`/api/track-application?trackingNumber=${trackingNumber}`);
  return response.data;
};
