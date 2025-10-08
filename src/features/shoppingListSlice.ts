import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const BASE_URL = "http://localhost:3000/shoppingLists";

export interface Item {
  id: number;
  name: string;
  checked: boolean;
}

export interface ShoppingLists {
  id?: string;
  name: string;
  category: string;
  image: string;
  status: string;
  dateAdded: Date;
  quantity?: number;
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
    const userRes = await axios.post(BASE_URL, list);
    const user = userRes.data;

    if (!user) return rejectWithValue("User not found..");
    else return user;

    return list; // return the newly added list
  } catch (err) {
    return rejectWithValue((err as string) || "Failed to add list");
  }
});

// 📦 Fetch lists for a specific user
export const fetchUserLists = createAsyncThunk<ShoppingLists[], string>(
  "shoppingList/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(BASE_URL);

      if (res) {
        const data: ShoppingLists[] = res.data;
        return (
          data.filter((d) => {
            return d.userId == userId;
          }) || []
        );
      }

      return [];
    } catch (err) {
      return rejectWithValue(err || "Failed to fetch lists");
    }
  }
);

// DELETE a list
export const deleteShoppingList = createAsyncThunk<string, string>(
  "shoppingItems/delete",
  async (id) => {
    await axios.delete(`http://localhost:3000/shoppingLists/${id}`);
    return id;
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
        // action.payload is the string id of the deleted list
        state.lists = state.lists.filter((list) => list.id !== action.payload);
      })
      .addCase(deleteShoppingList.rejected, (state, action) => {
        console.error("Delete failed:", action.payload);
      });
  },
});

export const { clearError } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
