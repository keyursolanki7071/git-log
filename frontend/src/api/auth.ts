import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/users';

export const authApi = {
  signup: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/signup`, { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email); // OAuth2 expects 'username'
    params.append('password', password);

    const response = await axios.post(`${API_URL}/login`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Save token to local storage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },
};
