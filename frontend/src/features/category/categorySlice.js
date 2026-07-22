import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategoriesAPI } from "../../services/categoryServices.js";


const initialState = {
    categories: [],
    loading: false,
    error: null
};


export const fetchCategories = createAsyncThunk(
    "category/getCategories",
    async () => {
        return await getCategoriesAPI();
    }
);


const categorySlice = createSlice({

    name:"category",

    initialState,

    reducers:{},

    extraReducers:(builder)=>{

        builder

        .addCase(fetchCategories.pending,(state)=>{
            state.loading=true;
        })

        .addCase(fetchCategories.fulfilled,(state,action)=>{
            state.loading=false;
            state.categories=action.payload;
        })

        .addCase(fetchCategories.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message;
        })

    }

});


export default categorySlice.reducer;