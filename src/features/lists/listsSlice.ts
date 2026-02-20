import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import type { RootState } from "../../app/store";
import type { ShoppingList } from "./types";
import {
  createList,
  deleteListById,
  fetchListsByUser,
  patchList,
} from "./listsApi";
import { fetchItemIdsForList, deleteItemById } from "../items/itemsApi";

type ListsState = {
  lists: ShoppingList[];
  selectedListId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: ListsState = {
  lists: [],
  selectedListId: null,
  loading: false,
  error: null,
};

export const fetchListsThunk = createAsyncThunk(
  "lists/fetchByUser",
  async (payload: string, { rejectWithValue }) => {
    try {
      return await fetchListsByUser(payload);
    } catch {
      return rejectWithValue("Failed to load lists.");
    }
  },
);

export const addListThunk = createAsyncThunk(
  "lists/add",
  async (payload: { userId: string; name: string }, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const newList: ShoppingList = {
        id: nanoid(),
        userId: payload.userId,
        name: payload.name.trim(),
        createdAt: now,
        updatedAt: now,
      };
      return await createList(newList);
    } catch {
      return rejectWithValue("Failed to add list.");
    }
  },
);

export const updateListThunk = createAsyncThunk(
  "lists/update",
  async (payload: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      return await patchList(payload.id, {
        name: payload.name.trim(),
        updatedAt: now,
      });
    } catch {
      return rejectWithValue("Failed to update list.");
    }
  },
);

export const deleteListThunk = createAsyncThunk(
  "lists/delete",
  async (
    payload: { id: string; alsoDeleteItems?: boolean },
    { rejectWithValue },
  ) => {
    try {
      // Optionally clean up items for that list (recommended)
      if (payload.alsoDeleteItems) {
        const itemIds = await fetchItemIdsForList(payload.id);
        await Promise.all(itemIds.map((itemId) => deleteItemById(itemId)));
      }

      await deleteListById(payload.id);
      return payload.id;
    } catch {
      return rejectWithValue("Failed to delete list.");
    }
  },
);

/**
 * Share: generates/stores a shareToken on the list
 * You can show link `/share/<token>` in UI.
 */
export const shareListThunk = createAsyncThunk(
  "lists/share",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const now = new Date().toISOString();
      const token = nanoid(12);
      return await patchList(payload.id, {
        shareToken: token,
        updatedAt: now,
      });
    } catch {
      return rejectWithValue("Failed to generate share link.");
    }
  },
);

const listsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    selectList(state, action: PayloadAction<string | null>) {
      state.selectedListId = action.payload;
    },
    clearListsState(state) {
      state.lists = [];
      state.selectedListId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchListsThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchListsThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.lists = a.payload;

        // Auto-select first list if none selected
        if (!s.selectedListId && s.lists.length) {
          s.selectedListId = s.lists[0].id;
        }

        // If selected list was deleted elsewhere, select first
        if (
          s.selectedListId &&
          !s.lists.find((x) => x.id === s.selectedListId)
        ) {
          s.selectedListId = s.lists.length ? s.lists[0].id : null;
        }
      })
      .addCase(fetchListsThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to load lists.");
      })

      // add
      .addCase(addListThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addListThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.lists = [a.payload, ...s.lists];
        s.selectedListId = a.payload.id;
      })
      .addCase(addListThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = String(a.payload || "Failed to add list.");
      })

      // update
      .addCase(updateListThunk.fulfilled, (s, a) => {
        const idx = s.lists.findIndex((x) => x.id === a.payload.id);
        if (idx >= 0) s.lists[idx] = a.payload;
      })

      // delete
      .addCase(deleteListThunk.fulfilled, (s, a) => {
        const deletedId = a.payload;
        s.lists = s.lists.filter((x) => x.id !== deletedId);

        if (s.selectedListId === deletedId) {
          s.selectedListId = s.lists.length ? s.lists[0].id : null;
        }
      })

      // share
      .addCase(shareListThunk.fulfilled, (s, a) => {
        const idx = s.lists.findIndex((x) => x.id === a.payload.id);
        if (idx >= 0) s.lists[idx] = a.payload;
      });
  },
});

export const { selectList, clearListsState } = listsSlice.actions;

export const selectLists = (state: RootState) => state.lists.lists;
export const selectSelectedListId = (state: RootState) =>
  state.lists.selectedListId;
export const selectListsLoading = (state: RootState) => state.lists.loading;
export const selectListsError = (state: RootState) => state.lists.error;

export const selectSelectedList = (state: RootState) => {
  const id = state.lists.selectedListId;
  return id ? (state.lists.lists.find((x) => x.id === id) ?? null) : null;
};

export default listsSlice.reducer;
