import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';
import { VisaApplicationData } from '../lib/applicationApi';

const VisaApplicationForm: FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<VisaApplicationData>>({});
  const [files, setFiles] = useState<{ passportCopy?: File, photo?: File }>({});
  const { loading, error, trackingNumber, submitVisa } = useApplication();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files) {
      setFiles(prev => ({ ...prev, [field]: e.target.files?.[0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.passportCopy || !files.photo) {
      alert('Please upload all required documents.');
      return;
    }

    const applicationData: VisaApplicationData = {
      ...formData,
      passportCopy: files.passportCopy,
      photo: files.photo,
    } as VisaApplicationData;

    await submitVisa(applicationData);
  };

  if (trackingNumber) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">{t('common.submission_successful')}</h2>
        <p>{t('common.tracking_number_is')} <span className="font-bold">{trackingNumber}</span></p>
      </div>
    );
  }

  return (
    <div className="container-custom py-20">
      <h2 className="section-title">{t('visa_application.title')}</h2>
      <div className="max-w-2xl mx-auto">
        {!isLoggedIn ? (
          <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-800">{t('common.login_required_title')}</h3>
            <p className="text-yellow-700 mt-2">{t('common.login_required_text')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <input name="fullName" placeholder={t('common.full_name')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <input name="email" type="email" placeholder={t('common.email')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <input name="phone" placeholder={t('common.phone')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <input name="passportNumber" placeholder={t('visa_application.passport_number')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <input name="nationality" placeholder={t('common.nationality')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <input name="destinationCountry" placeholder={t('visa_application.destination_country')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
              <select name="visaType" onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required>
                <option value="">{t('visa_application.select_visa_type')}</option>
                <option value="tourist">{t('visa_application.tourist_visa')}</option>
                <option value="business">{t('visa_application.business_visa')}</option>
                <option value="student">{t('visa_application.student_visa')}</option>
              </select>
              <input name="travelDate" type="date" onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />

              <div>
                <label className="block text-sm font-medium text-gray-700">{t('visa_application.passport_copy')}</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'passportCopy')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('visa_application.photo')}</label>
                <input type="file" onChange={(e) => handleFileChange(e, 'photo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" required />
              </div>
            </div>
            {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? t('common.submitting') : t('common.submit_application')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VisaApplicationForm;
