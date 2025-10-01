import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface signupSlice {
  name: string;
  surname: string;
  cellNumber: string;
  email: string;
  password: string;
}

const initialState: signupSlice = {
  name: "bongeka",
  surname: "bhungane",
  cellNumber: "0832964212",
  password: "12345",
  email: "angelabhungane@gmail.com",
};

const signupSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {},
});

export default signupSlice.reducer;
