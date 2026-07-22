import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


import slugify from "slugify"
import { Category } from "../models/Category.model.js";
import { Blog } from "../models/Blog.model.js";



const createCategory = asyncHandler(async(req, res)=>{
    const { name } = req.body;

    if(!name?.trim()){
        throw new ApiError(400, "Category name is required");
    }

    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const existingCategory = await Category.findOne({
        $or: [{name}, { slug}],
    });

    if(existingCategory){
        throw new ApiError (409, "Category already exisits")
    }

    const category = await Category.create({
        name, 
        slug,
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )
    )
});


const getAllCategories = asyncHandler(async(req, res)=>{
    const categories = await Category.find()
        .sort({name:1});

    return res.status(200).json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )
    );
})


const updateCategory = asyncHandler(async(req , res)=>{
    const {id} = req.params;
    const { name } = req.body;

    if(!name?.trim()){
        throw new ApiError(
            400, "Category name is required"
        )
    }

    const category = await Category.findById(id);

    if(!category){
        throw new ApiError(
            404, "Categoprry not found"
        )
    }

    const slug = slugify(name,{
        lower :true,
        strict:true,
        trim:true
    })

      const duplicate = await Category.findOne({
        slug,
        _id: { $ne: id },
    });

    if (duplicate) {
        throw new ApiError(409, "Category already exists");
    }

    category.name = name;
    category.slug = slug;

    await category.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            category,
            "Category updated successfully"
        )
    );
})


const deleteCategory = asyncHandler(async(req, res)=>{
const {id} = req.params;

    const category = await Category.findById(id);

    if(!category){
        throw new ApiError(404, "Cannot not found");
    }

    const blogUsingCategory = await Blog.countDocuments(
        {
            category: id
        }
    )

    if (blogUsingCategory > 0) {
        throw new ApiError(
            400,
            "Cannot delete category because blogs are using it"
        );
    }

    await category.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Category deleted successfully"
        )
    );
});


export {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};