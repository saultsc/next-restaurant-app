'use client';

import { getMesas } from '@/action/mesa/get.action';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Dialog,
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
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type Estado = 'disponible' | 'ocupado' | 'reservado';

type MesaModalProps = {
	addMesa: (mesa: any) => void;
	updateMesa: (mesa: any) => void;
};

const mesaSchema = z.object({
	nombre: z.string().nonempty('El nombre es requerido'),
	estado: z.enum(['disponible', 'ocupado', 'reservado']),
	capacidad: z.number().min(1, 'La capacidad debe ser mayor a 0'),
});

export const MesaModal = ({ addMesa, updateMesa }: MesaModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [nombre, setNombre] = useState('');
	const [estado, setEstado] = useState<Estado | ''>('disponible');
	const [capacidad, setCapacidad] = useState(0);
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
		const fetchMesa = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getMesas({ id: currentItemId });
					const mesa = response.data[0];

					if (mesa && isMounted.current) {
						setNombre(mesa.nombre);
						setEstado(mesa.estado as Estado);
						setCapacidad(mesa.capacidad);
					}
				} catch (error) {
					console.log('Error fetching mesa:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				resetFields();
				setIsLoading(false);
			}
		};

		if (isDialogOpen) {
			fetchMesa();
		}
	}, [isEditing, currentItemId, isDialogOpen]);

	const resetFields = () => {
		setNombre('');
		setEstado('disponible');
		setCapacidad(0);
		setErrors({});
	};

	const handleSave = () => {
		// Verificar si hay errores antes de proceder
		if (Object.keys(errors).some((key) => errors[key])) {
			toast.error('Por favor, corrige los errores antes de continuar.');
			return;
		}

		const mesa = {
			id: currentItemId,
			nombre,
			estado,
			capacidad,
		};

		try {
			mesaSchema.parse(mesa);
			if (isEditing) {
				updateMesa(mesa);
				toast.success('Mesa actualizada con éxito');
			} else {
				addMesa(mesa);
				toast.success('Mesa creada con éxito');
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
		(setter: React.Dispatch<React.SetStateAction<any>>, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value = e.target.value;
			setter(value);

			let errorMessage = '';
			if (field === 'nombre' && !value) {
				errorMessage = 'El nombre es requerido';
			} else if (field === 'estado' && !value) {
				errorMessage = 'El estado es requerido';
			} else if (field === 'capacidad' && Number(value) <= 0) {
				errorMessage = 'La capacidad debe ser mayor a 0';
			}

			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: errorMessage,
			}));
		};

	const handleCapacidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Math.max(0, Number(e.target.value)); // No permitir valores menores a 0
		setCapacidad(value);

		let errorMessage = '';
		if (value <= 0) {
			errorMessage = 'La capacidad debe ser mayor a 0';
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			capacidad: errorMessage,
		}));
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>{isEditing ? 'Editar mesa' : 'Agregar mesa'}</DialogTitle>
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles de la mesa a continuación.'
									: 'Rellena los detalles para agregar una nueva mesa.'}
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
						<Select
							value={estado}
							onValueChange={(value: Estado | '') => setEstado(value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="disponible">Disponible</SelectItem>
								<SelectItem value="ocupado">Ocupado</SelectItem>
								<SelectItem value="reservado">Reservado</SelectItem>
							</SelectContent>
						</Select>
						<div className="h-4">
							{errors.estado && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.estado}
								</p>
							)}
						</div>
						<Input
							type="number"
							value={capacidad}
							onChange={handleCapacidadChange}
							placeholder="Capacidad"
							min={0} // No permitir valores menores a 0
						/>
						<div className="h-4">
							{errors.capacidad && (
								<p className="text-red-500 flex items-center">
									<IoInformationCircle className="mr-1" />
									{errors.capacidad}
								</p>
							)}
						</div>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar mesa'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
