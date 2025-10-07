// features/auth/registerSlice.ts
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define the interface for your form data
export interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  cpassword: string;
  shoppingLists: [];
}

// Define the state type
interface RegisterState {
  user: RegisterFormData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Async thunk
export const registerUser = createAsyncThunk<
  RegisterFormData, // return type
  RegisterFormData, // argument type
  { rejectValue: string } // type for rejectWithValue
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    // Check duplicate email
    const emailCheck = await axios.get(
      `http://localhost:3000/users?email=${userData.email}`
    );
    if (emailCheck.data.length > 0)
      return rejectWithValue("Email is already registered!");

    // Check duplicate phone
    const phoneCheck = await axios.get(
      `http://localhost:3000/users?phone=${userData.phone}`
    );
    if (phoneCheck.data.length > 0)
      return rejectWithValue("Phone number is already registered!");

    // Register user
    const response = await axios.post("http://localhost:3000/users", userData);
    return response.data;
  } catch (err) {
    console.error(err);
    return rejectWithValue("Registration failed. Please try again.");
  }
});

const initialState: RegisterState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearState: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<RegisterFormData>) => {
          state.loading = false;
          state.user = action.payload;
          state.success = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearState } = registerSlice.actions;
export default registerSlice.reducer;
