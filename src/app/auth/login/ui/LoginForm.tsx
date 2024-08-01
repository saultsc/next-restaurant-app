'use client';

import { login } from '@/action';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter(); // Mover esta línea aquí

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		console.log({ email, password, rememberMe });

		const response = await login({ email, password, rememberMe });
		if (response.ok) {
			router.push(response.nextRoute);
		}
	};

	return (
		<div className="w-96">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={handleSubmit} method="POST">
				{/* Username Input */}
				<div className="mb-4">
					<label className="block text-gray-600">Correo</label>
					<input
						type="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
						autoComplete="off"
					/>
				</div>
				{/* Password Input */}
				<div className="mb-4">
					<label className="block text-gray-600">Contraseña</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
						autoComplete="off"
					/>
				</div>
				{/* Remember Me Checkbox */}
				<div className="mb-4 flex items-center">
					<input
						type="checkbox"
						name="rememberMe"
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
						className="text-blue-500"
					/>
					<label className="text-gray-600 ml-2">Recordar usuario</label>
				</div>
				{/* Login Button */}
				<LoginButton />
			</form>
		</div>
	);
};

function LoginButton() {
	return (
		<button
			type="submit"
			className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
		>
			Ingresar
		</button>
	);
}
