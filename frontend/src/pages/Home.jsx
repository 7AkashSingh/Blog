//can you change the colour of this to use this color : having the  hascode as : 889063, CFBB99: 
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBlogs } from "../features/blogs/blogSlice";

import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";


function Home() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const { blogs, loading, error } = useSelector(
        (state) => state.blogs
    );

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);



    if (loading) {
        return <Loader />;
    }



    if (error) {
        return (
            <EmptyState
                message={error.message || "Failed to load blogs"}
            />
        );
    }



    if (!blogs || blogs.length === 0) {
        return (
            <EmptyState
                message="No blogs available."
            />
        );
    }



    return (

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 BG-[#FEC868] mt-50px">

            {
                blogs.map((blog)=>(
                    <BlogCard
                        key={blog._id}
                        blog={blog}
                    />
                ))
            }

        </div>

    );
}


export default Home;