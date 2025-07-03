import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../hooks/useApplication';

const ApplicationTracking: FC = () => {
  const { t } = useTranslation();
  const [trackingId, setTrackingId] = useState('');
  const { loading, error, applicationStatus, track } = useApplication();

  const handleTrack = () => {
    if (trackingId) {
      track(trackingId);
    }
  };

  return (
    <div className="container-custom py-20">
      <h2 className="section-title">{t('tracking.title')}</h2>
      <div className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder={t('tracking.placeholder')}
            className="flex-grow p-2 border rounded-md"
          />
          <button
            onClick={handleTrack}
            disabled={loading || !trackingId}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? t('common.loading') : t('tracking.track_button')}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {applicationStatus && (
          <div className="mt-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold">{t('tracking.status_title')}</h3>
            <div className="mt-2">
              <p><strong>{t('tracking.tracking_number')}:</strong> {applicationStatus.data.trackingNumber}</p>
              <p><strong>{t('tracking.current_status')}:</strong> {applicationStatus.data.currentStatus}</p>
              <p><strong>{t('tracking.submission_date')}:</strong> {applicationStatus.data.submissionDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracking;
