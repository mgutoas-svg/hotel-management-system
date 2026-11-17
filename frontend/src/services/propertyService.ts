import api from './api';
import { Property, CreatePropertyRequest } from '../types';

export const propertyService = {
  getAll: async (city?: string, type?: string, skip = 0, take = 20): Promise<Property[]> => {
    const { data } = await api.get('/properties', {
      params: { city, type, skip, take },
    });
    return data;
  },

  getById: async (id: string): Promise<Property> => {
    const { data } = await api.get(`/properties/${id}`);
    return data;
  },

  getMyProperties: async (): Promise<Property[]> => {
    const { data } = await api.get('/properties/my-properties');
    return data;
  },

  create: async (payload: CreatePropertyRequest): Promise<Property> => {
    const { data } = await api.post('/properties', payload);
    return data;
  },

  update: async (id: string, payload: Partial<CreatePropertyRequest>): Promise<Property> => {
    const { data } = await api.put(`/properties/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
  },
};
