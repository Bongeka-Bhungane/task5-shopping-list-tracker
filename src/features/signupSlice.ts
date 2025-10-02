import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface signupSlice {
  name: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  cpassword: string
}

const initialState: signupSlice = {
  name: "",
  surname: "",
  phone: "",
  password: "",
  cpassword: "",
  email: "",
};

const signupSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
});

export default signupSlice.reducer;
