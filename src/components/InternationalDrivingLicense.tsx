import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';
import { useAuth } from '../hooks/useAuth';
import { DrivingLicenseApplicationData } from '../lib/applicationApi';
import Dropzone from './Dropzone';
import ProgressBar from './ProgressBar';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import arLocale from 'i18n-iso-countries/langs/ar.json';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

countries.registerLocale(enLocale);
countries.registerLocale(arLocale);

const InternationalDrivingLicense: FC = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewing, setIsReviewing] = useState(false);
  const [formData, setFormData] = useState<Partial<DrivingLicenseApplicationData>>({});
  const [files, setFiles] = useState<{ idCopy?: File, photo?: File, oldLicenseCopy?: File }>({});
  const { loading, error, trackingNumber, submitDrivingLicense } = useApplication();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { isLoggedIn, user } = useAuth();

  const handleFileChange = (file: File, field: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string, name?: string) => {
    if (name === 'phone' && typeof e === 'string') {
      setFormData(prev => ({ ...prev, [name]: e }));
    } else if (typeof e === 'object' && 'target' in e) {
      const { name: targetName, value } = e.target;
      setFormData(prev => ({ ...prev, [targetName]: value }));
    }
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

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform validation before proceeding to review
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
    setValidationError(null);
    setIsReviewing(true);
    setCurrentStep(2);
  };

  const steps = [
    t('idl.steps.upload'),
    t('idl.steps.review'),
    t('idl.steps.payment'),
    t('idl.steps.delivery'),
  ];

  if (trackingNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-2xl w-full border border-gray-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('common.submission_successful')}</h2>
          <p className="text-gray-600 mb-6">Your application has been successfully submitted and is being processed.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-lg text-gray-700 mb-2">{t('common.tracking_number_is')}</p>
            <p className="text-2xl font-bold text-blue-600">{trackingNumber}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('idl.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              {t('idl.subtitle')}
            </p>
            <button
              onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t('common.apply_now')}
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-20 right-20 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-16 h-16 bg-white opacity-10 rounded-full"></div>
        </div>
      </section>

      {/* Informative Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('idl.eligibility.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('idl.eligibility.content')}</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('idl.process.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('idl.process.content')}</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('idl.faq.title')}</h3>
                <p className="text-gray-600 leading-relaxed">{t('idl.faq.content')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('common.apply_now')}</h2>
            <p className="text-xl text-gray-600">Complete your application in just a few simple steps</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8">
                <ProgressBar currentStep={currentStep} steps={steps} />
                
                {!isLoggedIn ? (
                  <div className="text-center p-12 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl mt-8">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-800 mb-4">{t('common.login_required_title')}</h3>
                    <p className="text-yellow-700 text-lg">{t('common.login_required_text')}</p>
                  </div>
                ) : (
                  <div className="mt-8">
                    <form onSubmit={isReviewing ? handleSubmit : handleReview}>
                    <div className="space-y-8">
                      {/* Personal Information Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                          <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input 
                              name="fullName" 
                              placeholder={t('common.full_name')} 
                              onChange={handleChange} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                              required 
                              disabled={isReviewing}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input 
                              name="email" 
                              type="email" 
                              placeholder={t('common.email')} 
                              onChange={handleChange} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                              required 
                              disabled={isReviewing}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <PhoneInput
                              name="phone"
                              placeholder={t('common.phone')}
                              value={formData.phone}
                              onChange={(value) => handleChange(value || '', 'phone')}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                              required
                              disabled={isReviewing}
                              defaultCountry="US"
                              international
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                            <input 
                              name="dateOfBirth" 
                              type="date" 
                              placeholder={t('common.date_of_birth')} 
                              onChange={handleChange} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                              required 
                              disabled={isReviewing}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                            <select
                              name="nationality"
                              value={formData.nationality || ''}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                              required
                              disabled={isReviewing}
                            >
                              <option value="">{t('common.select_nationality')}</option>
                              {Object.entries(countries.getNames(i18n.language === 'ar' ? 'ar' : 'en')).map(([code, name]) => (
                                <option key={code} value={name}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input 
                              name="address" 
                              placeholder={t('common.address')} 
                              onChange={handleChange} 
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                              required 
                              disabled={isReviewing}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Document Upload Section */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                          <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Required Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Dropzone onFileChange={(file) => handleFileChange(file, 'idCopy')} label={t('idl.id_copy')} />
                          <Dropzone onFileChange={(file) => handleFileChange(file, 'photo')} label={t('idl.personal_photo')} />
                          <Dropzone onFileChange={(file) => handleFileChange(file, 'oldLicenseCopy')} label={t('idl.old_license_copy')} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Error Messages */}
                    {(validationError || error) && (
                      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-red-700 font-medium">{validationError || error}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                      {isReviewing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => { setIsReviewing(false); setCurrentStep(1); }}
                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold border border-gray-300 hover:border-gray-400"
                          >
                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            {t('common.edit')}
                          </button>
                          <button
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('common.submitting')}
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                {t('common.submit_application')}
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          type="submit"
                          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {t('common.review_application')}
                        </button>
                      )}
                    </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternationalDrivingLicense;
