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
import { getDepartamentos } from '@/action';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type DepartamentoModalProps = {
	addDepartamento: (departamento: any) => void;
	updateDepartamento: (departamento: any) => void;
};

const departamentoSchema = z.object({
	nombre: z.string().nonempty('El nombre es requerido'),
	provincia: z.string().nonempty('La provincia es requerida'),
});

export const DepartamentoModal = ({
	addDepartamento,
	updateDepartamento,
}: DepartamentoModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [nombre, setNombre] = useState('');
	const [provincia, setProvincia] = useState('');
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
		const fetchDepartamento = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getDepartamentos({ id: currentItemId });
					const departamento = response.data[0];

					if (departamento && isMounted.current) {
						setNombre(departamento.nombre ?? '');
						setProvincia(departamento.provincia ?? '');
					}
				} catch (error) {
					console.log('Error fetching departamento:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchDepartamento();
	}, [isEditing, currentItemId]);

	const resetFields = () => {
		setNombre('');
		setProvincia('');
		setErrors({});
	};

	const handleSave = () => {
		if (Object.keys(errors).some((key) => errors[key])) {
			return;
		}

		const departamento = {
			id: currentItemId,
			nombre,
			provincia,
		};

		try {
			departamentoSchema.parse(departamento);
			if (isEditing) {
				updateDepartamento(departamento);
				toast.success('Departamento actualizado con éxito');
			} else {
				addDepartamento(departamento);
				toast.success('Departamento creado con éxito');
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
			if (field === 'nombre' && !value) {
				errorMessage = 'El nombre es requerido';
			} else if (field === 'provincia' && !value) {
				errorMessage = 'La provincia es requerida';
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
							{isEditing ? 'Editar departamento' : 'Agregar departamento'}
						</DialogTitle>
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles del departamento a continuación.'
									: 'Rellena los detalles para agregar un nuevo departamento.'}
							</DialogDescription>
						</div>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<Input
							value={nombre}
							onChange={handleInputChange(setNombre, 'nombre')}
							placeholder="Nombre"
						/>
						<div className="h-4">
							{errors.nombre && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.nombre}
								</p>
							)}
						</div>
						<Input
							value={provincia}
							onChange={handleInputChange(setProvincia, 'provincia')}
							placeholder="Provincia"
						/>
						<div className="h-4">
							{errors.provincia && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.provincia}
								</p>
							)}
						</div>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar departamento'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
