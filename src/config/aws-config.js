export const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || '';
export const S3_MEDIA_URL = process.env.REACT_APP_S3_MEDIA_URL || '';
export const STRIPE_KEY   = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

export const USE_MOCK =
  process.env.REACT_APP_USE_MOCK === 'true' ||
  !process.env.REACT_APP_API_GATEWAY_URL;

// Auth can be mocked independently of data services.
// If REACT_APP_USE_MOCK_AUTH is not set, it follows USE_MOCK.
export const USE_MOCK_AUTH =
  process.env.REACT_APP_USE_MOCK_AUTH !== undefined
    ? process.env.REACT_APP_USE_MOCK_AUTH === 'true'
    : USE_MOCK;
