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
import { getSala } from '@/action';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type SalaModalProps = {
	addSala: (sala: any) => void;
	updateSala: (sala: any) => void;
};

const salaSchema = z.object({
	nombre: z.string().nonempty('El nombre es requerido'),
});

export const SalaModal = ({ addSala, updateSala }: SalaModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [nombre, setNombre] = useState('');
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
		const fetchSala = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getSala({ id: currentItemId });
					const sala = response.data[0];

					if (sala && isMounted.current) {
						setNombre(sala.nombre);
					}
				} catch (error) {
					console.log('Error fetching sala:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				resetFields();
				setIsLoading(false);
			}
		};

		if (isDialogOpen) {
			fetchSala();
		}
	}, [isEditing, currentItemId, isDialogOpen]);

	const resetFields = () => {
		setNombre('');
		setErrors({});
	};

	const handleSave = () => {
		// Verificar si hay errores antes de proceder
		const newErrors: { [key: string]: string } = {};
		if (!nombre) {
			newErrors.nombre = 'El nombre es requerido';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			toast.error('Por favor, corrige los errores antes de continuar.', {
				toastId: 'error-toast',
			});
			return;
		}

		const sala = { id: currentItemId, nombre };

		try {
			salaSchema.parse(sala);
			if (isEditing) {
				updateSala(sala);
				toast.success('Sala actualizada con éxito', { toastId: 'success-toast' });
			} else {
				addSala(sala);
				toast.success('Sala creada con éxito', { toastId: 'success-toast' });
			}
			closeDialog();
			resetFields();
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
		resetFields();
	};

	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setter(value);

			let errorMessage = '';
			if (field === 'nombre' && !value) {
				errorMessage = 'El nombre es requerido';
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
						<DialogTitle>{isEditing ? 'Editar sala' : 'Agregar sala'}</DialogTitle>
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles de la sala a continuación.'
									: 'Rellena los detalles para agregar una nueva sala.'}
							</DialogDescription>
						</div>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<Input
							value={nombre}
							onChange={handleInputChange(setNombre, 'nombre')}
							placeholder="Nombre de la sala"
						/>
						<div className="h-4">
							{errors.nombre && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.nombre}
								</p>
							)}
						</div>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar sala'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
