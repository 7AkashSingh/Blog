import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchMyBlogs } from "../features/blogs/blogSlice";

function Dashboard() {

    const dispatch = useDispatch();

    const { myBlogs, loading } = useSelector(
        (state) => state.blogs
    );

    useEffect(() => {

        dispatch(fetchMyBlogs());

    }, [dispatch]);

    return (

        <div className="max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold">
                    My Blogs
                </h1>

                <Link
                    to="/create-blog"
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >
                    Create Blog
                </Link>

            </div>

            {loading ? (

                <h2>Loading...</h2>

            ) : (

                <div className="space-y-5">

                    {myBlogs.map((blog) => (

                        <div
                            key={blog._id}
                            className="border rounded-lg p-5 flex justify-between"
                        >

                            <div>

                                <h2 className="text-xl font-semibold">

                                    {blog.title}

                                </h2>

                                <p>

                                    {blog.category?.name}

                                </p>

                            </div>

                            <div className="space-x-2">

                                <button className="bg-green-600 text-white px-4 py-2 rounded">

                                    Edit

                                </button>

                                <button className="bg-red-600 text-white px-4 py-2 rounded">

                                    Delete

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Dashboard;