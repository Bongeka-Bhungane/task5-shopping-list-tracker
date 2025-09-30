import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface loginSlice {
    username: string;
    password: string;
    email: string;
}

const initialState: loginSlice = {
    username: "myusername",
    password: "12345",
    email: "angelabhungane@gmail.com"
}

const loginSlice = createSlice ({
    name: "counter",
    initialState,
    reducers:  {}
})

export default loginSlice.reducer 