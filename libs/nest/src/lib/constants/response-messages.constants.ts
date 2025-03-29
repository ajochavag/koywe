export const DEFAULT_BAD_REQUEST_ERROR_MESSAGE = 'There was an error on your request';

export const DEFAULT_NOT_FOUND_ERROR_MESSAGE = 'The resource you are trying to fetch does not exist';

export const DEFAULT_UNAUTHORIZED_ERROR_MESSAGE = 'You need to authenticate to proceed';

export const DEFAULT_FORBIDDEN_ERROR_MESSAGE = 'You are not authorized to see or do the required resource/action';

export const DEFAULT_ERROR_DESCRIPTION = 'At the moment we cant handle your request';

export const DEFAULT_ERROR_TITLE = 'We are sorry, an error happened';

export const STANDARD_HTTP_CODES_MESSAGES = {
  400: DEFAULT_BAD_REQUEST_ERROR_MESSAGE,
  404: DEFAULT_NOT_FOUND_ERROR_MESSAGE,
  401: DEFAULT_UNAUTHORIZED_ERROR_MESSAGE,
  403: DEFAULT_FORBIDDEN_ERROR_MESSAGE,
  500: DEFAULT_ERROR_DESCRIPTION,
};
