import ApiError from "../utils/ApiError.js";

export const isAdmin= (req, res, next)=>{
    if(!req.user){
        return next(new ApiError(401, "Unauthorised"));
    }

    if(req.user.role!== "admin"){
        return next(
            new ApiError(403, "Access denied. Admins only.")
        )
    }
    next();
}