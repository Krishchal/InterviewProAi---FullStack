//import React from 'react'
import { ToastContainer } from "react-toastify";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";

const Signup = () => {
	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
	const [signupInfo, setSignupInfo] = useState({
		name: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();
	const handleChange = (e) => {
		const { name, value } = e.target;
		console.log(name, value);
		const copySignupInfo = { ...signupInfo };
		copySignupInfo[name] = value;
		setSignupInfo(copySignupInfo);
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		const { name, email, password } = signupInfo;
		if (!name || !email || !password) {
			return handleError("Empty Fields are invalid !");
		}
		try {
			// const url = "http://10.200.10.222:8001/api/auth/signup";
			// const url = "http://localhost:8010/api/auth/signup";

			const response = await fetch(`${VITE_NODE_ENDPOINT}/auth/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(signupInfo),
			});
			const result = await response.json();
			console.log(result);
			const { success, message, error } = result; //
			if (success) {
				handleSuccess(message);

				setTimeout(() => {
					navigate("/login");
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
			<h1>Signup</h1>
			<form action="" onSubmit={handleSignup}>
				<div>
					<label htmlFor="name">Name</label>
					<input onChange={handleChange} type="text" name="name" autoFocus placeholder="Enter your name" value={signupInfo.name} />
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input onChange={handleChange} type="email" name="email" placeholder="Enter your email" value={signupInfo.email} />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input onChange={handleChange} type="password" name="password" placeholder="Enter your password" value={signupInfo.password} />
				</div>
				<button>Signup</button>
				<span>
					Already have an account?
					<Link to="/login">Login</Link>
				</span>
			</form>
			<ToastContainer />
		</div>
	);
};

export default Signup;
