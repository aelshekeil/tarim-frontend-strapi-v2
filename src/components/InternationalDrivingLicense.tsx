import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';
import { useAuth } from '../hooks/useAuth';
import { DrivingLicenseApplicationData } from '../lib/applicationApi';

const InternationalDrivingLicense: FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<DrivingLicenseApplicationData>>({});
  const [files, setFiles] = useState<{ idCopy?: File, photo?: File, oldLicenseCopy?: File }>({});
  const { loading, error, trackingNumber, submitDrivingLicense } = useApplication();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files) {
      setFiles(prev => ({ ...prev, [field]: e.target.files?.[0] }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const requiredFields: (keyof Omit<DrivingLicenseApplicationData, 'idCopy' | 'photo' | 'oldLicenseCopy'>)[] = [
      'fullName', 'email', 'phone', 'dateOfBirth', 'countryOfBirth', 'nationality', 'address', 'issuingCountry', 'expiryDate', 'licenseNumber'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setValidationError(`${t('common.fill_required_fields')}: ${missingFields.join(', ')}`);
      return;
    }

    if (!files.idCopy || !files.photo || !files.oldLicenseCopy) {
      setValidationError(t('common.upload_required_documents'));
      return;
    }

    if (!user?.id) {
      setValidationError(t('common.login_required_text'));
      return;
    }

    // Ensure all fields are present before creating the final object
    const { fullName, email, phone, dateOfBirth, countryOfBirth, nationality, address, issuingCountry, expiryDate, licenseNumber } = formData;
    const { idCopy, photo, oldLicenseCopy } = files;

    if (!fullName || !email || !phone || !dateOfBirth || !countryOfBirth || !nationality || !address || !issuingCountry || !expiryDate || !licenseNumber || !idCopy || !photo || !oldLicenseCopy) {
      setValidationError(t('common.fill_required_fields'));
      return;
    }

    const applicationData: DrivingLicenseApplicationData = {
      fullName,
      email,
      phone,
      countryOfBirth,
      nationality,
      address,
      issuingCountry,
      licenseNumber,
      idCopy,
      photo,
      oldLicenseCopy,
      dateOfBirth: new Date(dateOfBirth).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
    };

    await submitDrivingLicense(applicationData);
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">{t('idl.title')}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('idl.subtitle')}</p>
          <button
            onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('common.apply_now')}
          </button>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">{t('common.apply_now')}</h2>
          <div className="max-w-2xl mx-auto">
            {!isLoggedIn ? (
              <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-xl font-semibold text-yellow-800">{t('common.login_required_title')}</h3>
                <p className="text-yellow-700 mt-2">{t('common.login_required_text')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Form fields */}
                  <input name="fullName" placeholder={t('common.full_name')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="email" type="email" placeholder={t('common.email')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="phone" placeholder={t('common.phone')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="dateOfBirth" type="date" placeholder={t('common.date_of_birth')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="countryOfBirth" placeholder={t('common.country_of_birth')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="nationality" placeholder={t('common.nationality')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="address" placeholder={t('common.address')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="issuingCountry" placeholder={t('common.issuing_country')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="expiryDate" type="date" placeholder={t('common.expiry_date')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="licenseNumber" placeholder={t('common.license_number')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />

                  {/* File Inputs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('idl.id_copy')}</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'idCopy')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('idl.personal_photo')}</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'photo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('idl.old_license_copy')}</label>
                    <input type="file" onChange={(e) => handleFileChange(e, 'oldLicenseCopy')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0" required />
                  </div>
                </div>
                {validationError && <p className="mt-4 text-red-600 text-sm text-center">{validationError}</p>}
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
      </section>
    </div>
  );
};

export default InternationalDrivingLicense;
