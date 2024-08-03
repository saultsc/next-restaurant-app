'use client';

import { getAction } from '@/action/user/get-action';
import { postAction } from '@/action/user/post-action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useDialogStore } from '@/store';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { IoCloseCircleOutline, IoCloseOutline, IoSaveOutline } from 'react-icons/io5';

type Role = 'admin' | 'user';

type UserModalProps = {
	addUser: (user: any) => void;
	updateUser: (user: any) => void;
};

export const UserModal = ({ addUser, updateUser }: UserModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role | ''>('');

	useEffect(() => {
		const fetchUser = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getAction({ id: currentItemId });
					const user = response.data[0];

					if (user) {
						setFullName(user.fullName);
						setEmail(user.email);
						setPassword(user.password);
						setSelectedRole(user.role as Role);
					}
				} catch (error) {
					console.error('Error fetching user:', error);
				}
			}
		};

		fetchUser();
	}, [isEditing, currentItemId]);

	useEffect(() => {
		if (!isEditing && isDialogOpen) {
			setFullName('');
			setEmail('');
			setPassword('');
			setSelectedRole('');
		}
	}, [isEditing, isDialogOpen]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const newUser = {
				fullName,
				email,
				password,
				role: selectedRole as Role,
			};
			if (isEditing && currentItemId) {
				await updateUser({ ...newUser, id: currentItemId });
			} else {
				await postAction(newUser);
				addUser(newUser);
			}
			closeDialog();
		} catch (error) {
			console.error('Error creating/updating user:', error);
		}
	};

	return (
		<div>
			{/* Background */}
			{isDialogOpen && (
				<div
					onClick={closeDialog}
					className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
				/>
			)}

			{/* Blur */}
			{isDialogOpen && (
				<div
					onClick={closeDialog}
					className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
				/>
			)}

			{/* Dialog */}
			<div
				className={clsx(
					'fixed top-1/2 left-1/2 w-[700px] h-[600px] rounded-sm bg-white z-20 shadow-2xl transform transition-all duration-200',
					{
						'opacity-0 scale-50': !isDialogOpen,
						'opacity-100 scale-100 -translate-x-1/2 -translate-y-1/2': isDialogOpen,
					}
				)}
			>
				<header className="flex justify-between w-full h-16 border-b-2 bg-blue-500 rounded-t-sm text-white p-4">
					<h1 className="font-bold text-xl">
						{isEditing ? 'Editando usuario' : 'Creando usuario'}
					</h1>
					<IoCloseOutline
						onClick={closeDialog}
						size={30}
						className="cursor-pointer hover:text-black/80"
					/>
				</header>
				<form onSubmit={handleSubmit}>
					<div className="h-full flex-col p-4 justify-between">
						<section className="space-y-4">
							<Input
								type="text"
								placeholder="Nombre completo"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
							/>
							<Input
								type="email"
								placeholder="Correo"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								type="password"
								placeholder="Contraseña"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<div className="relative">
								<Select
									value={selectedRole}
									onValueChange={(value: Role | '') => setSelectedRole(value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Roles" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="admin">Administrador</SelectItem>
										<SelectItem value="user">Usuario</SelectItem>
									</SelectContent>
								</Select>
								{selectedRole && (
									<IoCloseCircleOutline
										size={20}
										onClick={() => setSelectedRole('')}
										className="absolute top-1/2 right-8 transform -translate-y-1/2 cursor-pointer"
									/>
								)}
							</div>
						</section>
						<footer className="flex justify-end p-4 m-auto">
							{
								<Button
									type="submit"
									variant="default"
									className="bg-green-600 hover:bg-green-700 text-white"
								>
									<IoSaveOutline size={20} className="mr-2" />
									{isEditing ? 'ACTUALIZAR' : 'AGREGAR'}
								</Button>
							}
						</footer>
					</div>
				</form>
			</div>
		</div>
	);
};
