import axiosInstance from './axios';
import type { Event, EventListParams } from '../types';

export interface EventsResponse {
  data: Event[];
  total: number;
  page: number;
  pages: number;
}

export const eventService = {
  getEvents: async (
    page: number = 1,
    includeSoftDeleted: boolean = false,
    createdBy?: string
  ): Promise<EventsResponse> => {
    const response = await axiosInstance.get<EventsResponse>('/events', {
      params: {
        page,
        limit: 10,
        ...(includeSoftDeleted && { includeSoftDeleted: 'true' }),
        ...(createdBy && { createdBy }),
      },
    });
    return response.data;
  },

  getAllEvents: async (params?: EventListParams): Promise<Event[]> => {
    const response = await axiosInstance.get<EventsResponse>('/events', {
      params: {
        ...(params?.includeSoftDeleted && { includeSoftDeleted: 'true' }),
      },
    });
    return response.data.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await axiosInstance.get<Event>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: {
    title: string;
    description: string;
    date: string;
    createdBy: string;
  }): Promise<any> => {
    const response = await axiosInstance.post('/events', data);
    return response.data;
  },

  updateEvent: async (
    id: number | string,
    data?: { title?: string; description?: string; date?: string }
  ): Promise<any> => {
    const response = await axiosInstance.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },

  joinEvent: async (id: number | string): Promise<void> => {
    await axiosInstance.post(`/events/${id}/join`);
  },

  getParticipants: async (id: number): Promise<any[]> => {
    const response = await axiosInstance.get(`/events/${id}/participants`);
    return response.data;
  },
};
