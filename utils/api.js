import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = "https://api.posture.vision";

export async function apiPost(endpoint, data, includeAuth = false) {
  let token = null;
  if (includeAuth) {
    token = await AsyncStorage.getItem('token');
  }
  
  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });

  // Handle cases where the response might not have a body (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  let result;
  if (contentType && contentType.includes('application/json')) {
      result = await response.json();
  } else {
      // If not JSON, maybe just check if the status is OK and return success/failure
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "An error occurred");
      }
      return { success: true, status: response.status }; // Or return null, or status code
  }


  if (!response.ok) {
    // Use optional chaining in case result or result.detail is undefined
    throw new Error(result?.detail || "An error occurred");
  }
  return result;
}

export async function apiGet(endpoint, includeAuth = false) {
  let token = null;
  if (includeAuth) {
    token = await AsyncStorage.getItem('token');
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (includeAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers
  });

  // Handle cases where the response might not have a body
  const contentType = response.headers.get('content-type');
   let result;
  if (contentType && contentType.includes('application/json')) {
      result = await response.json();
  } else {
       if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "An error occurred");
      }
      return { success: true, status: response.status }; 
  }


  if (!response.ok) {
    throw new Error(result?.detail || "An error occurred");
  }
  return result;
} 