import { meta } from '@eslint/js';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import validator from "validator"

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const nav = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        if (username.length < 2) {
            setError("Username should be atleast 2 char maximum 15 char ")
            return
        }
        if (password.length < 8) {
            setError("Password should be atleast 8 char")
            return
        }
        const isMail = validator.isEmail(username)

        async function loginUser() {
            try {
                const res = await axios.post(import.meta.env.VITE_DOMAIN + "/api/auth/signin", { [isMail ? "mail" : "username"]: username, password }, { withCredentials: true })
                console.log(res)
                nav("/home")
            } catch (error) {
                setUsername("")
                setPassword("")
                setError(error?.response?.data?.error || "Something went wrong");
                // setError(error.response.data.error)
            }

        } loginUser()
        setError('');
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-900">
                    Login to Varta
                </h2>
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}


                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            username address
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="email"
                                autoComplete="email"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>



                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>



                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>



                    <div>
                        <button
                            onClick={handleLogin}
                            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </div>



                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Sign up
                    </Link>
                </p>



            </div>
        </div>
    );
};

export default Login;