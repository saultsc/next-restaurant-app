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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type DepartamentoModalProps = {
	addDepartamento: (departamento: any) => void;
	updateDepartamento: (departamento: any) => void;
};

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
	};

	const validateFields = () => {
		if (!nombre) return 'El nombre es requerido';
		if (!provincia) return 'La provincia es requerida';
		return null;
	};

	const handleSave = () => {
		const validationError = validateFields();
		if (validationError) {
			toast.error(validationError);
			return;
		}

		const departamento = {
			id: currentItemId,
			nombre,
			provincia,
		};
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
							onChange={(e) => setNombre(e.target.value)}
							placeholder="Nombre"
						/>
						<Input
							value={provincia}
							onChange={(e) => setProvincia(e.target.value)}
							placeholder="Provincia"
						/>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar departamento'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
