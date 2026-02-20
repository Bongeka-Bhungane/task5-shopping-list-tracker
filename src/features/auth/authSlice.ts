// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { RootState } from "../../app/store";
import type { User } from "./types";
import { createUser, findUserByEmail, updateUser } from "./authApi";
import { hashPassword, verifyPassword } from "../../utils/crypto";

type AuthState = {
  user: Omit<User, "passwordHash"> | null;
  loading: boolean;
  error: string | null;
};

const saved = localStorage.getItem("session_user");
const initialState: AuthState = {
  user: saved ? JSON.parse(saved) : null,
  loading: false,
  error: null,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      email: string;
      password: string;
      name: string;
      surname: string;
      cell: string;
    },
    { rejectWithValue },
  ) => {
    const existing = await findUserByEmail(payload.email);
    if (existing) return rejectWithValue("Email already registered.");

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(payload.password);

    const newUser: User = {
      id: nanoid(),
      email: payload.email,
      passwordHash,
      name: payload.name,
      surname: payload.surname,
      cell: payload.cell,
      createdAt: now,
      updatedAt: now,
    };

    const created = await createUser(newUser);
    const { passwordHash: _, ...safe } = created;
    return safe;
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    const user = await findUserByEmail(payload.email);
    if (!user) return rejectWithValue("Invalid email or password.");

    const ok = await verifyPassword(payload.password, user.passwordHash);
    if (!ok) return rejectWithValue("Invalid email or password.");

    const { passwordHash: _, ...safe } = user;
    return safe;
  },
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: { id: string; name: string; surname: string; cell: string },
    { rejectWithValue },
  ) => {
    try {
      const now = new Date().toISOString();
      const updated = await updateUser(payload.id, {
        name: payload.name,
        surname: payload.surname,
        cell: payload.cell,
        updatedAt: now,
      });
      const { passwordHash: _, ...safe } = updated;
      return safe;
    } catch {
      return rejectWithValue("Failed to update profile.");
    }
  },
);

export const updateCredentialsThunk = createAsyncThunk(
  "auth/updateCredentials",
  async (
    payload: { id: string; email: string; newPassword?: string },
    { rejectWithValue },
  ) => {
    try {
      const now = new Date().toISOString();
      const patch: Partial<User> & { passwordHash?: string } = {
        email: payload.email,
        updatedAt: now,
      };

      if (payload.newPassword) {
        patch.passwordHash = await hashPassword(payload.newPassword);
      }

      const updated = await updateUser(payload.id, patch);
      const { passwordHash: _, ...safe } = updated;
      return safe;
    } catch {
      return rejectWithValue("Failed to update credentials.");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("session_user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(registerThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        localStorage.setItem("session_user", JSON.stringify(a.payload));
      })
      .addCase(registerThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Register failed.");
      })

      // LOGIN
      .addCase(loginThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        localStorage.setItem("session_user", JSON.stringify(a.payload));
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Login failed.");
      })

      // UPDATE PROFILE
      .addCase(updateProfileThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        localStorage.setItem("session_user", JSON.stringify(a.payload));
      })
      .addCase(updateProfileThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to update profile.");
      })

      // UPDATE CREDENTIALS
      .addCase(updateCredentialsThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateCredentialsThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
        localStorage.setItem("session_user", JSON.stringify(a.payload));
      })
      .addCase(updateCredentialsThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to update credentials.");
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// ✅ SELECTORS (required by Login/Register pages)
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
