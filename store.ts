import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/features/loginSlice";
import registerReducer from "./src/features/signupSlice";
import profileReducer from "./src/features/prifileSlice";
import shoppingListReducer from "./src/features/shoppingListSlice";

export const store = configureStore({
  reducer: {
    Login: authReducer,
    register: registerReducer,
    user: profileReducer,
    shoppingList: shoppingListReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
