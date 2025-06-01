import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const createInvestment = async (data) => {
    try {
        const response = await API.post('/investments', data);
        return response.data;
    } catch (error) {
        // Log everything we got back from the server:
        console.error('–– createInvestment error.response ––\n', error.response);
        console.error('–– createInvestment error.response.data ––\n', error.response?.data);
        console.error('–– createInvestment error.message ––\n', error.message);

        // Then keep throwing so your component can handle it:
        throw new Error(
            error.response?.data?.error || 'Failed to create investment'
        );
    }

};

export const verifyPayment = async (transactionRef) => {
    try {
        const response = await API.get(`/investments/verify/${transactionRef}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const sendThankYouEmail = async (data) => {
  try {
    const response = await API.post('/send-thank-you-email', data);
    return response.data;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(
      error.response?.data?.error || 'Failed to send thank you email'
    );
  }
};