import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCurrentUser } from "../features/auth/authSlice";
import { fetchNotifications } from "../features/notification/notificationSlice";


function AuthInitializer({ children }) {

    const dispatch = useDispatch();

    const { user, loading } = useSelector(
        (state) => state.auth
    );


    useEffect(() => {

        dispatch(getCurrentUser());

    }, [dispatch]);


    useEffect(() => {

        if (user) {
            dispatch(fetchNotifications());
        }

    }, [user, dispatch]);


    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }


    return children;
}


export default AuthInitializer;