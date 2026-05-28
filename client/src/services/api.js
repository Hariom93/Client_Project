// Light-weight API service client with automatic JWT token attachment

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const apiCall = async (endpoint, options = {}) => {
  const isMultipart = options.body instanceof FormData;
  const headers = getHeaders(isMultipart);

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Client Error: ${endpoint}`, error.message);
    throw error;
  }
};
