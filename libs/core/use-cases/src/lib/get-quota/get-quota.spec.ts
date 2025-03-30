import { QuotaExpiredException, quotaMock, QuotaNotFoundException } from '@monorepo/core-domain';
import { quotaServiceMock } from '@monorepo/core-domain-services';
import { GetQuotaUseCase } from './get-quota';

describe('GetQuotaUseCase', () => {
  let useCase: GetQuotaUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetQuotaUseCase(quotaServiceMock);
  });

  it('should get a valid quota successfully', async () => {
    const validQuota = {
      ...quotaMock,
      expiresAt: new Date(Date.now() + 1000 * 60),
    };

    jest.spyOn(quotaServiceMock, 'get').mockResolvedValue(validQuota);

    const result = await useCase.execute('123');

    expect(result).toEqual(validQuota);
    expect(quotaServiceMock.get).toHaveBeenCalledWith('123');
  });

  it('should throw QuotaNotFoundException when quota does not exist', async () => {
    jest.spyOn(quotaServiceMock, 'get').mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(QuotaNotFoundException);
    expect(quotaServiceMock.get).toHaveBeenCalledWith('non-existent-id');
  });

  it('should throw QuotaExpiredException when quota is expired', async () => {
    const expiredQuota = {
      ...quotaMock,
      expiresAt: new Date(Date.now() - 1000 * 60),
    };

    jest.spyOn(quotaServiceMock, 'get').mockResolvedValue(expiredQuota);

    await expect(useCase.execute('expired-id')).rejects.toThrow(QuotaExpiredException);
    expect(quotaServiceMock.get).toHaveBeenCalledWith('expired-id');
  });
});
