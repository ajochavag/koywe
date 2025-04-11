import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const authService = {
  async login(username: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        username,
        password,
      });
      return response.data; // { access_token }
    } catch (error: any) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  async register(email: string, password: string, username: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        username,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Error al registrarse' };
    }
  },
};
