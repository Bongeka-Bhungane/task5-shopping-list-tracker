import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/features/loginSlice";
import registerReducer from "./src/features/signupSlice"

export const store = configureStore({
  reducer: {
    LoginSlice: authReducer,
    register: registerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
