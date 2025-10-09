// features/user/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:3000/users";

// User Type
export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password?: string;
}

// Slice State
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Fetch user by ID dynamically
export const fetchUserProfile = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("user/fetchProfile", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get<User>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Error fetching user"
    );
  }
});

// Update user
export const updateUserProfile = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("user/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const response = await axios.put<User>(
      `${API_URL}/${profileData.id}`,
      profileData
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Error updating user"
    );
  }
});

// Add user
export const addUser = createAsyncThunk<
  User,
  Omit<User, "id">,
  { rejectValue: string }
>("user/addUser", async (newUser, { rejectWithValue }) => {
  try {
    const response = await axios.post<User>(API_URL, newUser);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Error adding user");
  }
});

// Slice
const profileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      })
      // Update
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })
      // Add
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      });
  },
});

export default profileSlice.reducer;
