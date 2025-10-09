import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// RootState not needed in this file
export interface Item {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  status: "Pending" | "Purchased" | "Out of Stock";
  image?: string;
  dateAdded: string;
  userId: string;
  listId: string;
}
export interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}
const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
};
export const fetchItems = createAsyncThunk<Item[], string>(
  "Items/fetchAll",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:3000/items?userId=${userId}`
    );
    return res.data;
  }
);
export const addItem = createAsyncThunk<Item, Item>(
  "Items/add",
  async (item) => {
    const res = await axios.post("http://localhost:3000/items", item);
    return res.data;
  }
);
export const updateItem = createAsyncThunk<Item, Item>(
  "Items/update",
  async (item) => {
    const res = await axios.put(
      `http://localhost:3000/items/${item.id}`,
      item
    );
    return res.data;
  }
);
export const deleteItem = createAsyncThunk<string, string>(
  "Items/delete",
  async (id) => {
    await axios.delete(`http://localhost:3000/items/${id}`);
    return id;
  }
);
const itemSlice = createSlice({
  name: "shoppingItems",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});
export default itemSlice.reducer;
