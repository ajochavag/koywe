import { QuoteError } from '../application/exceptions/quote.error.enum';
import { currency } from '../domain/currency.enum';

export const GetQuoteOperation = {
  summary: 'Get a quote by ID',
  description:
    'Retrieves a specific quote using its UUID. The quote must not be expired.',
};

export const CreateQuoteOperation = {
  summary: 'Create a new quote',
  description:
    'Creates a new quote for currency conversion. The quote will be valid for 5 minutes.',
};

const QuoteSchema = {
  properties: {
    id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
    amount: { type: 'number', example: 100 },
    from: {
      type: 'string',
      enum: Object.values(currency),
      example: currency.USDC,
    },
    to: {
      type: 'string',
      enum: Object.values(currency),
      example: currency.CLP,
    },
    rate: { type: 'number', example: 850.5 },
    convertedAmount: { type: 'number', example: 85050 },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-01T00:00:00.000Z',
    },
    expiresAt: {
      type: 'string',
      format: 'date-time',
      example: '2024-01-01T00:05:00.000Z',
    },
  },
};

export const GetQuoteResponses = {
  SUCCESS: {
    status: 200,
    description: 'Quote retrieved successfully',
    schema: QuoteSchema,
  },
  NOT_FOUND: {
    status: 404,
    description: QuoteError.QUOTE_NOT_FOUND,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: QuoteError.QUOTE_NOT_FOUND },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  },
  EXPIRED: {
    status: 410,
    description: QuoteError.QUOTE_EXPIRED,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 410 },
        message: { type: 'string', example: QuoteError.QUOTE_EXPIRED },
        error: { type: 'string', example: 'Gone' },
      },
    },
  },
  RETRIEVAL_ERROR: {
    status: 409,
    description: QuoteError.FAILED_TO_GET_QUOTE,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: QuoteError.FAILED_TO_GET_QUOTE },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  },
  UNAUTHORIZED: {
    status: 401,
    description: 'User credentials are invalid',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  },
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid UUID format',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Validation failed (uuid v 4 is expected)',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  },
};

export const CreateQuoteResponses = {
  CREATED: {
    status: 201,
    description: 'Quote created successfully',
    schema: QuoteSchema,
  },
  CREATION_ERROR: {
    status: 409,
    description: QuoteError.FAILED_TO_CREATE_QUOTE,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: QuoteError.FAILED_TO_CREATE_QUOTE },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  },
  BAD_REQUEST: {
    status: 400,
    description: 'Invalid quote data',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          example: [
            'amount must be a positive number',
            'from must be one of the following values: ARS, CLP, MXN, USDC, BTC, ETH',
            'to must be one of the following values: ARS, CLP, MXN, USDC, BTC, ETH',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  },
  UNAUTHORIZED: {
    status: 401,
    description: 'User credentials are invalid',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  },
};
