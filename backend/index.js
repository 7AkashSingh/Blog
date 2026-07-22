import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

import connectDB from "./config/db.js";
import { app } from "./app.js";


console.log("MONGO_URI RAW:", JSON.stringify(process.env.MONGO_URI));


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server connected at port ${process.env.PORT || 8000}`
            );
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });