import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';
import { useAuth } from '../hooks/useAuth';
import { DrivingLicenseApplicationData } from '../lib/applicationApi';
import Dropzone from './Dropzone';
import ProgressBar from './ProgressBar';

const InternationalDrivingLicense: FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DrivingLicenseApplicationData>>({});
  const [files, setFiles] = useState<{ idCopy?: File, photo?: File, oldLicenseCopy?: File }>({});
  const { loading, error, trackingNumber, submitDrivingLicense } = useApplication();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();

  const handleFileChange = (file: File, field: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        setValidationError(t('common.age_validation'));
        return;
      }
    }

    const requiredFields: (keyof Omit<DrivingLicenseApplicationData, 'idCopy' | 'photo' | 'oldLicenseCopy'>)[] = [
      'fullName', 'email', 'phone', 'dateOfBirth', 'nationality', 'address'
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
    const { fullName, email, phone, dateOfBirth, nationality, address } = formData;
    const { idCopy, photo, oldLicenseCopy } = files;

    if (!fullName || !email || !phone || !dateOfBirth || !nationality || !address || !idCopy || !photo || !oldLicenseCopy) {
      setValidationError(t('common.fill_required_fields'));
      return;
    }

    const applicationData: DrivingLicenseApplicationData = {
      fullName,
      email,
      phone,
      nationality,
      address,
      idCopy,
      photo,
      oldLicenseCopy,
      dateOfBirth: new Date(dateOfBirth).toISOString(),
    };

    await submitDrivingLicense(applicationData);
    if (!error) {
      setCurrentStep(4);
    }
  };

  const steps = [
    t('idl.steps.upload'),
    t('idl.steps.review'),
    t('idl.steps.payment'),
    t('idl.steps.delivery'),
  ];

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

      {/* Informative Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('idl.eligibility.title')}</h3>
              <p>{t('idl.eligibility.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('idl.process.title')}</h3>
              <p>{t('idl.process.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('idl.faq.title')}</h3>
              <p>{t('idl.faq.content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">{t('common.apply_now')}</h2>
          <div className="max-w-4xl mx-auto">
            <ProgressBar currentStep={currentStep} steps={steps} />
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
                  <input name="nationality" placeholder={t('common.nationality')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />
                  <input name="address" placeholder={t('common.address')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required />

                  {/* File Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'idCopy')} label={t('idl.id_copy')} />
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'photo')} label={t('idl.personal_photo')} />
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'oldLicenseCopy')} label={t('idl.old_license_copy')} />
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
