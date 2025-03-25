import { AuthError } from '../application/exceptions/auth.error.enum';

export const RegisterOperation = {
  summary: 'Register a new user',
  description:
    'Creates a new user account with the provided email and password',
};

export const LoginOperation = {
  summary: 'Login user',
  description: 'Authenticates a user and returns access and refresh tokens',
};

export const RefreshTokenOperation = {
  summary: 'Refresh JWT token',
  description:
    'Generates new access and refresh tokens using a valid refresh token',
};

const TokenResponseSchema = {
  properties: {
    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
    username: { type: 'string', example: 'john.doe@example.com' },
    accessToken: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      description: 'JWT access token valid for 15 minutes',
    },
    refreshToken: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      description: 'JWT refresh token valid for 7 days',
    },
  },
};

export const RegisterResponses = {
  CREATED: {
    status: 201,
    description: 'User created successfully',
    schema: TokenResponseSchema,
  },
  USER_EXISTS: {
    status: 409,
    description: AuthError.USER_ALREADY_EXISTS,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: AuthError.USER_ALREADY_EXISTS },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  },
  CREATION_ERROR: {
    status: 409,
    description: AuthError.FAILED_TO_CREATE_USER,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: AuthError.FAILED_TO_CREATE_USER },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  },
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid registration data',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          example: [
            'username must be an email',
            'The password must have a Uppercase, lowercase letter and a number',
            'password must be longer than or equal to 6 characters',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  },
};

export const LoginResponses = {
  SUCCESS: {
    status: 200,
    description: 'User logged in successfully',
    schema: TokenResponseSchema,
  },
  UNAUTHORIZED: {
    status: 401,
    description: AuthError.INVALID_CREDENTIALS,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: AuthError.INVALID_CREDENTIALS },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  },
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid login data',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          example: [
            'username must be an email',
            'password should not be empty',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  },
};

export const RefreshTokenResponses = {
  SUCCESS: {
    status: 200,
    description: 'Tokens refreshed successfully',
    schema: TokenResponseSchema,
  },
  UNAUTHORIZED: {
    status: 401,
    description: AuthError.INVALID_TOKEN,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: AuthError.INVALID_TOKEN },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  },
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid token format',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          example: ['token must be a valid JWT'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  },
};
