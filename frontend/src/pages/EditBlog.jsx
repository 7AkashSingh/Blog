import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../components/Loader";

import {
    fetchBlogById,
    updateExistingBlog,
} from "../features/blogs/blogSlice";

import { fetchCategories } from "../features/category/categorySlice";

function EditBlog() {

    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        currentBlog,
    } = useSelector((state) => state.blogs);

    const {
        categories,
    } = useSelector((state) => state.category);

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
        dispatch(fetchBlogById(id));
        dispatch(fetchCategories());
    }, [dispatch, id]);

    useEffect(() => {

        if (currentBlog) {

            setFormData({
                title: currentBlog.title || "",
                excerpt: currentBlog.excerpt || "",
                content: currentBlog.content || "",
                category: currentBlog.category?._id || "",
                tags: currentBlog.tags?.join(", ") || "",
                status: currentBlog.status || "draft",
            });

        }

    }, [currentBlog]);

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
        blogData.append("category", formData.category);
        blogData.append("status", formData.status);

        formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .forEach((tag) => blogData.append("tags", tag));

        if (coverImage) {
            blogData.append("coverImage", coverImage);
        }

        const result = await dispatch(
            updateExistingBlog({
                id,
                blogData,
            })
        );

        if (updateExistingBlog.fulfilled.match(result)) {

            alert("Blog Updated Successfully");

            navigate(`/blogs/${result.payload.data.slug}`);

        } else {

            alert(result.payload || "Failed to update blog");

        }

    };

    if (loading && !currentBlog) {
        return <Loader />;
    }

    return (

        <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8">

            <h1 className="text-3xl font-bold mb-8">
                Edit Blog
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
                    />

                </div>

                {/* Category */}

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

                        {categories?.map((category) => (

                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>

                        ))}

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
                        Change Cover Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    {currentBlog?.coverImage?.url && (

                        <img
                            src={currentBlog.coverImage.url}
                            alt="Current Cover"
                            className="w-52 rounded-lg mt-4"
                        />

                    )}

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
                    {loading ? "Updating..." : "Update Blog"}
                </button>

            </form>

        </div>

    );

}

export default EditBlog;