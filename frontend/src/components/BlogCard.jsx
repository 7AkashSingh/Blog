import { Link } from "react-router-dom";
import {
    FaHeart,
    FaRegComment,
    FaEye,
    FaArrowRight,
    FaUserCircle,
    FaClock,
} from "react-icons/fa";

import { useDispatch } from "react-redux";
import { toggleLike } from "../features/likes/likeSlice";
import { updateBlogLike } from "../features/blogs/blogSlice";


function BlogCard({ blog }) {
    const dispatch = useDispatch();

   const handleLike = async () => {
    try {
        const result = await dispatch(toggleLike(blog._id)).unwrap();

        dispatch(
            updateBlogLike({
                blogId: blog._id,
                likesCount: result.likesCount,
                isLiked: result.isLiked,
            })
        );
    } catch (err) {
        console.error(err);
    }
};

    return (

        <article className="bg-[#ABC270] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 mt-10px pt-5px">

            <Link to={`/blogs/${blog.slug}`}>

                <img
                    src={
                        blog.coverImage?.url ||
                        "https://via.placeholder.com/600x400"
                    }
                    alt={blog.title}
                    className="w-full h-56 object-cover hover:scale-105 transition duration-300"
                />

            </Link>



            <div className="p-5">

                {
                    blog.category?.name && (

                        <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-3">

                            {blog.category.name}

                        </span>

                    )
                }

                <Link to={`/blogs/${blog.slug}`}>

                    <h2 className="text-2xl font-bold hover:text-blue-600 transition line-clamp-2">

                        {blog.title}

                    </h2>

                </Link>

                <p className="text-gray-600 mt-3 line-clamp-3">

                    {blog.excerpt}

                </p>

                {
                    blog.tags?.length > 0 && (

                        <div className="flex flex-wrap gap-2 mt-4">

                            {
                                blog.tags.slice(0,3).map((tag)=>(
                                    <span
                                        key={tag}
                                        className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))
                            }

                        </div>

                    )
                }

                <div className="flex items-center gap-3 mt-5">


                    {
                        blog.author?.avatar ? (

                            <img
                                src={blog.author.avatar}
                                alt={blog.author.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                        ) : (

                            <FaUserCircle className="text-4xl text-gray-400"/>

                        )
                    }

                    <div>
                        <p className="font-medium">

                            {blog.author?.username || "Unknown"}

                        </p>

                        <p className="text-sm text-gray-500">
                            {
                                blog.createdAt
                                ? new Date(blog.createdAt)
                                    .toLocaleDateString()
                                : ""
                            }
                        </p>
                    </div>
                </div>


                <div className="flex items-center justify-between mt-5 text-gray-600">


                    <div className="flex gap-4">

                       <button
                            onClick={handleLike}
                            className="flex items-center gap-1 hover:text-red-600"
                        >
                            <FaHeart
                                className={
                                    blog.isLiked
                                        ? "text-red-600"
                                        : "text-gray-500"
                                }
                            />

                            {blog.likesCount}
                        </button>


                        <div className="flex items-center gap-1">

                           <Link
                                to={`/blogs/${blog.slug}`}
                                className="flex items-center gap-1 hover:text-blue-600"
                            >
                                <FaRegComment />

                                {blog.commentsCount || 0}
                            </Link>

                        </div>

                        <div className="flex items-center gap-1">

                            <FaEye/>

                            {blog.views || 0}

                        </div>

                        {
                            blog.readingTime && (

                                <div className="flex items-center gap-1">

                                    <FaClock/>

                                    {blog.readingTime} min

                                </div>

                            )
                        }
                    </div>

                    <Link
                        to={`/blogs/${blog.slug}`}
                        className="flex items-center gap-2 text-blue-600 hover:gap-3 transition-all"
                    >
                        Read More
                        <FaArrowRight/>

                    </Link>

                </div>

            </div>

        </article>
    );
}

export default BlogCard;