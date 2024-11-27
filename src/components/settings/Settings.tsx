import React, { useState } from 'react';
import { Mail, Save, Check, Lock, Shield, AlertCircle } from 'lucide-react';
import { useAppointmentStore } from '../../store/appointmentStore';
import TwilioTest from './TwilioTest';

const Settings: React.FC = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [passwordVerificationCode, setPasswordVerificationCode] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowEmailVerification(true);
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode === '123456') { // Example verification
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowEmailVerification(false);
        setNewEmail('');
        setVerificationCode('');
      }, 2000);
    } else {
      setError('Invalid verification code');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Send verification code to email
    setShowPasswordVerification(true);
  };

  const handleVerifyPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordVerificationCode === '123456') { // Example verification
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowPasswordVerification(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordVerificationCode('');
      }, 2000);
    } else {
      setError('Invalid verification code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-6">Account Settings</h3>

        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Change Email
            </h4>
            {!showEmailVerification ? (
              <form onSubmit={handleEmailChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Current Email
                  </label>
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#8f00ff] text-white px-6 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors flex items-center gap-2"
                >
                  Send Verification Code
                  <Shield className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmail} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    placeholder="Enter the 6-digit code"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                    saveSuccess ? 'bg-green-600' : 'bg-[#8f00ff] hover:bg-[#7a00d9]'
                  } text-white`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Email Updated!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Verify and Update
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h4>
            {!showPasswordVerification ? (
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#8f00ff] text-white px-6 py-2 rounded-lg hover:bg-[#7a00d9] transition-colors flex items-center gap-2"
                >
                  Send Verification Code
                  <Shield className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    value={passwordVerificationCode}
                    onChange={(e) => setPasswordVerificationCode(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#8f00ff]"
                    placeholder="Enter the 6-digit code"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-400">
                    A verification code has been sent to your email address
                  </p>
                </div>
                <button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                    saveSuccess ? 'bg-green-600' : 'bg-[#8f00ff] hover:bg-[#7a00d9]'
                  } text-white`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Password Updated!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Verify and Update Password
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>
      </div>

      <TwilioTest />
    </div>
  );
};

export default Settings;