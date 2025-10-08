import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const BASE_URL = "http://localhost:3000/users";

export interface Item {
  id: number;
  name: string;
  checked: boolean;
}

export interface ShoppingLists {
  id: number;
  listName: string;
  category: string;
  image: string;
  status: string;
  dateAdded: string;
  items: Item[];
  userId: string;
}

interface ShoppingListState {
  lists: ShoppingLists[];
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  lists: [],
  loading: false,
  error: null,
};

// ➕ Add new list
export const addShoppingList = createAsyncThunk<
  ShoppingLists,
  ShoppingLists,
  { rejectValue: string }
>("shoppingList/add", async (list, { rejectWithValue }) => {
  try {
    // 1️⃣ Fetch current user
    const userRes = await axios.get(`${BASE_URL}/${list.userId}`);
    const user = userRes.data;

    if (!user) throw new Error("User not found");

    // 2️⃣ Append new list
    const updatedLists = [...user.shoppingLists, list];

    // 3️⃣ Update user
    await axios.put(`${BASE_URL}/${list.userId}`, {
      ...user,
      shoppingLists: updatedLists,
    });

    return list; // return the newly added list
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to add list");
  }
});

// 📦 Fetch lists for a specific user
export const fetchUserLists = createAsyncThunk<ShoppingLists[], string>(
  "shoppingList/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/${userId}`);
      return res.data.shoppingLists || [];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch lists");
    }
  }
);

// DELETE a list
export const deleteShoppingList = createAsyncThunk<
  number,
  { listId: number; userId: string }
>(
  "shoppingList/deleteList",
  async ({ listId, userId }, { rejectWithValue }) => {
    try {
      // Fetch current user
      const userRes = await axios.get(`${BASE_URL}/${userId}`);
      const user = userRes.data;

      // Filter out the deleted list
      const updatedLists = user.shoppingLists.filter(
        (l: ShoppingLists) => l.id !== listId
      );

      // Update user
      await axios.put(`${BASE_URL}/${userId}`, {
        ...user,
        shoppingLists: updatedLists,
      });

      return listId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete list");
    }
  }
);

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUserLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchUserLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ADD
      .addCase(addShoppingList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addShoppingList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists.push(action.payload);
      })
      .addCase(addShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteShoppingList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteShoppingList.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
