import api from './api';
import { Reservation, CreateReservationRequest } from '../types';

export const reservationService = {
  create: async (payload: CreateReservationRequest): Promise<Reservation> => {
    const { data } = await api.post('/reservations', payload);
    return data;
  },

  getById: async (id: string): Promise<Reservation> => {
    const { data } = await api.get(`/reservations/${id}`);
    return data;
  },

  getByProperty: async (propertyId: string, status?: string, skip = 0, take = 50): Promise<Reservation[]> => {
    const { data } = await api.get(`/reservations/property/${propertyId}`, {
      params: { status, skip, take },
    });
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<Reservation> => {
    const { data } = await api.patch(`/reservations/${id}/status`, { status });
    return data;
  },

  getOccupancyReport: async (propertyId: string, startDate: string, endDate: string) => {
    const { data } = await api.get(`/reservations/property/${propertyId}/occupancy`, {
      params: { startDate, endDate },
    });
    return data;
  },
};
