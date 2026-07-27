import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Auth APIs
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await apiClient.post('/auth/send-otp', {
      phone_number: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyOTP = async (phoneNumber, otpCode) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', {
      phone_number: phoneNumber,
      otp_code: otpCode,
    });
    if (response.data.user_id) {
      await AsyncStorage.setItem('userId', String(response.data.user_id));
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (phoneNumber, name, age, language = 'en') => {
  try {
    const response = await apiClient.post('/auth/register', {
      phone_number: phoneNumber,
      name,
      age,
      language,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await apiClient.get(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Journey APIs
export const addJourneyStep = async (userId, stepType, description) => {
  try {
    const response = await apiClient.post('/journey/add-step', {
      user_id: userId,
      step_type: stepType,
      description,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserJourney = async (userId) => {
  try {
    const response = await apiClient.get(`/journey/user/${userId}/journey`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteJourneyStep = async (stepId) => {
  try {
    const response = await apiClient.delete(`/journey/step/${stepId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Referral APIs
export const scanReferral = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/referral/scan-referral', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const parseReferral = async (text) => {
  try {
    const response = await apiClient.post('/referral/parse-referral', {
      text,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default apiClient;
