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
import { getCliente } from '@/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { IoInformationCircle } from 'react-icons/io5';

type ClientModalProps = {
	addClient: (client: any) => void;
	updateClient: (client: any) => void;
};

const clientSchema = z.object({
	tipoCliente: z.string().nonempty('El tipo de cliente es requerido'),
	documento: z.number().int().nonnegative('El documento debe ser un número entero no negativo'),
	rnc: z.string().optional(),
	nombre: z.string().optional(),
	telefonno: z.string().optional(),
	dirrecion: z.string().optional(),
	email: z
		.string()
		.optional()
		.refine((val) => !val || z.string().email().safeParse(val).success, {
			message: 'El correo electrónico no es válido',
		}),
	limiteCredito: z
		.number()
		.int()
		.nonnegative('El límite de crédito debe ser un número entero no negativo'),
});

export const ClientModal = ({ addClient, updateClient }: ClientModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [tipoCliente, setTipoCliente] = useState('');
	const [documento, setDocumento] = useState<string>('');
	const [rnc, setRnc] = useState('');
	const [nombre, setNombre] = useState('');
	const [telefonno, setTelefonno] = useState('');
	const [dirrecion, setDirrecion] = useState('');
	const [email, setEmail] = useState('');
	const [limiteCredito, setLimiteCredito] = useState<string>('');
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
		const fetchClient = async () => {
			if (isEditing && currentItemId) {
				try {
					const response = await getCliente({ id: currentItemId });
					const client = response.data[0];

					if (client && isMounted.current) {
						setTipoCliente(client.tipoCliente);
						setDocumento(client.documento.toString());
						setRnc(client.rnc ?? '');
						setNombre(client.nombre ?? '');
						setTelefonno(client.telefonno ?? '');
						setDirrecion(client.dirrecion ?? '');
						setEmail(client.email ?? '');
						setLimiteCredito(client.limiteCredito.toString());
					}
				} catch (error) {
					console.log('Error al obtener el cliente:', error);
				} finally {
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}
		};

		fetchClient();
	}, [isEditing, currentItemId]);

	const resetFields = () => {
		setTipoCliente('');
		setDocumento('');
		setRnc('');
		setNombre('');
		setTelefonno('');
		setDirrecion('');
		setEmail('');
		setLimiteCredito('');
		setErrors({});
	};

	const handleSave = () => {
		// Verificar si hay errores antes de proceder
		if (Object.keys(errors).some((key) => errors[key])) {
			return;
		}

		const client = {
			id: currentItemId,
			tipoCliente,
			documento: parseInt(documento, 10), // Convertir documento a número entero
			rnc,
			nombre,
			telefonno,
			dirrecion,
			email,
			limiteCredito: parseInt(limiteCredito, 10), // Convertir limiteCredito a número entero
		};

		try {
			clientSchema.parse(client);
			if (isEditing) {
				updateClient(client);
				toast.success('Cliente actualizado con éxito');
			} else {
				addClient(client);
				toast.success('Cliente creado con éxito');
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

	const validateNumericField = (value: string) => {
		return /^\d*$/.test(value);
	};

	const handleInputChange =
		(setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value = e.target.value;
			setter(value);

			let errorMessage = '';
			if (field === 'documento' || field === 'limiteCredito') {
				if (!validateNumericField(value)) {
					errorMessage = 'Este campo es numérico';
				}
			} else if (field === 'email') {
				if (value && !z.string().email().safeParse(value).success) {
					errorMessage = 'El correo electrónico no es válido';
				}
			} else if (field === 'tipoCliente' && !value) {
				errorMessage = 'El tipo de cliente es requerido';
			}

			setErrors((prevErrors) => ({
				...prevErrors,
				[field]: errorMessage,
			}));
		};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent className="sm:max-w-[900px]">
					<DialogHeader>
						<DialogTitle>
							{isEditing ? 'Editar cliente' : 'Agregar cliente'}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? 'Edita los detalles del cliente a continuación.'
								: 'Rellena los detalles para agregar un nuevo cliente.'}
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-1 gap-4 p-4">
						<h2 className="text-lg font-semibold">Datos del cliente</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<select
									value={tipoCliente}
									onChange={handleInputChange(setTipoCliente, 'tipoCliente')}
									className="border rounded p-2 w-full"
								>
									<option value="">Tipo de cliente</option>
									<option value="Empresa">Empresa</option>
									<option value="Otra cosa">Otra cosa</option>
								</select>
								<div className="h-4">
									{errors.tipoCliente && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.tipoCliente}
										</p>
									)}
								</div>
							</div>
							<div>
								<Input
									value={documento}
									onChange={handleInputChange(setDocumento, 'documento')}
									placeholder="Documento"
								/>
								<div className="h-4">
									{errors.documento && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.documento}
										</p>
									)}
								</div>
							</div>
							<div>
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
							</div>
							<div>
								<Input
									value={telefonno}
									onChange={handleInputChange(setTelefonno, 'telefonno')}
									placeholder="Teléfono"
								/>
								<div className="h-4">
									{errors.telefonno && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.telefonno}
										</p>
									)}
								</div>
							</div>
							<div>
								<Input
									value={dirrecion}
									onChange={handleInputChange(setDirrecion, 'dirrecion')}
									placeholder="Dirección"
								/>
								<div className="h-4">
									{errors.dirrecion && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.dirrecion}
										</p>
									)}
								</div>
							</div>
							<div>
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
							</div>
						</div>
						<h2 className="text-lg font-semibold">Datos generales</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Input
									value={rnc}
									onChange={handleInputChange(setRnc, 'rnc')}
									placeholder="RNC"
								/>
								<div className="h-4">
									{errors.rnc && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.rnc}
										</p>
									)}
								</div>
							</div>
							<div>
								<Input
									value={limiteCredito}
									onChange={handleInputChange(setLimiteCredito, 'limiteCredito')}
									placeholder="Límite de crédito"
								/>
								<div className="h-4">
									{errors.limiteCredito && (
										<p className="text-red-500 flex items-center">
											<IoInformationCircle className="mr-1" />
											{errors.limiteCredito}
										</p>
									)}
								</div>
							</div>
						</div>
						<Button onClick={handleSave} className="w-full mt-4">
							{isEditing ? 'Guardar los cambios' : 'Agregar cliente'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
