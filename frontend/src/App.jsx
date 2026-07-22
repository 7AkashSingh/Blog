import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCurrentUser } from "./features/auth/authSlice";
import { fetchNotifications } from "./features/notification/notificationSlice.js";


function App() {

    const dispatch = useDispatch();

    const { user } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch]);

    console.log("User:", user);

useEffect(() => {
    console.log("Effect ran. User:", user);

    if (user) {
        console.log("Dispatching fetchNotifications");
        dispatch(fetchNotifications());
    }
}, [user, dispatch]);

    return <></>;
}

export default App;