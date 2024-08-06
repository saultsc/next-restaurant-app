'use client';

import { getUser } from '@/action/user/get.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useDialogStore } from '@/store';
import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Role = 'admin' | 'user';

type UserModalProps = {
	addUser: (user: any) => void;
	updateUser: (user: any) => void;
};

export const UserModal = ({ addUser, updateUser }: UserModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role | ''>('');
	const [isLoading, setIsLoading] = useState(true);

	const isMounted = useRef(false);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getUser({ id: currentItemId });
					const user = response.data[0];

					if (user && isMounted.current) {
						setFullName(user.fullName);
						setEmail(user.email);
						setPassword(user.password);
						setSelectedRole(user.role as Role);
					}
				} catch (error) {
					console.log('Error fetching user:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				// Clear fields when not editing
				resetFields();
				setIsLoading(false);
			}
		};

		if (isDialogOpen) {
			fetchUser();
		}
	}, [isEditing, currentItemId, isDialogOpen]);

	const resetFields = () => {
		setFullName('');
		setEmail('');
		setPassword('');
		setSelectedRole('');
	};

	const validateFields = () => {
		if (!fullName) return 'El nombre completo es requerido';
		if (!email) return 'El correo electrónico es requerido';
		if (!password) return 'La contraseña es requerida';
		if (!selectedRole) return 'El rol es requerido';
		return null;
	};

	const handleSave = () => {
		const validationError = validateFields();
		if (validationError) {
			toast.error(validationError);
			return;
		}

		const user = { id: currentItemId, fullName, email, password, role: selectedRole };
		if (isEditing) {
			updateUser(user);
			toast.success('Usuario actualizado con éxito');
		} else {
			addUser(user);
			toast.success('Usuario creado con éxito');
		}
		closeDialog();
		setTimeout(() => {
			resetFields();
		}, 600);
	};

	const handleClose = () => {
		closeDialog();
		setTimeout(() => {
			resetFields();
		}, 600);
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>
							{isEditing ? 'Editar usuario' : 'Agregar usuario'}
						</DialogTitle>
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles del usuario a continuación.'
									: 'Rellena los detalles para agregar un nuevo usuario.'}
							</DialogDescription>
						</div>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<Input
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Nombre completo"
						/>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Correo electrónico"
						/>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Contraseña"
						/>
						<Select
							value={selectedRole}
							onValueChange={(value: Role | '') => setSelectedRole(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar rol" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">Administrador</SelectItem>
								<SelectItem value="user">Usuario</SelectItem>
							</SelectContent>
						</Select>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar usuario'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
