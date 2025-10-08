import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.get<User[]>("http://localhost:3000/users");
    const user = response.data.find((u) => u.email === email);
    console.log(user);

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log(10000);

      return user;
    } else {
      console.log(10001);

      return rejectWithValue("Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    return rejectWithValue("Something went wrong");
  }
});

const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
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
        state.user = action.payload;
        console.log(74);

        state.isLoggedIn = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
