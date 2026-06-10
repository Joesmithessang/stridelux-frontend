import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || '',
      userPoolClientId: process.env.REACT_APP_COGNITO_CLIENT_ID || '',
      region: process.env.REACT_APP_COGNITO_REGION || 'us-east-1',
      loginWith: { email: true },
    },
  },
});

export const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL || '';
export const S3_MEDIA_URL = process.env.REACT_APP_S3_MEDIA_URL || '';
export const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';
export const USE_MOCK =
  process.env.REACT_APP_USE_MOCK === 'true' ||
  !process.env.REACT_APP_API_GATEWAY_URL;
