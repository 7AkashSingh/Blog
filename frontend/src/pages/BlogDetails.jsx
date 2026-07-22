import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchBlogBySlug } from "../features/blogs/blogSlice.js";
import { fetchLikes, toggleLike } from "../features/likes/likeSlice.js";


import Loader from "../components/Loader.jsx";

import {
    FaEye,
    FaClock,
    FaUserCircle,
    FaArrowLeft,
    FaHeart,
    FaRegHeart,
} from "react-icons/fa";

import CommentSection from "../components/CommentSection.jsx";

function BlogDetails() {

    const { slug } = useParams();

    const dispatch = useDispatch();

    const [showComments, setShowComments] = useState(false);


    const {
        currentBlog,
        loading,
        error
    } = useSelector(
        (state)=> state.blogs
    );

    const {
        likesCount,
        isLiked,
        loading: likeLoading,
    } = useSelector(
        (state) => state.likes
    );


    useEffect(()=>{

        if(slug){
            dispatch(fetchBlogBySlug(slug));
        }

    },[slug,dispatch]);

    useEffect(() => {
        if (currentBlog?._id) {
            dispatch(fetchLikes(currentBlog._id));
        }
    }, [currentBlog, dispatch]);

    const handleLike = () => {
        if (!currentBlog?._id || likeLoading) return;

        dispatch(toggleLike(currentBlog._id));
    };


    if(loading){

        return <Loader/>;

    }




    if(error){

        return (

            <h1 className="text-center mt-10 text-red-500">

                {error.message || "Something went wrong"}

            </h1>

        );

    }





    if(!currentBlog){

        return (

            <h1 className="text-center mt-10">

                Blog not found

            </h1>

        );

    }





    return (

        <div className="max-w-5xl mx-auto px-5 py-10">



            {/* Back Button */}

            <Link
                to="/"
                className="flex items-center gap-2 text-blue-600 mb-8"
            >

                <FaArrowLeft/>

                Back to blogs

            </Link>





            {/* Category */}

            {
                currentBlog.category?.name && (

                    <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-5">

                        {currentBlog.category.name}

                    </span>

                )
            }







            {/* Title */}

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">

                {currentBlog.title}

            </h1>





            {/* Author + Stats */}

            <div className="flex flex-wrap items-center gap-5 mt-6 text-gray-600">



                <div className="flex items-center gap-3">


                    {
                        currentBlog.author?.avatar ? (

                            <img
                                src={currentBlog.author.avatar}
                                alt={currentBlog.author.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />

                        )
                        :
                        (

                            <FaUserCircle className="text-5xl text-gray-400"/>

                        )

                    }


                    <div>

                        <p className="font-semibold">

                            {currentBlog.author?.username}

                        </p>


                        <p className="text-sm">

                            {
                                new Date(
                                    currentBlog.createdAt
                                ).toLocaleDateString()
                            }

                        </p>

                    </div>


                </div>





               <div className="flex items-center gap-2">

                        <FaEye />

                        {currentBlog.views || 0} views

                    </div>

                    <button
                        onClick={handleLike}
                        disabled={likeLoading}
                        className="flex items-center gap-2 hover:text-red-600 transition"
                    >
                        {isLiked ? (
                            <FaHeart className="text-red-500 text-xl" />
                        ) : (
                            <FaRegHeart className="text-xl" />
                        )}

                        <span>{likesCount}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                        💬

                        {showComments ? "Hide Comments" : "Comments"}
                    </button>

            </div>

            {/* Cover Image */}

            {
                currentBlog.coverImage?.url && (

                    <img
                        src={currentBlog.coverImage.url}
                        alt={currentBlog.title}
                        className="w-full h-112.5 object-cover rounded-xl mt-10"
                    />

                )
            }







            {/* Tags */}

            {
                currentBlog.tags?.length > 0 && (

                    <div className="flex flex-wrap gap-3 mt-8">

                        {
                            currentBlog.tags.map((tag)=>(

                                <span
                                    key={tag}
                                    className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                                >

                                    #{tag}

                                </span>

                            ))
                        }

                    </div>

                )
            }







            {/* Content */}

            <div className="mt-10">


                <p className="text-xl text-gray-600 mb-8">

                    {currentBlog.excerpt}

                </p>




                <div className="text-lg leading-8 whitespace-pre-line">

                    {currentBlog.content}

                </div>


                {
                    showComments && (
                        <div className="mt-10">
                            <CommentSection
                                blogId={currentBlog._id}
                            />
                        </div>
                    )
                }

            </div>




        </div>

    );

}


export default BlogDetails;