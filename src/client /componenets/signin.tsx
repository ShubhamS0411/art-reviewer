import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LogStatus } from "../state/Context";


export default function Signin() {
    const [signinCreds, setSigninCreds] = useState<{ username: string, password: string }>({
        username: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState<{ success: string }>({ success: "" });
    const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:4000";
    const navigate = useNavigate();
    const { setStatus } = useContext(LogStatus);
    
 

    const loginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const securedPassword = signinCreds.password.trim();
        const securedEmail = signinCreds.username.trim().toLowerCase();

        if (securedPassword && securedEmail) {
            axios
                .post(
                    `${API_URL}/api/signin`,
                    {
                        username: signinCreds.username,
                        password: signinCreds.password,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        setErrorMessage((prev) => ({ ...prev, success: res.data.message }));
                        navigate("/dashboard");
                        setStatus(true);
                    }
                })
                .catch((error) => {
                    const errorMessage = error.response?.data?.message || "Error signing in";
                    setErrorMessage((prev) => ({ ...prev, success: errorMessage }));
                });
        }
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
                <meta name="signIn" content="Sign in for image reviewer" />
            </Helmet>
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-gray-800">Sign In</h1>

                    <form onSubmit={loginSubmit} className="space-y-6" aria-label="Sign in form">
                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                value={signinCreds.username}
                                onChange={(e) => setSigninCreds({ ...signinCreds, username: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={signinCreds.password}
                                onChange={(e) => setSigninCreds({ ...signinCreds, password: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {errorMessage.success && (
                            <p
                                className={`text-sm text-center ${
                                    errorMessage.success.includes("not") ? "text-red-600" : "text-green-600"
                                }`}
                            >
                                {errorMessage.success}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </main>
        </>
    );
}
