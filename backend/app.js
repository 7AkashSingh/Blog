import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(cors({
    origin:[ 
        process.env.CORS_ORIGIN,
        "http://localhost:3000",
        "http://localhost:5174",
        "http://localhost:5173"
    ],
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import categoryRouter from "./routes/category.routes.js";
import commentRouter from "./routes/commentes.routes.js"
import likesRouter from "./routes/LIkes.routes.js"
import bookmarkRouter from "./routes/bookmarks.routes.js"
import followRouter from "./routes/follow.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// route declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRouter);


// test route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});



export { app };