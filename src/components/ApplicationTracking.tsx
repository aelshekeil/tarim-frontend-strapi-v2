import React, { useState } from 'react';
import { Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import strapiAPI from '../lib/api';
import { APPLICATION_STATUSES } from '../lib/utils';

interface TrackingResult {
  id: number;
  type: string;
  status: string;
  tracking_id: string;
  created_at: string;
  updated_at: string;
  data: any;
}

const ApplicationTracking: React.FC = () => {
  const [trackingData, setTrackingData] = useState({
    trackingId: '',
    applicationType: '',
  });
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTrackingData({
      ...trackingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    try {
      const application = await strapiAPI.trackApplication(
        trackingData.trackingId,
        trackingData.applicationType
      );

      if (application && application.id) {
        setResult(application as TrackingResult);
      } else {
        setError('Application not found. Please check your tracking ID and application type.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to track application');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case APPLICATION_STATUSES.PENDING:
        return <Clock className="text-yellow-500" size={24} />;
      case APPLICATION_STATUSES.PROCESSING:
        return <AlertCircle className="text-blue-500" size={24} />;
      case APPLICATION_STATUSES.APPROVED:
      case APPLICATION_STATUSES.COMPLETED:
        return <CheckCircle className="text-green-500" size={24} />;
      case APPLICATION_STATUSES.REJECTED:
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <FileText className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case APPLICATION_STATUSES.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case APPLICATION_STATUSES.PROCESSING:
        return 'text-blue-600 bg-blue-100';
      case APPLICATION_STATUSES.APPROVED:
      case APPLICATION_STATUSES.COMPLETED:
        return 'text-green-600 bg-green-100';
      case APPLICATION_STATUSES.REJECTED:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatApplicationType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <section id="tracking" className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="section-title">Track Your Application</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Application Type *</label>
                <select
                  name="applicationType"
                  value={trackingData.applicationType}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Application Type</option>
                  <option value="visa">Visa Application</option>
                  <option value="driving-license">Driving License</option>
                  <option value="business">Business Incorporation</option>
                </select>
              </div>

              <div>
                <label className="form-label">Tracking ID *</label>
                <input
                  type="text"
                  name="trackingId"
                  value={trackingData.trackingId}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your tracking ID (e.g., VISA-123456)"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Track Application</span>
                  </>
                )}
              </button>
            </form>

            {error && searched && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-8 border-t pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Application Status</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(result.status)}`}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ID: {result.tracking_id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Application Type:</span>
                      <p className="text-gray-600">{formatApplicationType(result.type)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Submitted:</span>
                      <p className="text-gray-600">
                        {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Last Updated:</span>
                      <p className="text-gray-600">
                        {new Date(result.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Status:</span>
                      <p className="text-gray-600 capitalize">{result.status}</p>
                    </div>
                  </div>

                  {result.data && result.data.fullName && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">Applicant:</span>
                      <p className="text-gray-600">{result.data.fullName}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                    <p className="text-blue-700 text-sm">
                      {result.status === APPLICATION_STATUSES.PENDING && 
                        "Your application is being reviewed. We'll update you once processing begins."}
                      {result.status === APPLICATION_STATUSES.PROCESSING && 
                        "Your application is currently being processed. This may take 3-5 business days."}
                      {result.status === APPLICATION_STATUSES.APPROVED && 
                        "Congratulations! Your application has been approved. You'll receive further instructions via email."}
                      {result.status === APPLICATION_STATUSES.COMPLETED && 
                        "Your application has been completed successfully. Check your email for the final documents."}
                      {result.status === APPLICATION_STATUSES.REJECTED && 
                        "Unfortunately, your application was not approved. Please contact our support team for more information."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationTracking;

