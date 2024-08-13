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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type CategoriaModalProps = {
	addCategoria: (categoria: any) => void;
	updateCategoria: (categoria: any) => void;
};

const categoriaSchema = z.object({
	nombre: z.string().nonempty('El nombre es requerido'),
});

export const CategoriaModal = ({ addCategoria, updateCategoria }: CategoriaModalProps) => {
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
		setErrors({});
	};

	const handleSave = () => {
		// Verificar si hay errores antes de proceder
		if (Object.keys(errors).some((key) => errors[key])) {
			return;
		}

		const categoria = {
			id: currentItemId,
			nombre,
		};

		try {
			categoriaSchema.parse(categoria);
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
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar categoría'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
