const production = process.env.REACT_APP_ENV_NAME === 'prod';
export const backendBaseUrl = production ? 'https://curriculo-apit-backend.herokuapp.com' : 'http://localhost:3000';
export const frontendBaseUrl = production ? 'https://curriculo-apit-frontend.herokuapp.com' : 'http://localhost:3002';

export const getHeaders = () => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  const token = localStorage.getItem('token');

  if (token) {
    headers.append('access-token', token);
  }

  return headers;
};

export const buildQuery = (query: any): string => {
  const urlParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => urlParams.append(key, `${value}`));
  return urlParams.toString();
};
