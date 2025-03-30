import { cryptomktMock } from '@monorepo/core-domain';
import { cryptomktServiceMock, quotaServiceMock } from '@monorepo/core-domain-services';
import { CreateQuotaUseCase } from './create-quota';

describe('CreateQuotaUseCase', () => {
  let useCase: CreateQuotaUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateQuotaUseCase(cryptomktServiceMock, quotaServiceMock);
  });

  it('should create a quota successfully', async () => {
    const input = {
      from: 'BTC',
      to: 'CLP',
      amount: 1,
    };

    jest.spyOn(cryptomktServiceMock, 'get').mockResolvedValue(cryptomktMock);
    jest.spyOn(quotaServiceMock, 'create').mockResolvedValue();

    const result = await useCase.execute(input);

    expect(result).toMatchObject({
      from: input.from,
      to: input.to,
      amount: input.amount,
      rate: parseFloat(cryptomktMock.price),
      convertedAmount: input.amount * parseFloat(cryptomktMock.price),
    });
    expect(result.id).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.expiresAt).toBeDefined();
    expect(cryptomktServiceMock.get).toHaveBeenCalledWith('BTC', 'CLP');
    expect(quotaServiceMock.create).toHaveBeenCalled();
  });

  it('should throw error when missing from field', async () => {
    const input = {
      to: 'CLP',
      amount: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Both "from" and "to" fields are required.');
  });

  it('should throw error when missing to field', async () => {
    const input = {
      from: 'BTC',
      amount: 1,
    };

    await expect(useCase.execute(input)).rejects.toThrow('Both "from" and "to" fields are required.');
  });

  it('should throw error when missing amount field', async () => {
    const input = {
      from: 'BTC',
      to: 'CLP',
    };

    await expect(useCase.execute(input)).rejects.toThrow('"amount" field is required.');
  });
});
