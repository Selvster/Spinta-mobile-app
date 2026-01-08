const ENV = {
  dev: {
    API_BASE_URL: 'https://spinta-backend.vercel.app/api',
  },
  staging: {
    API_BASE_URL: 'https://spinta-backend.vercel.app/api',
  },
  prod: {
    API_BASE_URL: 'https://spinta-backend.vercel.app/api',
  },
};

const getEnvVars = () => {
  if (__DEV__) return ENV.dev;
  // You can add more logic here for staging/prod detection
  return ENV.prod;
};

const envVars = getEnvVars();

export const API_BASE_URL = envVars.API_BASE_URL;

// Cloudinary Configuration
// Replace these with your actual Cloudinary credentials
export const CLOUDINARY_CONFIG = {
  cloudName: 'dyfsrdy5o', // e.g., 'dxyz123abc'
  uploadPreset: 'Spinta', // e.g., 'spinta_mobile'
};
