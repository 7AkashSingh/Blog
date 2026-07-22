import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchSearchBlogs } from "../features/blogs/blogSlice";

import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";

const Search = () => {

    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") || "";

    const {
        searchResults,
        loading,
        error,
    } = useSelector((state) => state.blogs);

    useEffect(() => {

        if (query.trim()) {

            dispatch(
                fetchSearchBlogs({
                    q: query,
                })
            );

        }

    }, [dispatch, query]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h2 className="text-red-500 text-xl">
                    {error.message || "Something went wrong"}
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Search Results for "{query}"
            </h1>

            {searchResults.length === 0 ? (
                <div className="text-center py-16">

                    <h2 className="text-2xl font-semibold">
                        No Blogs Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                        Try another keyword.
                    </p>

                </div>
            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {searchResults.map((blog) => (

                        <BlogCard
                            key={blog._id}
                            blog={blog}
                        />

                    ))}

                </div>

            )}

        </div>
    );
};

export default Search;