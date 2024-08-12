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

type Estado = 'disponible' | 'ocupado' | 'reservado';

type MesaModalProps = {
	addMesa: (mesa: any) => void;
	updateMesa: (mesa: any) => void;
};

export const MesaModal = ({ addMesa, updateMesa }: MesaModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [nombre, setNombre] = useState('');
	const [estado, setEstado] = useState<Estado | ''>('disponible');
	const [capacidad, setCapacidad] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

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
	};

	const validateFields = () => {
		if (!nombre) return 'El nombre es requerido';
		if (!estado) return 'El estado es requerido';
		if (capacidad <= 0) return 'La capacidad debe ser mayor a 0';
		return null;
	};

	const handleSave = () => {
		const validationError = validateFields();
		if (validationError) {
			toast.error(validationError);
			return;
		}

		const mesa = { id: currentItemId, nombre, estado, capacidad };
		if (isEditing) {
			updateMesa(mesa);
			toast.success('Mesa actualizada con éxito');
		} else {
			addMesa(mesa);
			toast.success('Mesa creada con éxito');
		}
		closeDialog();
		resetFields();
	};

	const handleClose = () => {
		closeDialog();
		resetFields();
	};

	const handleCapacidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(e.target.value);
		if (value >= 0) {
			setCapacidad(value);
		}
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
							onChange={(e) => setNombre(e.target.value)}
							placeholder="Nombre"
						/>
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
						<Input
							type="number"
							value={capacidad}
							onChange={handleCapacidadChange}
							placeholder="Capacidad"
						/>
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
