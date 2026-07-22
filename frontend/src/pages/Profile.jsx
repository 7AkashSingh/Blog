import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { FaUserCircle, FaEye } from "react-icons/fa";

import {
    fetchUserProfile,
    fetchUserBlogs,
} from "../features/profile/profileSlice";

import {
    followUser,
    unfollowUser,
    checkFollowStatus,
} from "../features/follow/followSlice";

import { deleteExistingBlog } from "../features/blogs/blogSlice";



function Profile() {

    const dispatch = useDispatch();

    const { username } = useParams();


    const { user } = useSelector(
        (state) => state.auth
    );


    const {
        profileUser,
        profileBlogs,
        loading
    } = useSelector(
        (state) => state.profile
    );


    const {
        isFollowing
    } = useSelector(
        (state) => state.follow
    );



    // Fetch profile data
    useEffect(() => {

        dispatch(fetchUserProfile(username));

        dispatch(fetchUserBlogs(username));

    }, [dispatch, username]);



    // Check follow status
    useEffect(() => {

        if (
            profileUser &&
            user &&
            profileUser._id !== user._id
        ) {

            dispatch(
                checkFollowStatus(profileUser._id)
            );

        }

    }, [dispatch, profileUser, user]);




    const handleFollow = async () => {
    if (isFollowing) {
        await dispatch(unfollowUser(profileUser._id));

        dispatch(fetchUserProfile(username));
    } else {
        await dispatch(followUser(profileUser._id));

        dispatch(fetchUserProfile(username));
    }
};




    const handleDelete = async(id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this blog?"
        );


        if(!confirmDelete)
            return;


        await dispatch(
            deleteExistingBlog(id)
        );


        dispatch(
            fetchUserBlogs(username)
        );

    };



    if(!profileUser){
        console.log("Username:", username);
        console.log("Profile User:", profileUser);
        console.log("Profile Blogs:", profileBlogs);
        console.log("Loading:", loading);
        return (
            <h1 className="text-center mt-10">
                Loading profile...
            </h1>
        );

    }



    const isMyProfile =
        user?._id === profileUser?._id;



    return (

        <div className="max-w-5xl mx-auto px-6 py-10">


            {/* Profile Header */}

            <div
                className="
                bg-white
                shadow-md
                rounded-xl
                p-8
                flex
                items-center
                gap-6
                "
            >


                {
                    profileUser.avatar

                    ?

                    <img
                        src={profileUser.avatar}
                        alt={profileUser.username}
                        className="
                        w-24
                        h-24
                        rounded-full
                        object-cover
                        "
                    />

                    :

                    <FaUserCircle
                        className="
                        text-8xl
                        text-gray-400
                        "
                    />

                }



                <div>


                    <h1 className="text-3xl font-bold">
                        {profileUser.username}
                    </h1>



                    <p className="text-gray-600">
                        {profileUser.email}
                    </p>



                    {
                        profileUser.bio &&

                        <p className="mt-2 text-gray-500">
                            {profileUser.bio}
                        </p>

                    }



                    <div className="flex gap-6 mt-4">

                        <span>
                            Followers:
                            {profileUser.followers || 0}
                        </span>


                        <span>
                            Following:
                            {profileUser.following || 0}
                        </span>

                    </div>




                    {
                        !isMyProfile &&

                        <button
                            onClick={handleFollow}
                            className="
                            mt-4
                            bg-blue-600
                            text-white
                            px-5
                            py-2
                            rounded-lg
                            "
                        >

                            {
                                isFollowing
                                ?
                                "Following"
                                :
                                "Follow"
                            }

                        </button>

                    }



                </div>


            </div>






            {/* Blogs Section */}


            <div className="mt-10">


                <h2 className="
                text-2xl
                font-bold
                mb-5
                ">

                    {
                        isMyProfile
                        ?
                        "My Blogs"
                        :
                        `${profileUser.username}'s Blogs`
                    }

                    ({profileBlogs.length})

                </h2>





                {
                    loading

                    ?

                    <p>
                        Loading blogs...
                    </p>


                    :


                    profileBlogs.length === 0

                    ?

                    <p className="text-gray-500">
                        No blogs available.
                    </p>


                    :



                    <div className="
                    grid
                    md:grid-cols-2
                    gap-6
                    ">



                        {
                            profileBlogs.map((blog)=>(


                                <div
                                    key={blog._id}
                                    className="
                                    bg-white
                                    shadow-md
                                    rounded-xl
                                    p-5
                                    "
                                >



                                    <h3 className="
                                    text-xl
                                    font-bold
                                    ">

                                        {blog.title}

                                    </h3>




                                    <p className="
                                    text-gray-600
                                    mt-2
                                    ">

                                        {blog.excerpt}

                                    </p>





                                    <div className="
                                    flex
                                    justify-between
                                    items-center
                                    mt-4
                                    ">



                                        <span className="
                                        text-sm
                                        px-3
                                        py-1
                                        rounded-full
                                        bg-blue-100
                                        text-blue-600
                                        ">

                                            {blog.status}

                                        </span>





                                        <span className="
                                        flex
                                        items-center
                                        gap-1
                                        text-gray-500
                                        ">

                                            <FaEye/>

                                            {blog.views || 0}

                                        </span>



                                    </div>





                                    <Link
                                        to={`/blogs/${blog.slug}`}
                                        className="
                                        block
                                        mt-4
                                        text-blue-600
                                        hover:underline
                                        "
                                    >

                                        View Blog →

                                    </Link>





                                    {
                                        isMyProfile &&

                                        <div className="
                                        flex
                                        gap-3
                                        mt-5
                                        ">



                                            <Link
                                                to={`/edit-blog/${blog._id}`}
                                                className="
                                                bg-yellow-500
                                                text-white
                                                px-4
                                                py-2
                                                rounded-lg
                                                "
                                            >

                                                Edit

                                            </Link>





                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="
                                                bg-red-600
                                                text-white
                                                px-4
                                                py-2
                                                rounded-lg
                                                "
                                            >

                                                Delete

                                            </button>



                                        </div>

                                    }



                                </div>


                            ))
                        }


                    </div>

                }



            </div>



        </div>

    );

}


export default Profile;