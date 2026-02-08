import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '@api/eventService';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: string;
  createdByName: string;
  participantsCount: number;
  deletedAt: string | null;
  isCreatedByUser: boolean;
  isUserParticipant: boolean;
}

export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  total: number;
  page: number;
  pages: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  includeSoftDeleted: boolean;
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  total: 0,
  page: 1,
  pages: 0,
  isLoading: false,
  isError: false,
  error: null,
  includeSoftDeleted: false,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (
    { page, includeSoftDeleted }: { page: number; includeSoftDeleted: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await eventService.getEvents(page, includeSoftDeleted);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке событий');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Omit<Event, 'id' | 'createdBy' | 'createdByName' | 'participantsCount' | 'deletedAt' | 'isCreatedByUser' | 'isUserParticipant'>, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при создании события');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (
    { id, eventData }: { id: string; eventData: Partial<Event> },
    { rejectWithValue }
  ) => {
    try {
      const response = await eventService.updateEvent(id, eventData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при обновлении события');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при удалении события');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isError = false;
    },
    setSoftDeleteFilter: (state, action) => {
      state.includeSoftDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = state.events.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSoftDeleteFilter } = eventsSlice.actions;
export default eventsSlice.reducer;
