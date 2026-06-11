export const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || '';
export const S3_MEDIA_URL = process.env.REACT_APP_S3_MEDIA_URL || '';
export const STRIPE_KEY   = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

export const USE_MOCK =
  process.env.REACT_APP_USE_MOCK === 'true' ||
  !process.env.REACT_APP_API_GATEWAY_URL;

// Auth is controlled solely by REACT_APP_USE_MOCK_AUTH.
// It does NOT inherit from USE_MOCK — an unset API Gateway URL (no backend yet)
// must not silently switch auth to mock mode in production.
export const USE_MOCK_AUTH =
  process.env.REACT_APP_USE_MOCK_AUTH === 'true';
