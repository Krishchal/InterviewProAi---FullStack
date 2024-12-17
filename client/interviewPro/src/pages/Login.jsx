//import React from 'react'
import { ToastContainer } from "react-toastify";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";

const Login = () => {
	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
	const [LoginInfo, setLoginInfo] = useState({
		email: "",
		password: "",
	});

	const navigate = useNavigate();
	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name, value);
		const copyLoginInfo = { ...LoginInfo };
		copyLoginInfo[name] = value;
		setLoginInfo(copyLoginInfo);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		const { email, password } = LoginInfo;
		if (!email || !password) {
			return handleError("Empty Fields are invalid !");
		}
		try {
			const response = await fetch(`${VITE_NODE_ENDPOINT}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(LoginInfo),
			});
			const result = await response.json();
			const { success, message, jwtToken, name, email, error } = result;
			if (success) {
				handleSuccess(message);
				localStorage.setItem("token", jwtToken);
				localStorage.setItem("loggedInUser", name);
				localStorage.setItem("loggedInEmail", email);

				setTimeout(() => {
					navigate("/dashboard");
				}, 1000);
			} else if (error) {
				const details = error?.details[0].message;
				handleError(details);
			} else if (!success) {
				handleError(message);
			}
			console.log(result);
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<div className="container">
			<h1>Login</h1>
			<form action="" onSubmit={handleLogin}>
				<div>
					<label htmlFor="email">Email</label>
					<input onChange={handleChange} type="email" name="email" placeholder="Enter your email" value={LoginInfo.email} />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input onChange={handleChange} type="password" name="password" placeholder="Enter your password" value={LoginInfo.password} />
				</div>
				<button>Login</button>
				<span>
					Dont have an account?
					<Link to="/signup">Signup</Link>
				</span>
			</form>
			<ToastContainer />
		</div>
	);
};

export default Login;
