import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "../layout/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import CreateBlog from "../pages/CreateBlog";
import MyBlogs from "../pages/MyBlogs";
import BlogDetails from "../pages/BlogDetails";
import EditBlog from "../pages/EditBlog";
import Search from "../components/SearchBar";
import ProtectedRoute from "./ProtectedRoutes";


const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "blogs/:slug",
                element: <BlogDetails />,
            },
            {
                path: "profile/:username",
                element: <Profile />,
            },
            {
                path: "write",
                element: <CreateBlog />,
            },
            {
                path: "my-blogs",
                element: <MyBlogs />,
            },
            {
                path: "edit-blog/:id",
                element: <EditBlog />,
            }
        ],
    },

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/register",
        element: <Register />,
    },
     {
        path: "/search",
        element: <Search />,
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;