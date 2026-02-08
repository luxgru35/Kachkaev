import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@api/authService';
import { tokenUtils } from '@utils/tokenUtils';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const getInitialUser = (): User | null => {
  const u = tokenUtils.getUser();
  if (!u) return null;
  return { ...u, id: String(u.id) };
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: tokenUtils.getToken(),
  isLoading: false,
  isError: false,
  error: null,
  isAuthenticated: !!tokenUtils.getToken(),
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.email, credentials.password);
      tokenUtils.setToken(response.token);
      tokenUtils.setUser(response.user);
      const user = { ...response.user, id: String(response.user.id) };
      return { user, token: response.token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при входе');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error: any) {
    // Token might be expired - still clear local state
  } finally {
    tokenUtils.logout();
  }
});

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    credentials: { email: string; password: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(
        credentials.name,
        credentials.email,
        credentials.password
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Ошибка при регистрации');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      tokenUtils.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.isError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
