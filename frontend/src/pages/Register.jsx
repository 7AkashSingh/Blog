import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {
        const result = await dispatch(registerUser(data));

        if (registerUser.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Register
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    {/* Username */}

                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3"
                            {...register("username", {
                                required: "Username is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.username && (
                            <p className="text-red-500 text-sm">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Full Name */}

                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3"
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                        />

                        {errors.fullName && (
                            <p className="text-red-500 text-sm">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: "Invalid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Minimum 8 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            disabled={loading}
                            className="w-full border rounded-lg px-4 py-3"
                            {...register("confirmPassword", {
                                required: "Confirm your password",
                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Backend Error */}

                    {error && (
                        <div className="text-center text-red-500">
                            {error}
                        </div>
                    )}

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                    <p className="text-center text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default Register;