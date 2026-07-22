import { createSlice, createAsyncThunk, isRejected } from "@reduxjs/toolkit";
import { loginAPI, registerAPI, getCurrentUserAPI, logoutAPI } from "../../services/authService";


const initialState = {
    user: null,
    isAuthenticated: false,
    loading:false,
    error:null
}


export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async(userData, thunkAPI)=>{
       try {
         return await loginAPI(userData);
       } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Login Failed"
            )
       }
    }
)

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async(userData, thunkAPI)=>{
        try {
            return await registerAPI(userData)
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Registraetion failed"
            )
        }
    }
)


export const getCurrentUser = createAsyncThunk(
    "auth/getCurrentUser",
    async (_, thunkAPI) => {
        try {
            return await getCurrentUserAPI();
        } catch (error) {
            return thunkAPI.rejectWithValue(null);
        }
    }
);


export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            await logoutAPI();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending, (state)=>{
            state.loading = true;
            state.error = null;
        }),
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data.user;
            state.isAuthenticated = true;

            localStorage.setItem(
                "accessToken",
                action.payload.data.accessToken
            );
        }),
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;

            state.error = action.payload;

            state.isAuthenticated = false;
        }),
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
        builder.addCase(registerUser.fulfilled, (state, action)=>{
            state.isAuthenticated=true
            state.loading=false
            state.error=false
            state.user = action.payload.data.user
        }),
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;

            state.error = action.payload;
        }),
        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;

            state.user = action.payload.data.user;

            state.isAuthenticated = true;
        }),
        builder.addCase(getCurrentUser.rejected, (state) => {
            state.loading = false;

            state.user = null;

            state.isAuthenticated = false;
        }),
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;

            state.user = null;

            state.isAuthenticated = false;

            state.error = null;
        }),
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;

            state.error = action.payload;
        })
    }
})
export default authSlice.reducer;
