import React, { useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle, X } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useCalendarStore } from '../../store/calendarStore';

interface GoogleCalendarConnectProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleCalendarConnect: React.FC<GoogleCalendarConnectProps> = ({
  onSuccess,
  onError,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const { isConnected, setTokens, disconnect, error, clearError } = useCalendarStore();

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setTokens({
          access_token: response.access_token,
          expires_in: response.expires_in,
        });
        setShowPopup(false);
        onSuccess?.();
      } catch (error) {
        console.error('Google Calendar connection failed:', error);
        onError?.('Failed to connect to Google Calendar');
      }
    },
    onError: () => {
      onError?.('Failed to connect to Google Calendar');
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
  });

  const handleConnect = () => {
    clearError();
    if (isConnected) {
      disconnect();
    } else {
      setShowPopup(true);
    }
  };

  return (
    <>
      <button
        onClick={handleConnect}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isConnected
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-[#8f00ff] hover:bg-[#7a00d9]'
        } text-white`}
      >
        <CalendarIcon className="w-4 h-4" />
        {isConnected ? 'Connected' : 'Connect Calendar'}
      </button>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Connect Google Calendar</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-400">
                We need permission to:
              </p>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>View and manage your calendar</li>
                <li>Create and modify events</li>
                <li>Sync your appointments automatically</li>
              </ul>
              
              <p className="text-gray-400">
                You can revoke access at any time from your Google Account settings
                or by disconnecting here.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => login()}
                  className="flex-1 bg-[#8f00ff] text-white py-2 px-4 rounded-lg hover:bg-[#7a00d9] transition-colors"
                >
                  Connect with Google
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleCalendarConnect;