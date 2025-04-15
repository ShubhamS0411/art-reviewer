import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { set } from "lodash";

interface AccountData {
    account_type: string[];
    email: string;
    username: string;
    password: string;
    upi: string;
}

interface ErrorData {
    account_type: string;
    username: string;
    password: string;
    email: string;
    upi: string;
}

export default function Signup() {
    const navigate = useNavigate();

    const [account, setAccount] = useState<AccountData>({
        account_type: [],
        email: "",
        username: "",
        password: "",
        upi: "",
    });

    const [error, setError] = useState<ErrorData>({
        account_type: "",
        username: "",
        password: "",
        email: "",
        upi: "",
    });

    const [message, setMessage] = useState<string>("");
    const characters: string[] = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '='];
    const API_URL: string = import.meta.env.REACT_APP_API_URL || 'http://localhost:4000';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const sanitizedEmail = account.email.toLowerCase().trim();
        const sanitizedPassword = account.password.trim();
        const sanitizedUsername = account.username.trim();

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        setError({ username: "", password: "", email: "", upi: "", account_type: "" });

        if(!account.account_type.length) {
            setError((prev) => ({ ...prev, account_type: "Please select a role" }));
            return;
        }

        if (!sanitizedEmail.includes("@gmail.com")) {
            setError((prev) => ({ ...prev, email: "Please enter a valid Gmail address" }));
            return;
        }

        if (characters.some((char) => sanitizedUsername.includes(char))) {
            setError((prev) => ({ ...prev, username: "Username cannot have special characters" }));
            return;
        }

        if (!regexPassword.test(sanitizedPassword)) {
            setError((prev) => ({ ...prev, password: "Please enter a strong password" }));
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/signup`,
                {
                    account_type: account.account_type,
                    email: sanitizedEmail,
                    username: sanitizedUsername,
                    password: sanitizedPassword,
                    upi: account.upi,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true, // So cookies are received
                }
            );

            if (response.status === 201) {
                setMessage(response.data.message, );
                setTimeout(() => {
                    navigate('/signin', { replace: true });
                },4000);
                
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Error signing up";
            setMessage(errorMessage);
        }
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const role = event.target.value;
        setAccount((prev) => {
            if (event.target.checked) {
                return { ...prev, account_type: [...prev.account_type, role] };
            } else {
                return {
                    ...prev,
                    account_type: prev.account_type.filter((item) => item !== role),
                };
            }
        });
    };

    return (
        <>
            <Helmet>
                <meta name="Sign Up" content="Sign Up Your Account" />
                <meta name="description" content="Sign Up Your Account" />
                <meta name="keywords" content="Sign Up Your Account" />
            </Helmet>

            <main className="flex justify-center items-center h-screen bg-gray-100">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col border border-gray-300 p-6 rounded-lg shadow-md bg-white w-full max-w-md"
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Sign Up Your Account
                    </h1>

                    <label className="text-gray-700 font-medium mb-2">Account Type</label>
                    <div className="flex flex-col mb-4">
                        {['Creator', 'Reviewer'].map((role) => (
                            <label key={role} className="inline-flex items-center text-gray-700 mb-1">
                                <input
                                    type="checkbox"
                                    value={role}
                                    checked={account.account_type.includes(role)}
                                    onChange={handleRoleChange}
                                    className="mr-2"
                                    
                                />
                                {role}
                            </label>
                            
                        ))}
                        {error.account_type && <span className="text-red-500 text-sm">{error.account_type}</span>}
                    </div>
                    

                    <label className="text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                        value={account.email}
                        onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))}
                        required
                    />
                    {error.email && <span className="text-red-500 text-sm">{error.email}</span>}

                    <label className="text-gray-700 font-medium mb-2">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                        value={account.username}
                        onChange={(e) => setAccount((prev) => ({ ...prev, username: e.target.value }))}
                        required
                    />
                    {error.username && <span className="text-red-500 text-sm">{error.username}</span>}

                    <label className="text-gray-700 font-medium mb-2">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-2"
                        value={account.password}
                        onChange={(e) => setAccount((prev) => ({ ...prev, password: e.target.value }))}
                        required
                    />
                    {error.password && <span className="text-red-500 text-sm">{error.password}</span>}

                    <label className="text-gray-700 font-medium mb-2">UPI ID</label>
                    <input
                        type="text"
                        placeholder="Enter your UPI ID (optional)"
                        className="border border-gray-300 rounded-md px-3 py-2 mb-4"
                        value={account.upi}
                        onChange={(e) => setAccount((prev) => ({ ...prev, upi: e.target.value }))}
                    />

                    {message && <p className={message.includes("successfully") ? "text-green-600 text-center mb-2" : "text-red-600 text-center mb-2"}>{message}</p>}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Signup
                    </button>
                </form>
            </main>
        </>
    );
}
