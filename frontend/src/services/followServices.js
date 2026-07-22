import API from "../api/axios";


// Follow user
export const followUserAPI = async(userId)=>{

    const response = await API.post(
        `/follows/${userId}`
    );

    return response.data.data;
};



// Unfollow user
export const unfollowUserAPI = async(userId)=>{

    const response = await API.delete(
        `/follows/${userId}`
    );

    return response.data.data;
};



// Get followers
export const getFollowersAPI = async(userId)=>{

    const response = await API.get(
        `/follows/followers/${userId}`
    );

    return response.data.data;
};



// Get following
export const getFollowingAPI = async(userId)=>{

    const response = await API.get(
        `/follows/following/${userId}`
    );

    return response.data.data;
};



// Check follow status
export const checkFollowStatusAPI = async(userId)=>{

    const response = await API.get(
        `/follows/status/${userId}`
    );

    return response.data.data;
};