import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getUserBlogsAPI,
    getUserProfileAPI
} from "../../services/profileServices";


const initialState = {

    profileUser: null,

    profileBlogs: [],

    loading: false,

    error: null

};



export const fetchUserProfile = createAsyncThunk(
    "profile/getUserProfile",

    async(username, thunkAPI)=>{

        try{

            return await getUserProfileAPI(username);

        }
        catch(error){

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }

    }
);



export const fetchUserBlogs = createAsyncThunk(
    "profile/getUserBlogs",

    async(username, thunkAPI)=>{

        try{

            return await getUserBlogsAPI(username);

        }
        catch(error){

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }

    }
);



const profileSlice = createSlice({

    name:"profile",

    initialState,


    reducers:{},


    extraReducers:(builder)=>{

        builder


        .addCase(fetchUserProfile.pending,(state)=>{

            state.loading = true;

        })


        .addCase(fetchUserProfile.fulfilled,(state,action)=>{

            state.loading = false;


              state.profileUser = {
                ...action.payload.user,
                ...action.payload.stats,
            };

        })


       .addCase(fetchUserBlogs.pending, (state) => {
            state.loading = true;
        })

        .addCase(fetchUserBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.profileBlogs = action.payload;
        })

        .addCase(fetchUserBlogs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


    }

});


export default profileSlice.reducer;