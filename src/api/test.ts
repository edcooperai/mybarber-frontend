import api from './axios';

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: {
    to?: string;
    status?: string;
    direction?: string;
    dateCreated?: string;
  };
}

export const sendTestSMS = async (to: string, message: string): Promise<SMSResponse> => {
  try {
    const response = await api.post('/test/sms', { to, message });
    return response.data;
  } catch (error: any) {
    // Ensure we only return serializable data
    const errorResponse: SMSResponse = {
      success: false,
      error: error?.response?.data?.error || error?.message || 'Failed to send SMS',
      details: error?.response?.data?.details || {}
    };
    return errorResponse;
  }
};