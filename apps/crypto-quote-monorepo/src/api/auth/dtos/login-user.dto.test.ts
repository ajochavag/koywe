import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

describe('LoginUserDto', () => {
  it('should validate successfully with valid email and password', async () => {
    const dto = new LoginUserDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is missing', async () => {
    const dto = new LoginUserDto();
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBe('Email is required');
  });

  it('should fail validation if email is invalid', async () => {
    const dto = new LoginUserDto();
    dto.email = 'invalid-email';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBe('Please provide a valid email address');
  });

  it('should fail validation if password is missing', async () => {
    const dto = new LoginUserDto();
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isNotEmpty).toBe('Password is required');
  });

  it('should fail validation if password is too short', async () => {
    const dto = new LoginUserDto();
    dto.email = 'test@example.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.minLength).toBe('Password must be at least 6 characters long');
  });
});
