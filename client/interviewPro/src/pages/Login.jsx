// //import React from 'react'
// import { ToastContainer } from "react-toastify";
// import "./Signup.css";
// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { handleError, handleSuccess } from "../utils";

// const Login = () => {
// 	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
// 	const [LoginInfo, setLoginInfo] = useState({
// 		email: "",
// 		password: "",
// 	});

// 	const navigate = useNavigate();
// 	const handleChange = (e) => {
// 		const { name, value } = e.target;
// 		console.log(name, value);
// 		const copyLoginInfo = { ...LoginInfo };
// 		copyLoginInfo[name] = value;
// 		setLoginInfo(copyLoginInfo);
// 	};

// 	const handleLogin = async (e) => {
// 		e.preventDefault();
// 		const { email, password } = LoginInfo;
// 		if (!email || !password) {
// 			return handleError("Empty Fields are invalid !");
// 		}
// 		try {
// 			const response = await fetch(`${VITE_NODE_ENDPOINT}/auth/login`, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(LoginInfo),
// 			});
// 			const result = await response.json();
// 			const { success, message, jwtToken, name, email, error } = result;
// 			if (success) {
// 				handleSuccess(message);
// 				localStorage.setItem("token", jwtToken);
// 				localStorage.setItem("loggedInUser", name);
// 				localStorage.setItem("loggedInEmail", email);

// 				setTimeout(() => {
// 					navigate("/dashboard");
// 				}, 1000);
// 			} else if (error) {
// 				const details = error?.details[0].message;
// 				handleError(details);
// 			} else if (!success) {
// 				handleError(message);
// 			}
// 			console.log(result);
// 		} catch (error) {
// 			handleError(error);
// 		}
// 	};

// 	return (
// 		<div className="container">
// 			<h1>Login</h1>
// 			<form action="" onSubmit={handleLogin}>
// 				<div>
// 					<label htmlFor="email">Email</label>
// 					<input onChange={handleChange} type="email" name="email" placeholder="Enter your email" value={LoginInfo.email} />
// 				</div>
// 				<div>
// 					<label htmlFor="password">Password</label>
// 					<input onChange={handleChange} type="password" name="password" placeholder="Enter your password" value={LoginInfo.password} />
// 				</div>
// 				<button>Login</button>
// 				<span>
// 					Dont have an account?
// 					<Link to="/signup">Signup</Link>
// 				</span>
// 			</form>
// 			<ToastContainer />
// 		</div>
// 	);
// };

// export default Login;

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT; // Backend endpoint
	const [loginInfo, setLoginInfo] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setLoginInfo({ ...loginInfo, [name]: value });
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		const { email, password } = loginInfo;

		if (!email || !password) {
			toast.error("Email and password are required!");
			return;
		}

		try {
			const response = await fetch(`${VITE_NODE_ENDPOINT}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(loginInfo),
			});

			const data = await response.json();
			if (data.success) {
				localStorage.setItem("token", data.jwtToken);
				localStorage.setItem("loggedInUser", data.name);
				toast.success("Login successful!");
				setTimeout(() => navigate("/dashboard"), 1000);
			} else {
				toast.error(data.message || "Login failed!");
			}
		} catch (error) {
			toast.error("An error occurred during login.");
		}
	};

	// Google Login Success Handler
	const handleGoogleLogin = async (response) => {
		try {
			const { credential } = response; // Get Google credential (ID Token)

			// Send the token to the backend for verification
			const res = await fetch(`${VITE_NODE_ENDPOINT}/auth/google/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: credential }),
			});

			const data = await res.json();
			if (data.success) {
				localStorage.setItem("token", data.jwtToken);
				localStorage.setItem("loggedInUser", data.name);
				toast.success("Google login successful!");
				setTimeout(() => navigate("/dashboard"), 1000);
			} else {
				toast.error(data.message || "Google login failed!");
			}
		} catch (error) {
			toast.error("An error occurred during Google login.");
		}
	};

	return (
		<div className="container">
			<h1>Login</h1>
			<form onSubmit={handleLogin}>
				<div>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" placeholder="Enter your email" value={loginInfo.email} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" placeholder="Enter your password" value={loginInfo.password} onChange={handleChange} />
				</div>
				<button type="submit">Login</button>
			</form>

			{/* Google Login Button */}
			<div style={{ marginTop: "20px" }}>
				<GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed!")} />
			</div>
			{/* Sign Up Link */}
			<div style={{ marginTop: "20px" }}>
				<p>
					Don't have an account?{" "}
					<span style={{ cursor: "pointer", color: "#007bff" }} onClick={() => navigate("/signup")}>
						Sign up here
					</span>
				</p>
			</div>
			<ToastContainer />
		</div>
	);
};

export default Login;
