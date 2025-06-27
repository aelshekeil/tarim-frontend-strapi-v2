import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TrackingResult {
  id: string;
  type: string;
  status: string;
  tracking_id: string;
  created_at: string;
  full_name: string;
  nationality: string;
}

const ApplicationTracking: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateTrackingId = (id: string): boolean => {
    // Example validation: tracking ID should be alphanumeric and 8-12 characters
    const regex = /^[A-Za-z0-9]{8,12}$/;
    return regex.test(id.trim());
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    
    const trimmedId = trackingId.trim();
    
    if (!trimmedId) {
      setError('Please enter a tracking ID');
      return;
    }

    if (!validateTrackingId(trimmedId)) {
      setError('Please enter a valid tracking ID (8-12 alphanumeric characters)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/application-submissions/${trimmedId}?populate=*`);
      const data = await response.json();
      
      if (response.ok) {
        const application = data.data;
        setResult({
          id: application.id,
          type: application.attributes.type,
          status: application.attributes.status,
          tracking_id: application.attributes.tracking_id,
          created_at: application.attributes.createdAt,
          full_name: application.attributes.full_name,
          nationality: application.attributes.nationality,
        });
      } else {
        switch (response.status) {
          case 404:
            setError('Application not found. Please check your tracking ID.');
            break;
          case 403:
            setError('Access denied. Please verify your tracking ID.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(data.error?.message || 'Failed to retrieve application details');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Your Application</h2>
        <p className="text-gray-600">Enter your tracking ID to check the status of your application</p>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter your Tracking ID (e.g., ABC123XYZ)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isLoading}
              aria-label="Tracking ID"
              maxLength={12}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Tracking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Application Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Full Name</p>
              <p className="text-gray-900">{result.full_name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Nationality</p>
              <p className="text-gray-900">{result.nationality}</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Application Type</p>
              <p className="text-gray-900 capitalize">{result.type}</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Status</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)}
                <span className="font-semibold capitalize">{result.status}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Tracking ID</p>
              <p className="text-gray-900 font-mono text-sm bg-white px-2 py-1 rounded border">{result.tracking_id}</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-semibold text-gray-700">Submitted On</p>
              <p className="text-gray-900">{new Date(result.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          {result.status.toLowerCase() === 'pending' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Your application is currently being reviewed. You will be notified once a decision has been made.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracking;