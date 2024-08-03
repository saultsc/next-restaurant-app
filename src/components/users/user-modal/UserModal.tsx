'use client';

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
import { useState } from 'react';
import { IoCloseCircleOutline, IoSaveOutline } from 'react-icons/io5';

export const UserModal = () => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen);
	const closeDialog = useDialogStore((store) => store.closeDialog);

	const [selectedRole, setSelectedRole] = useState('');

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
				<header className="w-full h-16 border-b-2 bg-blue-500 rounded-t-sm text-white p-4">
					<h1 className="font-bold text-xl">Creando usuario</h1>
				</header>
				<form action="">
					<div className="h-full flex-col p-4 justify-between">
						<section className="space-y-4">
							<Input type="text" placeholder="Nombre completo" />
							<Input type="email" placeholder="Correo" />
							<Input type="password" placeholder="Contraseña" />
							<div className="relative">
								<Select value={selectedRole} onValueChange={setSelectedRole}>
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
							<Button
								variant="default"
								className="bg-green-600 hover:bg-green-700 text-white"
							>
								<IoSaveOutline size={20} className="mr-2" />
								AGREGAR
							</Button>
						</footer>
					</div>
				</form>
			</div>
		</div>
	);
};
