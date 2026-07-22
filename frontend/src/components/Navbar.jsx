import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice";

import { markNotificationRead } from "../features/notification/notificationSlice";
import { useState } from "react";
import { FaBell } from "react-icons/fa";


function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(
        (state)=>state.auth
    );

    const {notifications, unreadCount } = useSelector(
        (state)=> state.notifications
    )

    const [showNotifications, setShowNotifications ] = useState(false);


    const handleLogout = async()=>{
        await dispatch(logoutUser());
        navigate("/login");
    }

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            dispatch(markNotificationRead(notification._id));
        }
        setShowNotifications(false);
        if (notification.blog?.slug) {
            navigate(`/blogs/${notification.blog.slug}`);
        }
    };
    console.log("Notifications:", notifications);
console.log("Unread Count:", unreadCount);
    return (
        <header className="bg-[#ABC270] shadow-sm border-b ">
            <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <NavLink
                    to="/"
                    className="text-2xl font-bold text-[#473C33]"
                >
                    Blogify
                </NavLink>

                {/* Middle Links */}
                <div className="flex items-center gap-6">
                    <NavLink
                        to="/"
                        className={({isActive})=>
                            isActive
                            ?
                            "text-[#473C33] font-semibold"
                            :
                            "text-gray-700 hover:text-[#FDA769]"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/categories"
                        className={({isActive})=>
                            isActive
                            ?
                            "text-[#473C33] font-semibold"
                            :
                            "text-gray-700 hover:text-blue-600"
                        }
                    >
                        Categories
                    </NavLink>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {
                        isAuthenticated 
                        ?
                        <>
                            {/* Write Blog */}
                            <NavLink
                                to="/write"
                                className="
                                bg-blue-600
                                text-white
                                px-4
                                py-2
                                rounded-lg
                                hover:bg-blue-700"
                            >
                                Write
                            </NavLink>

                            <div className="relative">

    <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative text-xl text-gray-700 hover:text-blue-600"
        >
            <FaBell />

            {unreadCount > 0 && (
                <span
                    className=" absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full min-w-4.5 text-center"
                >
                    {unreadCount}
                </span>
            )}
        </button>

        {showNotifications && (
            <div
                className="
                absolute
                right-0
                mt-3
                w-80
                bg-white
                rounded-lg
                shadow-xl
                border
                z-50"
            >

                <div className="p-3 font-semibold border-b">
                    Notifications
                </div>

                {notifications.length === 0 ? (

                    <p className="p-4 text-gray-500 text-center">
                        No notifications
                    </p>

                ) : (

                    notifications.map((notification) => (

                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`
                                p-4
                                border-b
                                cursor-pointer
                                hover:bg-gray-100
                                ${!notification.isRead ? "bg-blue-50" : ""}
                            `}
                        >
                            <p className="text-sm">
                                {notification.message}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>

                    ))

                )}

            </div>
        )}

    </div>

                            {/* Profile */}
                            <NavLink
                                to={`/profile/${user?.username}`}
                                className="
                                text-gray-700
                                hover:text-blue-600
                                font-medium"
                            >
                                {user?.username}
                            </NavLink>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="
                                text-red-500
                                hover:text-red-700
                                font-medium"
                            >
                                Logout
                            </button>
                        </>
                        :
                        <>
                            <NavLink
                                to="/login"
                                className="
                                text-gray-700
                                hover:text-blue-600"
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className="
                                bg-blue-600
                                text-white
                                px-4
                                py-2
                                rounded-lg
                                hover:bg-blue-700"
                            >
                                Register
                            </NavLink>
                        </>
                    }
                </div>
            </nav>
        </header>
    );
}

export default Navbar;