'use client';
import axios from 'axios';
import { QuoteRequest, QuoteResponse } from '@/models/quote/quote';

const BASE_URL = 'http://localhost:8000/quote';

export const createQuote = async (data: QuoteRequest): Promise<QuoteResponse> => {
  const response = await axios.post(BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('KOWEY-JHjskEJEk3ksojñ-SWAP')}`,
    },
  });
  return response.data;
};

export const getQuoteById = async (id: string): Promise<QuoteResponse> => {
  const response = await axios.get(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('KOWEY-JHjskEJEk3ksojñ-SWAP')}`,
    },
  });
  return response.data;
};