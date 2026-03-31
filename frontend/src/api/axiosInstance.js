import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// #region agent log
fetch('http://127.0.0.1:7248/ingest/b54e18c9-28e3-44a2-899c-030a6502b734',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06837a'},body:JSON.stringify({sessionId:'06837a',runId:'pre-fix',hypothesisId:'H2',location:'frontend/src/api/axiosInstance.js:5',message:'axios baseURL resolved',data:{baseURL,envKeys:{VITE_API_BASE_URL:!!import.meta.env.VITE_API_BASE_URL,VITE_API_URL:!!import.meta.env.VITE_API_URL}},timestamp:Date.now()})}).catch(()=>{});
// #endregion

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
    
    // Add language preference
    const lang = localStorage.getItem('petal_lang') || 'en';
    config.params = { ...config.params, lang };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
