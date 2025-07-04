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
  const {
    idCopy,
    photo,
    oldLicenseCopy,
    ...otherFields
  } = data;

  // First, submit the data fields as a JSON object
  const dataRes = await api.post('/api/driving-license-applications', { data: otherFields });
  const createdEntryId = dataRes.data.data.id;

  // Then, if files exist, upload them separately and link to the created entry
  const uploadPromises = [];

  if (idCopy) {
    const idCopyFormData = new FormData();
    idCopyFormData.append('files', idCopy, idCopy.name); // Use 'files' as the key and include filename
    idCopyFormData.append('ref', 'api::driving-license-application.driving-license-application');
    idCopyFormData.append('refId', createdEntryId);
    idCopyFormData.append('field', 'idCopy');
    uploadPromises.push(api.post('/api/upload', idCopyFormData));
  }
  if (photo) {
    const photoFormData = new FormData();
    photoFormData.append('files', photo, photo.name); // Use 'files' as the key and include filename
    photoFormData.append('ref', 'api::driving-license-application.driving-license-application');
    photoFormData.append('refId', createdEntryId);
    photoFormData.append('field', 'photo');
    uploadPromises.push(api.post('/api/upload', photoFormData));
  }
  if (oldLicenseCopy) {
    const oldLicenseCopyFormData = new FormData();
    oldLicenseCopyFormData.append('files', oldLicenseCopy, oldLicenseCopy.name); // Use 'files' as the key and include filename
    oldLicenseCopyFormData.append('ref', 'api::driving-license-application.driving-license-application');
    oldLicenseCopyFormData.append('refId', createdEntryId);
    oldLicenseCopyFormData.append('field', 'oldLicenseCopy');
    uploadPromises.push(api.post('/api/upload', oldLicenseCopyFormData));
  }

  await Promise.all(uploadPromises);

  return dataRes.data;
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
