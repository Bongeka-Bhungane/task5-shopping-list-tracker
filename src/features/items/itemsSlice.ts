import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { RootState } from "../../app/store";
import type { ShoppingItem } from "./types";
import {
  createItem,
  deleteItemById,
  fetchItemsByList,
  patchItem,
} from "./itemsApi";

type ItemsState = {
  items: ShoppingItem[];
  loading: boolean;
  error: string | null;

  // purely UI state
  activeListId: string | null;
};

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  activeListId: null,
};

export const fetchItemsThunk = createAsyncThunk(
  "items/fetchByList",
  async (payload: { listId: string }, { rejectWithValue }) => {
    try {
      const data = await fetchItemsByList(payload.listId);
      return { listId: payload.listId, items: data };
    } catch {
      return rejectWithValue("Failed to load items.");
    }
  },
);

export const addItemThunk = createAsyncThunk(
  "items/add",
  async (
    payload: {
      userId: string;
      listId: string;
      name: string;
      quantity: number;
      category: string;
      notes?: string;
      imageUrl?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const now = new Date().toISOString();
      const newItem: ShoppingItem = {
        id: nanoid(),
        userId: payload.userId,
        listId: payload.listId,

        name: payload.name.trim(),
        quantity: Number(payload.quantity),
        category: payload.category.trim() || "Other",
        notes: payload.notes?.trim() || "",
        imageUrl: payload.imageUrl?.trim() || "",

        createdAt: now,
        updatedAt: now,
      };

      return await createItem(newItem);
    } catch {
      return rejectWithValue("Failed to add item.");
    }
  },
);

export const updateItemThunk = createAsyncThunk(
  "items/update",
  async (
    payload: {
      id: string;
      patch: Partial<
        Pick<
          ShoppingItem,
          "name" | "quantity" | "notes" | "category" | "imageUrl"
        >
      >;
    },
    { rejectWithValue },
  ) => {
    try {
      const now = new Date().toISOString();
      const safePatch: any = { ...payload.patch, updatedAt: now };

      if (typeof safePatch.name === "string")
        safePatch.name = safePatch.name.trim();
      if (typeof safePatch.category === "string")
        safePatch.category = safePatch.category.trim();
      if (typeof safePatch.notes === "string")
        safePatch.notes = safePatch.notes.trim();
      if (typeof safePatch.imageUrl === "string")
        safePatch.imageUrl = safePatch.imageUrl.trim();
      if (typeof safePatch.quantity !== "undefined")
        safePatch.quantity = Number(safePatch.quantity);

      return await patchItem(payload.id, safePatch);
    } catch {
      return rejectWithValue("Failed to update item.");
    }
  },
);

export const deleteItemThunk = createAsyncThunk(
  "items/delete",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      await deleteItemById(payload.id);
      return payload.id;
    } catch {
      return rejectWithValue("Failed to delete item.");
    }
  },
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearItemsState(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.activeListId = null;
    },
    setActiveListId(state, action: PayloadAction<string | null>) {
      state.activeListId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchItemsThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchItemsThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.activeListId = a.payload.listId;
        s.items = a.payload.items;
      })
      .addCase(fetchItemsThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to load items.");
      })

      // add
      .addCase(addItemThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addItemThunk.fulfilled, (s, a) => {
        s.loading = false;

        // Only push if item belongs to active list
        if (!s.activeListId || a.payload.listId === s.activeListId) {
          s.items = [a.payload, ...s.items];
        }
      })
      .addCase(addItemThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to add item.");
      })

      // update
      .addCase(updateItemThunk.fulfilled, (s, a) => {
        const idx = s.items.findIndex((x) => x.id === a.payload.id);
        if (idx >= 0) s.items[idx] = a.payload;
      })

      // delete
      .addCase(deleteItemThunk.fulfilled, (s, a) => {
        s.items = s.items.filter((x) => x.id !== a.payload);
      });
  },
});

export const { clearItemsState, setActiveListId } = itemsSlice.actions;

export const selectItems = (state: RootState) => state.items.items;
export const selectItemsLoading = (state: RootState) => state.items.loading;
export const selectItemsError = (state: RootState) => state.items.error;
export const selectActiveListId = (state: RootState) =>
  state.items.activeListId;

export default itemsSlice.reducer;
