'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useDialogStore } from '@/store';
import { useState, useEffect, useRef } from 'react';
import { getUser } from '@/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type UserModalProps = {
	addUser: (user: any) => void;
	updateUser: (user: any) => void;
};

const userSchema = z.object({
	email: z
		.string()
		.email('El correo electrónico no es válido')
		.nonempty('El correo es requerido'),
	fullName: z.string().nonempty('El nombre completo es requerido'),
	password: z.string().nonempty('La contraseña es requerida'),
	role: z.string().nonempty('El rol es requerido'),
});

export const UserModal = ({ addUser, updateUser }: UserModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [email, setEmail] = useState('');
	const [fullName, setFullName] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
						setEmail(user.email);
						setFullName(user.fullName);
						setPassword(user.password);
						setRole(user.role);
					}
				} catch (error) {
					console.log('Error fetching user:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				resetFields();
				setIsLoading(false);
			}
		};

		if (isDialogOpen) {
			fetchUser();
		}
	}, [isEditing, currentItemId, isDialogOpen]);

	const resetFields = () => {
		setEmail('');
		setFullName('');
		setPassword('');
		setRole('');
		setErrors({});
	};

	const handleSave = () => {
		// Verificar si hay errores antes de proceder
		const newErrors: { [key: string]: string } = {};
		if (!email) {
			newErrors.email = 'El correo es requerido';
		} else if (!z.string().email().safeParse(email).success) {
			newErrors.email = 'El correo electrónico no es válido';
		}
		if (!fullName) {
			newErrors.fullName = 'El nombre completo es requerido';
		}
		if (!password) {
			newErrors.password = 'La contraseña es requerida';
		}
		if (!role) {
			newErrors.role = 'El rol es requerido';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			toast.error('Por favor, corrige los errores antes de continuar.', {
				toastId: 'error-toast',
			});
			return;
		}

		const user = { id: currentItemId, email, fullName, password, role };

		try {
			userSchema.parse(user);
			if (isEditing) {
				updateUser(user);
				toast.success('Usuario actualizado con éxito', { toastId: 'success-toast' });
			} else {
				addUser(user);
				toast.success('Usuario creado con éxito', { toastId: 'success-toast' });
			}
			closeDialog();
			setTimeout(() => {
				resetFields();
			}, 600);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: { [key: string]: string } = {};
				error.errors.forEach((err) => {
					newErrors[err.path[0]] = err.message;
				});
				setErrors(newErrors);
			}
		}
	};

	const handleClose = () => {
		closeDialog();
		setTimeout(() => {
			resetFields();
		}, 600);
	};

	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value = e.target.value;
			setter(value);

			let errorMessage = '';
			if (field === 'email') {
				if (!value) {
					errorMessage = 'El correo es requerido';
				} else if (!z.string().email().safeParse(value).success) {
					errorMessage = 'El correo electrónico no es válido';
				}
			} else if (field === 'fullName' && !value) {
				errorMessage = 'El nombre completo es requerido';
			} else if (field === 'password' && !value) {
				errorMessage = 'La contraseña es requerida';
			} else if (field === 'role' && !value) {
				errorMessage = 'El rol es requerido';
			}

			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: errorMessage,
			}));
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
							value={email}
							onChange={handleInputChange(setEmail, 'email')}
							placeholder="Correo electrónico"
						/>
						<div className="h-4">
							{errors.email && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.email}
								</p>
							)}
						</div>
						<Input
							value={fullName}
							onChange={handleInputChange(setFullName, 'fullName')}
							placeholder="Nombre completo"
						/>
						<div className="h-4">
							{errors.fullName && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.fullName}
								</p>
							)}
						</div>
						<Input
							value={password}
							onChange={handleInputChange(setPassword, 'password')}
							placeholder="Contraseña"
							type="password"
						/>
						<div className="h-4">
							{errors.password && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.password}
								</p>
							)}
						</div>
						<select
							value={role}
							onChange={handleInputChange(setRole, 'role')}
							className="input border border-gray-300 rounded-md w-full p-2"
						>
							<option value="">Selecciona un rol</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
						<div className="h-4">
							{errors.role && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.role}
								</p>
							)}
						</div>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar usuario'}
						</Button>
					</div>
				</DialogContent>
				<ToastContainer />
			</Dialog>
		</>
	);
};
