import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ITEM INTERFACE
export interface Item {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  listId: string;
}

// STATE INTERFACE
export interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

// INITIAL STATE
const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};

//error handler 
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Fetch all items for a specific user
export const fetchItems = createAsyncThunk<Item[], string>(
  "items/fetchAll",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:3000/items?userId=${userId}`);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Add a new item
export const addItem = createAsyncThunk<
  Item,
  Omit<Item, "id" | "dateAdded" | "status">
>(
  "items/add",
  async (newItem, { rejectWithValue }) => {
    try {
      const itemToAdd: Item = {
        ...newItem,
        id: crypto.randomUUID(),
      };
      const res = await axios.post("http://localhost:3000/items", itemToAdd);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update an existing item
export const updateItem = createAsyncThunk<Item, Item>(
  "items/update",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:3000/items/${item.id}`, item);
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete an item by ID
export const deleteItem = createAsyncThunk<string, string>(
  "items/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/items/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);


const itemSlice = createSlice({
  name: "shoppingItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ADD
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action: PayloadAction<Item>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateItem.fulfilled, (state, action: PayloadAction<Item>) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })

      // DELETE
      .addCase(deleteItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default itemSlice.reducer;

