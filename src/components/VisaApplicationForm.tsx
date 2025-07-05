import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';
import { useAuth } from '../hooks/useAuth';
import { VisaApplicationData } from '../lib/applicationApi';
import Dropzone from './Dropzone';
import ProgressBar from './ProgressBar';

const VisaApplicationForm: FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);
  const [formData, setFormData] = useState<Partial<VisaApplicationData>>({});
  const [files, setFiles] = useState<{ passportCopy?: File, photo?: File, additionalDocuments?: File[] }>({});
  const { loading, error, trackingNumber, submitVisa } = useApplication();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();

  const handleFileChange = (file: File, field: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const requiredFields: (keyof Omit<VisaApplicationData, 'passportCopy' | 'photo' | 'additionalDocuments'>)[] = [
      'fullName', 'email', 'phone', 'passportNumber', 'nationality', 'destinationCountry', 'visaType', 'travelDate'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setValidationError(`${t('common.fill_required_fields')}: ${missingFields.join(', ')}`);
      return;
    }

    if (!files.passportCopy || !files.photo) {
      setValidationError(t('common.upload_required_documents'));
      return;
    }

    if (!user?.id) {
      setValidationError(t('common.login_required_text'));
      return;
    }

    const applicationData: VisaApplicationData = {
      ...formData,
      passportCopy: files.passportCopy,
      photo: files.photo,
    } as VisaApplicationData;

    if (files.additionalDocuments) {
      applicationData.additionalDocuments = files.additionalDocuments;
    }

    await submitVisa(applicationData);
    if (!error) {
      setCurrentStep(4);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof Omit<VisaApplicationData, 'passportCopy' | 'photo' | 'additionalDocuments'>)[] = [
      'fullName', 'email', 'phone', 'passportNumber', 'nationality', 'destinationCountry', 'visaType', 'travelDate'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setValidationError(`${t('common.fill_required_fields')}: ${missingFields.join(', ')}`);
      return;
    }
    if (!files.passportCopy || !files.photo) {
      setValidationError(t('common.upload_required_documents'));
      return;
    }
    setValidationError(null);
    setIsReviewing(true);
    setCurrentStep(2);
  };

  const steps = [
    t('visa_application.steps.upload'),
    t('visa_application.steps.review'),
    t('visa_application.steps.payment'),
    t('visa_application.steps.delivery'),
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
          <h1 className="text-4xl font-bold mb-4">{t('visa_application.title')}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('visa_application.subtitle')}</p>
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
              <h3 className="text-xl font-semibold mb-4">{t('visa_application.requirements.title')}</h3>
              <p>{t('visa_application.requirements.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('visa_application.process.title')}</h3>
              <p>{t('visa_application.process.content')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('visa_application.faq.title')}</h3>
              <p>{t('visa_application.faq.content')}</p>
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
              <form onSubmit={isReviewing ? handleSubmit : handleReview}>
                <div className="space-y-6">
                  {/* Form fields */}
                  <input name="fullName" placeholder={t('common.full_name')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <input name="email" type="email" placeholder={t('common.email')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <input name="phone" placeholder={t('common.phone')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <input name="passportNumber" placeholder={t('visa_application.passport_number')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <input name="nationality" placeholder={t('common.nationality')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <input name="destinationCountry" placeholder={t('visa_application.destination_country')} onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />
                  <select name="visaType" onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing}>
                    <option value="">{t('visa_application.select_visa_type')}</option>
                    <option value="tourist">{t('visa_application.tourist_visa')}</option>
                    <option value="business">{t('visa_application.business_visa')}</option>
                    <option value="student">{t('visa_application.student_visa')}</option>
                  </select>
                  <input name="travelDate" type="date" onChange={handleChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2" required disabled={isReviewing} />

                  {/* File Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'passportCopy')} label={t('visa_application.passport_copy')} />
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'photo')} label={t('visa_application.photo')} />
                    <Dropzone onFileChange={(file) => handleFileChange(file, 'additionalDocuments')} label={t('common.additional_documents')} />
                  </div>
                </div>
                {validationError && <p className="mt-4 text-red-600 text-sm text-center">{validationError}</p>}
                {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
                <div className="mt-8">
                  {isReviewing ? (
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => { setIsReviewing(false); setCurrentStep(1); }}
                        className="bg-gray-600 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                        disabled={loading}
                      >
                        {loading ? t('common.submitting') : t('common.submit_application')}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t('common.review_application')}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaApplicationForm;
