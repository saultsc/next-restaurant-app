'use client';

import React, { useState, useEffect } from 'react';
import { login } from './action/auth.action';
import { useRouter } from 'next/navigation';

const Login = () => {
	const router = useRouter();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false,
	});

	useEffect(() => {
		const savedEmail = localStorage.getItem('email');
		if (savedEmail) {
			setFormData((prevData) => ({
				...prevData,
				email: savedEmail,
			}));
		}
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const response = await login(formData);

		if (!response.ok) {
			return;
		}

		formData.remember
			? localStorage.setItem('email', formData.email)
			: localStorage.removeItem('email');
		document.cookie = `token=${response.token}; path=/; max-age=3600;`;

		router.push('/');
	};

	return (
		<div className="w-96">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={handleSubmit}>
				{/* Username Input */}
				<div className="mb-4">
					<label className="block text-gray-600">Correo</label>
					<input
						type="email"
						id="email"
						name="email"
						className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
						autoComplete="off"
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				{/* Password Input */}
				<div className="mb-4">
					<label className="block text-gray-600">Contraseña</label>
					<input
						type="password"
						name="password"
						className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
						autoComplete="off"
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
				{/* Remember Me Checkbox */}
				<div className="mb-4 flex items-center">
					<input
						type="checkbox"
						name="remember"
						className="text-blue-500"
						checked={formData.remember}
						onChange={handleChange}
					/>
					<label htmlFor="remember" className="text-gray-600 ml-2">
						Recordar usuario
					</label>
				</div>
				{/* Login Button */}
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
				>
					Ingresar
				</button>
			</form>
		</div>
	);
};

export default Login;
