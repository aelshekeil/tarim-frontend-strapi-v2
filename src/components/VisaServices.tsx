import { FC } from 'react';
import VisaApplicationForm from './VisaApplicationForm';
import AuthGuard from './AuthGuard';

const VisaServices: FC = () => {
  return (
    <AuthGuard
      requireAuth={true}
      fallbackMessage="Please log in to submit a visa application. This helps us track your application status and provide personalized service."
    >
      <section className="py-20 bg-white min-h-screen">
        <div className="container-custom">
          <h2 className="section-title">Apply for Visa</h2>
          <VisaApplicationForm />
        </div>
      </section>
    </AuthGuard>
  );
};

export default VisaServices;
