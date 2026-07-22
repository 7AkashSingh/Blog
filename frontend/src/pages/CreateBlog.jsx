import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNewBlog } from "../features/blogs/blogSlice.js";
import { fetchCategories } from "../features/category/categorySlice.js";
import { useNavigate } from "react-router-dom";


function CreateBlog() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.blogs);

    const { categories } = useSelector(
        (state) => state.category
    );


    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: "",
        status: "draft",
    });


    const [coverImage, setCoverImage] = useState(null);


    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleImage = (e) => {
        setCoverImage(e.target.files[0]);
    };



    const handleSubmit = async (e) => {

        e.preventDefault();


        const blogData = new FormData();


        blogData.append("title", formData.title);
        blogData.append("excerpt", formData.excerpt);
        blogData.append("content", formData.content);

        // this will send category ObjectId
        blogData.append(
            "category",
            formData.category
        );

        blogData.append(
            "status",
            formData.status
        );


        formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .forEach((tag) => {
                blogData.append("tags", tag);
            });


        if (coverImage) {
            blogData.append(
                "coverImage",
                coverImage
            );
        }



        const result = await dispatch(
            createNewBlog(blogData)
        );


        if(createNewBlog.fulfilled.match(result)){

            alert("Blog Created Successfully");
            navigate("/");

        }else{

            alert(
                result.payload?.message ||
                "Failed to create blog"
            );

        }
    };



    return (

        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">


            <h1 className="text-3xl font-bold mb-8">
                Create New Blog
            </h1>


            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >


                {/* Title */}

                <div>

                    <label className="block font-semibold mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        placeholder="Enter Blog Title"
                        required
                    />

                </div>




                {/* Excerpt */}

                <div>

                    <label className="block font-semibold mb-2">
                        Excerpt
                    </label>


                    <textarea
                        rows={3}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-3"
                        placeholder="Short description..."
                    />

                </div>




                {/* Category Dropdown */}

                <div>

                    <label className="block font-semibold mb-2">
                        Category
                    </label>


                    <select

                        name="category"

                        value={formData.category}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        required
                    >

                        <option value="">
                            Select Category
                        </option>


                        {
                            categories?.map((cat)=>(

                                <option
                                    key={cat._id}
                                    value={cat._id}
                                >
                                    {cat.name}
                                </option>

                            ))
                        }


                    </select>

                </div>





                {/* Tags */}

                <div>

                    <label className="block font-semibold mb-2">
                        Tags
                    </label>


                    <input

                        type="text"

                        name="tags"

                        value={formData.tags}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        placeholder="react,node,mongodb"

                    />

                </div>





                {/* Cover Image */}

                <div>

                    <label className="block font-semibold mb-2">
                        Cover Image
                    </label>


                    <input

                        type="file"

                        accept="image/*"

                        onChange={handleImage}

                    />

                </div>





                {/* Content */}

                <div>

                    <label className="block font-semibold mb-2">
                        Content
                    </label>


                    <textarea

                        rows={10}

                        name="content"

                        value={formData.content}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                        placeholder="Write your blog..."

                        required

                    />

                </div>





                {/* Status */}

                <div>

                    <label className="block font-semibold mb-2">
                        Status
                    </label>


                    <select

                        name="status"

                        value={formData.status}

                        onChange={handleChange}

                        className="w-full border rounded-lg p-3"

                    >

                        <option value="draft">
                            Draft
                        </option>


                        <option value="published">
                            Published
                        </option>


                    </select>

                </div>





                <button

                    type="submit"

                    disabled={loading}

                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"

                >

                    {
                        loading
                        ? "Publishing..."
                        : "Publish Blog"
                    }

                </button>



            </form>


        </div>

    );
}


export default CreateBlog;