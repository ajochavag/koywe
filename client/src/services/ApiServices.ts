import axios from 'axios';
import { CurrenciesResponse } from '@/models/currencies/CurrenciesResponse';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!BASE_URL) {
  console.error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

export async function getCurrencies(): Promise<CurrenciesResponse> {
  const response = await axios.get(`${BASE_URL}/currencies`);
  return response.data;
}