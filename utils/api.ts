import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e031cba6`;

// Helper function to get stored token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('access_token');
};

// Helper function to make authenticated requests
const makeRequest = async (
  endpoint: string,
  options: RequestInit = {},
  useAuthToken = false
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${useAuthToken ? getAuthToken() : publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
  signUp: async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    age?: string;
    gender?: string;
    isAdmin?: boolean;
  }) => {
    return makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return makeRequest('/auth/profile', {}, true);
  },
};

// ============================================================================
// ROOMS API
// ============================================================================

export const roomsAPI = {
  getAll: async () => {
    return makeRequest('/rooms');
  },

  updateAvailability: async (roomId: string, available: boolean) => {
    return makeRequest(`/rooms/${roomId}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ available }),
    }, true);
  },
};

// ============================================================================
// SERVICES API
// ============================================================================

export const servicesAPI = {
  getAll: async () => {
    return makeRequest('/services');
  },
};

// ============================================================================
// BOOKINGS API
// ============================================================================

export const bookingsAPI = {
  create: async (bookingData: {
    roomId: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    customerDetails: {
      name: string;
      age: number;
      gender: string;
      contact: string;
      validId: string;
    };
    selectedServices: string[];
    pricing: {
      totalDays: number;
      roomCharges: number;
      serviceCharges: number;
      gst: number;
      grandTotal: number;
    };
  }) => {
    return makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }, true);
  },

  getAll: async () => {
    return makeRequest('/bookings', {}, true);
  },

  getMyBookings: async () => {
    return makeRequest('/bookings/my-bookings', {}, true);
  },

  searchByEmail: async (email: string) => {
    return makeRequest(`/bookings/search?email=${encodeURIComponent(email)}`, {}, true);
  },

  cancel: async (bookingId: string) => {
    return makeRequest(`/bookings/${bookingId}`, {
      method: 'DELETE',
    }, true);
  },

  update: async (bookingId: string, updates: any) => {
    return makeRequest(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, true);
  },
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthCheck = async () => {
  return makeRequest('/health');
};