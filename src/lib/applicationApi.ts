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
}

const api = axios.create({
  baseURL: API_URL,
});

export const submitDrivingLicenseApplication = async (data: DrivingLicenseApplicationData) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('files.idCopy', data.idCopy);
  formData.append('files.photo', data.photo);
  formData.append('files.oldLicenseCopy', data.oldLicenseCopy);

  const response = await api.post('/driving-license-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const submitVisaApplication = async (data: VisaApplicationData) => {
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  formData.append('files.passportCopy', data.passportCopy);
  formData.append('files.photo', data.photo);

  const response = await api.post('/visa-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const trackApplication = async (trackingNumber: string) => {
  const response = await api.get(`/track-application?trackingNumber=${trackingNumber}`);
  return response.data;
};
