import axiosInstance from './axios';
import type { Event, EventListParams } from '../types';

export const eventService = {
  getAllEvents: async (params?: EventListParams): Promise<Event[]> => {
    const response = await axiosInstance.get<{
      data: Event[];
      total: number;
      page: number;
      pages: number;
    }>('/events', {
      params: {
        ...(params?.includeSoftDeleted && { includeSoftDeleted: true }),
      },
    });
    return response.data.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await axiosInstance.get<Event>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (
    title: string,
    description: string,
    date: string
  ): Promise<Event> => {
    const response = await axiosInstance.post<Event>('/events', {
      title,
      description,
      date,
    });
    return response.data;
  },

  updateEvent: async (
    id: number,
    title?: string,
    description?: string,
    date?: string
  ): Promise<Event> => {
    const response = await axiosInstance.put<Event>(`/events/${id}`, {
      ...(title && { title }),
      ...(description && { description }),
      ...(date && { date }),
    });
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },

  joinEvent: async (id: number): Promise<void> => {
    await axiosInstance.post(`/events/${id}/join`);
  },

  getParticipants: async (id: number): Promise<any[]> => {
    const response = await axiosInstance.get(`/events/${id}/participants`);
    return response.data;
  },
};
