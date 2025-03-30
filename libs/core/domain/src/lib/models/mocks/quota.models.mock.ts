import { Quota } from '../quota.models';

export const quotaMock: Quota = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  from: 'BTC',
  to: 'CLP',
  amount: 1,
  rate: 25000000,
  convertedAmount: 25000000,
  timestamp: new Date('2024-01-10T12:00:00Z'),
  expiresAt: new Date('2024-01-10T12:15:00Z'),
};
