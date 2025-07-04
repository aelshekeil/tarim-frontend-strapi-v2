import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://back.tarimtours.com/';

export interface DrivingLicenseApplicationData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  idCopy: File;
  photo: File;
  oldLicenseCopy: File;
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

export const submitDrivingLicenseApplication = async (
  data: DrivingLicenseApplicationData
) => {
  const formData = new FormData();
  const { idCopy, photo, oldLicenseCopy, ...otherData } = data;

  formData.append('data', JSON.stringify(otherData));
  formData.append('files.idCopy', idCopy);
  formData.append('files.photo', photo);
  formData.append('files.oldLicenseCopy', oldLicenseCopy);

  const response = await api.post('/api/driving-license-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const submitVisaApplication = async (data: VisaApplicationData) => {
  const formData = new FormData();
  const { passportCopy, photo, additionalDocuments, ...otherData } = data;

  formData.append('data', JSON.stringify(otherData));
  formData.append('files.passportCopy', passportCopy);
  formData.append('files.photo', photo);

  if (additionalDocuments && additionalDocuments.length > 0) {
    additionalDocuments.forEach((file) => {
      formData.append('files.additionalDocuments', file);
    });
  }

  const response = await api.post('/api/visa-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const trackApplication = async (trackingNumber: string) => {
  const response = await api.get(`/api/track/${trackingNumber}`);
  return response.data;
};
