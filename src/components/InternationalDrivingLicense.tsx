import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

const InternationalDrivingLicense: FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [passportPage, setPassportPage] = useState<File | null>(null);
  const [personalPhoto, setPersonalPhoto] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    // This will involve uploading the files and then proceeding to payment
    console.log({
      licenseFront,
      passportPage,
      personalPhoto,
    });
    setStep(2); // Move to payment step
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">{t('idl.title')}</h1>
          <p className="text-lg text-gray-600 mb-8">{t('idl.subtitle')}</p>
          <button
            onClick={() => {
              const element = document.getElementById('apply');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('common.apply_now')}
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="section-title">{t('idl.benefits_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('idl.benefit1_title')}</h3>
              <p className="text-gray-600">{t('idl.benefit1_desc')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('idl.benefit2_title')}</h3>
              <p className="text-gray-600">{t('idl.benefit2_desc')}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('idl.benefit3_title')}</h3>
              <p className="text-gray-600">{t('idl.benefit3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-white">
        <div className="container-custom">
          <h2 className="section-title">{t('common.apply_now')}</h2>
          <div className="max-w-2xl mx-auto">
            {step === 1 && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="licenseFront" className="block text-sm font-medium text-gray-700">
                      {t('idl.license_front')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="licenseFront"
                        name="licenseFront"
                        onChange={(e) => handleFileChange(e, setLicenseFront)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="passportPage" className="block text-sm font-medium text-gray-700">
                      {t('idl.passport_page')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="passportPage"
                        name="passportPage"
                        onChange={(e) => handleFileChange(e, setPassportPage)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="personalPhoto" className="block text-sm font-medium text-gray-700">
                      {t('idl.personal_photo')}
                    </label>
                    <div className="mt-1">
                      <input
                        type="file"
                        id="personalPhoto"
                        name="personalPhoto"
                        onChange={(e) => handleFileChange(e, setPersonalPhoto)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {t('common.next')}
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-4">{t('idl.payment_title')}</h3>
                <p className="text-gray-600 mb-8">{t('idl.payment_desc')}</p>
                {/* Payment gateway integration will go here */}
                <div className="bg-gray-100 p-8 rounded-lg">
                  <p className="text-lg font-semibold">{t('idl.payment_placeholder')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternationalDrivingLicense;
