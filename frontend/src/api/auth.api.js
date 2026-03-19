import axiosInstance from './axiosInstance';

export const googleAuth = async (code, redirectUri) => {
  const response = await axiosInstance.post('/auth/google', {
    code,
    redirect_uri: redirectUri
  });
  return response.data;
};

export const authApi = {
  login: async (email, password) => {
    // FastAPI OAuth2PasswordRequestForm expects x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects 'username' field
    formData.append('password', password);
    
    // Send as form-urlencoded
    const response = await axiosInstance.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
