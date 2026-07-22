import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import store from "./app/store";
import router from "./routes/AppRoutes";

import AuthInitializer from "./components/AuthInitializer";


createRoot(document.getElementById("root")).render(
    <StrictMode>

        <Provider store={store}>

            <AuthInitializer>

                <RouterProvider router={router} />

            </AuthInitializer>

        </Provider>

    </StrictMode>
);