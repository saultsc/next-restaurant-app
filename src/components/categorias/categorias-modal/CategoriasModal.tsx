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
import { getCategorias } from '@/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type CategoriaModalProps = {
	addCategoria: (categoria: any) => void;
	updateCategoria: (categoria: any) => void;
};

export const CategoriaModal = ({ addCategoria, updateCategoria }: CategoriaModalProps) => {
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
		const fetchCategoria = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getCategorias({ id: currentItemId });
					const categoria = response.data[0];

					if (categoria && isMounted.current) {
						setNombre(categoria.nombre ?? '');
					}
				} catch (error) {
					console.log('Error fetching categoria:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchCategoria();
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

		const categoria = {
			id: currentItemId,
			nombre,
		};
		if (isEditing) {
			updateCategoria(categoria);
			toast.success('Categoría actualizada con éxito');
		} else {
			addCategoria(categoria);
			toast.success('Categoría creada con éxito');
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
							{isEditing ? 'Editar categoría' : 'Agregar categoría'}
						</DialogTitle>
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles de la categoría a continuación.'
									: 'Rellena los detalles para agregar una nueva categoría.'}
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
							{isEditing ? 'Guardar los cambios' : 'Agregar categoría'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
