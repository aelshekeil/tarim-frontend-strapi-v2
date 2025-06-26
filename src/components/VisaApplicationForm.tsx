import React, { useState } from 'react';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { useFormSubmission } from '../hooks/useAPI';
import strapiAPI from '../lib/api';
import { FILE_UPLOAD_LIMITS, isValidFileType, formatFileSize } from '../lib/utils';

const VisaApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    visaType: '',
    passportNumber: '',
    travelDate: '',
    additionalInfo: '',
  });

  const [files, setFiles] = useState<{
    passportCopy?: File;
    photo?: File;
    additionalDocuments?: FileList;
  }>({});

  const [trackingId, setTrackingId] = useState<string | null>(null);
  const { loading, error, success, submitForm, reset } = useFormSubmission();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles[0];
      
      // Validate file type and size
      if (!isValidFileType(file, FILE_UPLOAD_LIMITS.allowedTypes)) {
        alert(`Invalid file type. Allowed types: ${FILE_UPLOAD_LIMITS.allowedTypes.join(', ')}`);
        return;
      }
      
      if (file.size > FILE_UPLOAD_LIMITS.maxSize) {
        alert(`File too large. Maximum size: ${formatFileSize(FILE_UPLOAD_LIMITS.maxSize)}`);
        return;
      }

      if (name === 'additionalDocuments') {
        setFiles({ ...files, [name]: selectedFiles });
      } else {
        setFiles({ ...files, [name]: file });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await submitForm(async () => {
      // Prepare files for upload
      const uploadFiles: File[] = [];
      if (files.passportCopy) uploadFiles.push(files.passportCopy);
      if (files.photo) uploadFiles.push(files.photo);
      if (files.additionalDocuments) {
        Array.from(files.additionalDocuments).forEach(file => uploadFiles.push(file));
      }

      const fileList = uploadFiles.length > 0 ? (() => {
        const dt = new DataTransfer();
        uploadFiles.forEach(file => dt.items.add(file));
        return dt.files;
      })() : undefined;

      const result = await strapiAPI.submitVisaApplication(formData, fileList);
      setTrackingId(result.tracking_id);
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      visaType: '',
      passportNumber: '',
      travelDate: '',
      additionalInfo: '',
    });
    setFiles({});
    setTrackingId(null);
    reset();
  };

  if (success && trackingId) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Your Tracking ID: {trackingId}</p>
            <p className="text-sm">Please save this ID to track your application status.</p>
          </div>
          <button onClick={resetForm} className="btn-primary">
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-6">
        <FileText className="text-blue-600 mr-3" size={32} />
        <h2 className="text-2xl font-bold text-gray-800">Visa Application Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Country</option>
              <option value="Somalia">Somalia</option>
              <option value="Yemen">Yemen</option>
              <option value="Sudan">Sudan</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label">Visa Type *</label>
            <select
              name="visaType"
              value={formData.visaType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Visa Type</option>
              <option value="E-Visa">E-Visa</option>
              <option value="Transit Visa">Transit Visa</option>
            </select>
          </div>

          <div>
            <label className="form-label">Passport Number *</label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Travel Date *</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="form-input"
            rows={3}
            placeholder="Any additional information or special requests..."
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Required Documents</h3>
          
          <div>
            <label className="form-label">Passport Copy * (PDF, JPG, PNG)</label>
            <input
              type="file"
              name="passportCopy"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Photo * (JPG, PNG)</label>
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Additional Documents (Optional)</label>
            <input
              type="file"
              name="additionalDocuments"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
              className="form-input"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can upload multiple files. Max size: {formatFileSize(FILE_UPLOAD_LIMITS.maxSize)} per file.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default VisaApplicationForm;

