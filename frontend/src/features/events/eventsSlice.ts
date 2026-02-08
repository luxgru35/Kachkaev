import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventService } from '@api/eventService';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
  createdByName: string;
  participantsCount: number;
  deletedAt: string | null;
  isCreatedByUser: boolean;
  isUserParticipant: boolean;
}

export interface EventsState {
  events: Event[];
  userEvents: Event[];
  currentEvent: Event | null;
  total: number;
  page: number;
  pages: number;
  isLoading: boolean;
  isUserEventsLoading: boolean;
  isError: boolean;
  error: string | null;
  includeSoftDeleted: boolean;
}

const initialState: EventsState = {
  events: [],
  userEvents: [],
  currentEvent: null,
  total: 0,
  page: 1,
  pages: 0,
  isLoading: false,
  isUserEventsLoading: false,
  isError: false,
  error: null,
  includeSoftDeleted: false,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (
    {
      page,
      includeSoftDeleted,
      createdBy,
    }: { page: number; includeSoftDeleted: boolean; createdBy?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await eventService.getEvents(page, includeSoftDeleted, createdBy);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке событий');
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'events/fetchUserEvents',
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvents(1, false, String(userId));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при загрузке мероприятий');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (
    eventData: { title: string; description: string; date: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { auth: { user: { id: string } | null } };
      const userId = state.auth.user?.id;
      if (!userId) {
        return rejectWithValue('Пользователь не авторизован');
      }
      const response = await eventService.createEvent({
        ...eventData,
        createdBy: userId,
      });
      return {
        ...response,
        id: String(response.id),
        createdBy: userId,
        createdByName: response.creator?.name || '',
        participantsCount: 0,
        deletedAt: null,
        isCreatedByUser: true,
        isUserParticipant: false,
      };
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

export const joinEvent = createAsyncThunk(
  'events/joinEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await eventService.joinEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при присоединении к событию');
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
        state.events = action.payload.data.map((e: any) => ({
          ...e,
          id: String(e.id),
          createdByName: e.creator?.name ?? e.createdByName ?? '',
          participantsCount: e.participantsCount ?? 0,
          isCreatedByUser: e.isCreatedByUser ?? false,
          isUserParticipant: e.isUserParticipant ?? false,
        }));
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(fetchUserEvents.pending, (state) => {
        state.isUserEventsLoading = true;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.isUserEventsLoading = false;
        state.userEvents = action.payload.data.map((e: any) => ({
          ...e,
          id: String(e.id),
          createdByName: e.creator?.name ?? e.createdByName ?? '',
          participantsCount: e.participantsCount ?? 0,
          isCreatedByUser: e.isCreatedByUser ?? true,
          isUserParticipant: e.isUserParticipant ?? false,
        }));
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.isUserEventsLoading = false;
        state.userEvents = [];
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
      })
      .addCase(joinEvent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.events.findIndex((e) => e.id === action.payload);
        if (index !== -1) {
          state.events[index] = {
            ...state.events[index],
            participantsCount: (state.events[index].participantsCount || 0) + 1,
            isUserParticipant: true,
          };
        }
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSoftDeleteFilter } = eventsSlice.actions;
export default eventsSlice.reducer;
