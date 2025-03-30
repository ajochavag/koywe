import { of, throwError } from 'rxjs';
import { CryptomktResponse } from '../../../models/responses/cryptomkt.models';
import { CryptomktServiceImpl } from './cryptomkt.service';

describe('CryptomktServiceImpl', () => {
  let service: CryptomktServiceImpl;
  const httpService = {
    get: jest.fn(),
    post: jest.fn(),
  } as any;

  beforeEach(async () => {
    service = new CryptomktServiceImpl(httpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    const mockResponse = {
      'BTC-CLP': {
        timestamp: '2024-01-01T00:00:00',
        bid: '40000000',
        ask: '40100000',
        last_price: '40050000',
        volume: '1.5',
      },
    };

    it('should return cryptomkt data successfully', async () => {
      httpService.get.mockReturnValue(of({ data: mockResponse }));

      const result = await service.get('BTC', 'CLP');

      expect(result).toBeInstanceOf(CryptomktResponse);
      expect(result).toEqual(
        expect.objectContaining({
          timestamp: '2024-01-01T00:00:00',
          bid: '40000000',
          ask: '40100000',
          last_price: '40050000',
          volume: '1.5',
        }),
      );
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error');
      httpService.get.mockReturnValue(throwError(() => error));

      await expect(service.get('BTC', 'CLP')).rejects.toThrow('API Error');
      expect(httpService.get).toHaveBeenCalledTimes(1);
    });
  });
});
