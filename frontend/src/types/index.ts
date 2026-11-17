// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff' | 'guest';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Property Types
export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  totalRooms: number;
  propertyType: string;
  stars: number;
  amenities: string[];
  checkInTime: number;
  checkOutTime: number;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest extends Omit<Property, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'> {}

// Reservation Types
export interface Reservation {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  totalPrice: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingSource: string;
  externalBookingId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest extends Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> {}

// API Response
export interface ApiResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  error?: string;
}
