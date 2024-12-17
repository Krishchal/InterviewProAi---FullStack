//import React from 'react'

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";

const Home = () => {
	const VITE_NODE_ENDPOINT = import.meta.env.VITE_NODE_ENDPOINT;
	const [loggedInUser, setLoggedInUser] = useState("");
	const [products, setProducts] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		setLoggedInUser(localStorage.getItem("loggedInUser"));
	}, []);

	const handleLogout = (e) => {
		localStorage.removeItem("token");
		localStorage.removeItem("loggedInUser");
		handleSuccess("you are loggedout");
		setTimeout(() => {
			navigate("/login");
		}, 1000);
	};

	const fetchProducts = async () => {
		try {
			// const url = "http://localhost:8010/api/products";
			const headers = {
				headers: {
					Authorization: localStorage.getItem("token"),
				},
			};
			const response = await fetch(`${VITE_NODE_ENDPOINT}/products`, headers);
			const result = await response.json();
			console.log(result);
			setProducts(result);
		} catch (error) {
			handleError(error);
		}
	};
	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div>
			<div> Welcome : {loggedInUser}</div>
			<button onClick={handleLogout}>Logout</button>
			<div>
				{products && (
					<ul>
						<li>Name: {products.name}</li>
						<li>Post: {products.post}</li>
						<li>Description: {products.desc}</li>
					</ul>
				)}
			</div>
			<ToastContainer />
		</div>
	);
};

export default Home;
