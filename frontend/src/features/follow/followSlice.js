import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    followUserAPI,
    unfollowUserAPI,
    getFollowersAPI,
    getFollowingAPI,
    checkFollowStatusAPI
} from "../../services/followServices.js";

const initialState = {
    isFollowing: false,
    followers: [],
    following: [],
    loading: false,
    error: null
};

export const followUser = createAsyncThunk(
    "follow/followUser",
    async(userId, thunkAPI)=>{
        try {
            return await followUserAPI(userId);
        } 
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const unfollowUser = createAsyncThunk(
    "follow/unfollowUser",
    async(userId, thunkAPI)=>{
        try {
            return await unfollowUserAPI(userId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const fetchFollowers = createAsyncThunk(
    "follow/getFollowers",
    async(userId, thunkAPI)=>{
        try{
            return await getFollowersAPI(userId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const fetchFollowing = createAsyncThunk(
    "follow/getFollowing",
    async(userId, thunkAPI)=>{
        try{
            return await getFollowingAPI(userId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const checkFollowStatus = createAsyncThunk(
    "follow/checkStatus",
    async(userId, thunkAPI)=>{
        try{
            return await checkFollowStatusAPI(userId);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const followSlice = createSlice({
    name:"follow",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
    
        .addCase(followUser.fulfilled,(state)=>{
            state.isFollowing = true;
        })

        .addCase(unfollowUser.fulfilled,(state)=>{
            state.isFollowing = false;
        })

        .addCase(fetchFollowers.fulfilled,(state,action)=>{
            state.followers = action.payload;
        })

        .addCase(fetchFollowing.fulfilled,(state,action)=>{
            state.following = action.payload;
        })

        .addCase(checkFollowStatus.fulfilled,(state,action)=>{
            state.isFollowing = action.payload.isFollowing;
        });
    }
});

export default followSlice.reducer;