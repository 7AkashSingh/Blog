import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotificationsAPI, markNotificationReadAPI } from "../../services/notificationServies";

const initialState = {

    notifications: [],

    unreadCount: 0,

    loading:false,

    error:null
};

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async(_, thunkAPI)=>{
        try{
            return await getNotificationsAPI();
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );

        }
    }
);

export const markNotificationRead = createAsyncThunk(
    "notifications/markRead",
    async(id, thunkAPI)=>{
        try{
            return await markNotificationReadAPI(id);
        }
        catch(error){
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const notificationSlice = createSlice({
    name:"notifications",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchNotifications.pending,(state)=>{
            state.loading=true;
        })

        .addCase(fetchNotifications.fulfilled,(state,action)=>{
            state.loading=false;
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(
                (item)=> !item.isRead
            ).length;
        })

        .addCase(fetchNotifications.rejected,(state,action)=>{
            state.loading=false;
            state.error = action.payload;
        })

        .addCase(markNotificationRead.fulfilled,(state,action)=>{
            const updated = action.payload;
            state.notifications = state.notifications.filter(
                (item)=> item._id !== updated._id
            );
            state.unreadCount = state.notifications.filter(
                (item)=> !item.isRead
            ).length;
        });
    }
});

export default notificationSlice.reducer;