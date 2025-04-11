import axios from 'axios';
import { SignupResponse, SigninResponse } from '@/models/auth/AuthResponse';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const authService = {
  async login(username: string, password: string): Promise<SigninResponse> {
    const response = await axios.post(`${BASE_URL}/auth/signin`, { username, password });
    return response.data;
  },

  async register(email: string, password: string, username: string): Promise<SignupResponse> {
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      email,
      password,
      username,
    });
    return response.data;
  },
};