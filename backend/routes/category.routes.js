import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
// import { isAdmin } from "../middleware/isAdmin.middleware.js";
import { isAdmin } from "../middleware/isAdmin.middleware.js";


const router = Router();

// Public
router.get("/", getAllCategories);

// Admin
router.post("/", verifyJWT , isAdmin , createCategory);
router.patch("/:id", verifyJWT,  isAdmin , updateCategory);
router.delete("/:id", verifyJWT , isAdmin , deleteCategory);

export default router;