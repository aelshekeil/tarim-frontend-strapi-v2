import React, { useState } from 'react';
import strapiAPI from '../lib/api';

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
  const [passportCopy, setPassportCopy] = useState<File | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [additionalDocuments, setAdditionalDocuments] = useState<FilsubmitVisaApplication>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === 'passportCopy') {
        setPassportCopy(files[0]);
      } else if (name === 'photo') {
        setPhoto(files[0]);
      } else if (name === 'additionalDocuments') {
        setAdditionalDocuments(Array.from(files));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTrackingId(null);

    if (!passportCopy || !photo) {
      setError('Passport copy and photo are required.');
      setLoading(false);
      return;
    }

    try {
      const filesToUpload: submitVisaApplication = [passportCopy, photo, ...additionalDocuments];
      
      // Generate a simple tracking ID
      const generatedTrackingId = `VISA-${Date.now()}`;

      const applicationData = {
        ...formData,
        tracking_id: generatedTrackingId,
        status: 'pending',
      };

      const result = await strapiAPI.submitVisaApplication(applicationData, filesToUpload);
      setSuccess('Application submitted successfully!');
      setTrackingId(result.tracking_id);
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
      setPassportCopy(null);
      setPhoto(null);
      setAdditionalDocuments([]);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="visa-application" className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Visa Application Form</h2>
        <p className="text-center text-gray-600 mb-8">Fill out the form below to apply for your visa.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              {success}
              {trackingId && <p className="mt-2">Your tracking ID: <span className="font-bold">{trackingId}</span></p>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">Country</label>
              <select id="country" name="country" value={formData.country} onChange={handleChange} className="form-select" required>
                <option value="">Select your country</option>
                <option value="Somalia">Somalia</option>
                <option value="Yemen">Yemen</option>
                <option value="Sudan">Sudan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="visaType" className="block text-gray-700 text-sm font-bold mb-2">Visa Type</label>
              <select id="visaType" name="visaType" value={formData.visaType} onChange={handleChange} className="form-select" required>
                <option value="">Select visa type</option>
                <option value="E-Visa">E-Visa</option>
                <option value="Transit Visa">Transit Visa</option>
              </select>
            </div>
            <div>
              <label htmlFor="passportNumber" className="block text-gray-700 text-sm font-bold mb-2">Passport Number</label>
              <input type="text" id="passportNumber" name="passportNumber" value={formData.passportNumber} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label htmlFor="travelDate" className="block text-gray-700 text-sm font-bold mb-2">Travel Date</label>
              <input type="date" id="travelDate" name="travelDate" value={formData.travelDate} onChange={handleChange} className="form-input" required />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="additionalInfo" className="block text-gray-700 text-sm font-bold mb-2">Additional Information (Optional)</label>
            <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className="form-textarea"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="passportCopy" className="block text-gray-700 text-sm font-bold mb-2">Passport Copy (PDF, JPG, PNG)</label>
              <input type="file" id="passportCopy" name="passportCopy" onChange={handleFileChange} className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" required />
              {passportCopy && <p className="text-sm text-gray-500 mt-1">Selected: {passportCopy.name}</p>}
            </div>
            <div>
              <label htmlFor="photo" className="block text-gray-700 text-sm font-bold mb-2">Photo (JPG, PNG)</label>
              <input type="file" id="photo" name="photo" onChange={handleFileChange} className="form-input-file" accept=".jpg,.jpeg,.png" required />
              {photo && <p className="text-sm text-gray-500 mt-1">Selected: {photo.name}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="additionalDocuments" className="block text-gray-700 text-sm font-bold mb-2">Additional Documents (Optional, Max 10MB per file)</label>
            <input type="file" id="additionalDocuments" name="additionalDocuments" onChange={handleFileChange} className="form-input-file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            {additionalDocuments.length > 0 && (
              <ul className="mt-2 text-sm text-gray-500">
                {additionalDocuments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default VisaApplicationForm;
