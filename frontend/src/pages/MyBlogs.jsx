import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchMyBlogs } from "../features/blogs/blogSlice";

import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { deleteExistingBlog } from "../features/blogs/blogSlice";


function MyBlogs() {
    const dispatch = useDispatch();

    const { myBlogs, loading, error } = useSelector(
        (state) => state.blogs
    );

    const handleDelete = (id) => {
        if (window.confirm("Delete this blog?")) {
            dispatch(deleteExistingBlog(id));
        }
    };

    useEffect(() => {
        dispatch(fetchMyBlogs());
    }, [dispatch]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <h2 className="text-center text-red-500 text-lg">
                {error}
            </h2>
        );
    }

    if (!myBlogs.length) {
        return (
            <EmptyState
                message="You haven't created any blogs yet."
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    My Blogs
                </h1>

                <Link
                    to="/create-blog"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                    + Create Blog
                </Link>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {myBlogs.map((blog) => (

                    <div
                        key={blog._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                    >

                        <img
                            src={
                                blog.coverImage?.url ||
                                "https://placehold.co/600x350?text=No+Image"
                            }
                            alt={blog.title}
                            className="w-full h-52 object-cover"
                        />

                        <div className="p-5">

                            <h2 className="text-xl font-semibold mb-2">
                                {blog.title}
                            </h2>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {blog.excerpt}
                            </p>

                            <div className="flex justify-between text-sm mb-5">

                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {blog.category?.name || "Category"}
                                </span>

                                <span
                                    className={`px-2 py-1 rounded ${
                                        blog.status === "published"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {blog.status}
                                </span>

                            </div>

                            <p className="text-gray-500 text-xs mb-5">
                                {new Date(blog.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex gap-3">

                                <Link
                                    to={`/edit-blog/${blog._id}`}
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-center"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={()=>handleDelete(blog._id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default MyBlogs;