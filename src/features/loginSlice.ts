import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define a User type (based on your JSON server schema)
export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  cell?: string;
}

// Define slice state
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  User, // ✅ Return type
  { email: string; password: string }, // ✅ Argument type
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>("http://localhost:3000/users");

    const user = response.data.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      return user; // ✅ returns User
    } else {
      return rejectWithValue("Invalid email or password");
    }
  } catch (error) {
    console.log(error);
    return rejectWithValue("Something went wrong");
  }
});

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload; // ✅ user is typed properly
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
