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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SalaModalProps = {
	addSala: (sala: any) => void;
	updateSala: (sala: any) => void;
};

export const SalaModal = ({ addSala, updateSala }: SalaModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [nombre, setNombre] = useState('');
	const [isLoading, setIsLoading] = useState(true);

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
						setNombre(sala.nombre ?? '');
					}
				} catch (error) {
					console.log('Error fetching sala:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchSala();
	}, [isEditing, currentItemId]);

	const resetFields = () => {
		setNombre('');
	};

	const validateFields = () => {
		if (!nombre) return 'El nombre es requerido';
		return null;
	};

	const handleSave = () => {
		const validationError = validateFields();
		if (validationError) {
			toast.error(validationError);
			return;
		}

		const sala = {
			id: currentItemId,
			nombre,
		};
		if (isEditing) {
			updateSala(sala);
			toast.success('Sala actualizada con éxito');
		} else {
			addSala(sala);
			toast.success('Sala creada con éxito');
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
							onChange={(e) => setNombre(e.target.value)}
							placeholder="Nombre"
						/>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar sala'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
