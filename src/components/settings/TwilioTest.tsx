import React, { useState } from 'react';
import { Send, AlertCircle, Check } from 'lucide-react';
import { sendTestSMS, SMSResponse } from '../../api/test';

const TwilioTest: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Format phone number to E.164 format if needed
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const response = await sendTestSMS(formattedNumber, message);
      
      if (response.success) {
        setSuccess(true);
        setPhoneNumber('');
        setMessage('');
      } else {
        setError(response.error || 'Failed to send SMS');
      }
    } catch (err) {
      setError('Failed to send SMS. Please check your phone number format and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6">Test SMS Notifications</h3>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
            placeholder="+447123456789"
            required
          />
          <p className="mt-1 text-sm text-gray-400">
            Enter number in E.164 format (e.g., +447123456789)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff] resize-y"
            rows={3}
            placeholder="Enter your test message"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-4 h-4" />
            <span className="whitespace-pre-wrap">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-500">
            <Check className="w-4 h-4" />
            SMS sent successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#8f00ff] text-white px-6 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            'Sending...'
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Test SMS
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TwilioTest;