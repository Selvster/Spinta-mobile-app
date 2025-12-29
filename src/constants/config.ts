const ENV = {
  dev: {
    API_BASE_URL: 'http://localhost:3000/api',
  },
  staging: {
    API_BASE_URL: 'https://staging-api.spinta.com/api',
  },
  prod: {
    API_BASE_URL: 'https://api.spinta.com/api',
  },
};

const getEnvVars = () => {
  if (__DEV__) return ENV.dev;
  // You can add more logic here for staging/prod detection
  return ENV.prod;
};

const envVars = getEnvVars();

export const API_BASE_URL = envVars.API_BASE_URL;
