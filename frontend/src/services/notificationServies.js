import API from "../api/axios";

export const getNotificationsAPI  = async()=>{
    const response = await API.get("/notifications");
    console.log("Notification Api Response", response.data);
    return response.data.data;
}

export const markNotificationReadAPI = async (notificationId) => {

    const response = await API.patch(
        `/notifications/${notificationId}/read`
    );

    return response.data.data;
};