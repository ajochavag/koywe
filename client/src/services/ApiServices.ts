import axios from 'axios';
import { CurrenciesResponse } from '@/models/currencies/CurrenciesResponse';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getCurrencies(): Promise<CurrenciesResponse> {
  const response = await axios.get(`${BASE_URL}/currencies`);
  return response.data;
}