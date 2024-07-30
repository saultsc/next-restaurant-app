'use client';

import React, { useState } from 'react';
import { redirect } from 'next/navigation';
import { login } from './action/auth.action';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		remember: false,
	});

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
			console.error(response.message);
			return;
		}

		redirect('/');
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
