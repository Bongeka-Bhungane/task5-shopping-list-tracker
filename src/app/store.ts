import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import listsReducer from "../features/lists/listsSlice";
import itemsReducer from "../features/items/itemsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lists: listsReducer,
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
