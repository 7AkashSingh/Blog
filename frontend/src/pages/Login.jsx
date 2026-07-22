import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const result = await dispatch(loginUser(data));

        if (loginUser.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* Email */}

                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}

                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Backend Error */}

                    {error && (
                        <div className="text-center text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Register
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Login;