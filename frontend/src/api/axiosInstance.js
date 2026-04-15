import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error('[axiosInstance] VITE_API_URL is not defined. Check your .env file or Vercel environment variables.');
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Language
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('tab_token') || localStorage.getItem('petal_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add language preference (skip for auth/google to avoid polluting OAuth callback)
    const lang = localStorage.getItem('petal_lang') || 'en';
    config.params = { ...config.params, lang };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[API Error] ${error.response.status} - ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      console.error(`[API Error] No response received from ${error.config?.url}`, error.request);
    } else {
      console.error(`[API Error] Request setup failed:`, error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
