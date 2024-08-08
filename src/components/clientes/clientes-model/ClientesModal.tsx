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

type ClientModalProps = {
	addClient: (client: any) => void;
	updateClient: (client: any) => void;
};

export const ClientModal = ({ addClient, updateClient }: ClientModalProps) => {
	const isDialogOpen = useDialogStore((store) => store.isDialogOpen && !store.isDeleting);
	const closeDialog = useDialogStore((store) => store.closeDialog);
	const isEditing = useDialogStore((store) => store.isEditing);
	const currentItemId = useDialogStore((store) => store.currentItemId);

	const [tipoCliente, setTipoCliente] = useState('');
	const [documento, setDocumento] = useState<number | null>(null);
	const [rnc, setRnc] = useState('');
	const [nombre, setNombre] = useState('');
	const [telefonno, setTelefonno] = useState('');
	const [dirrecion, setDirrecion] = useState('');
	const [email, setEmail] = useState('');
	const [limiteCredito, setLimiteCredito] = useState<number | null>(null);
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
						setDocumento(+client.documento);
						setRnc(client.rnc ?? '');
						setNombre(client.nombre ?? '');
						setTelefonno(client.telefonno ?? '');
						setDirrecion(client.dirrecion ?? '');
						setEmail(client.email ?? '');
						setLimiteCredito(+client.limiteCredito);
					}
				} catch (error) {
					console.log('Error fetching client:', error);
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
		setDocumento(null);
		setRnc('');
		setNombre('');
		setTelefonno('');
		setDirrecion('');
		setEmail('');
		setLimiteCredito(null);
		setErrors({});
	};

	const validateFields = () => {
		const newErrors: { [key: string]: string } = {};
		if (!tipoCliente) newErrors.tipoCliente = 'El tipo de cliente es requerido';
		if (!documento) newErrors.documento = 'El documento es requerido';
		if (!limiteCredito) newErrors.limiteCredito = 'El límite de crédito es requerido';
		setErrors(newErrors);

		// Clear errors after 3 seconds
		setTimeout(() => {
			setErrors({});
		}, 3000);

		return Object.keys(newErrors).length === 0;
	};

	const handleSave = () => {
		if (!validateFields()) {
			return;
		}

		const client = {
			id: currentItemId,
			tipoCliente,
			documento,
			rnc,
			nombre,
			telefonno,
			dirrecion,
			email,
			limiteCredito,
		};
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
									onChange={(e) => setTipoCliente(e.target.value)}
									className="border rounded p-2 w-full"
								>
									<option value="">Tipo de cliente</option>
									<option value="Empresa">Empresa</option>
									<option value="Otra cosa">Otra cosa</option>
								</select>
								<div className="h-6">
									{errors.tipoCliente && (
										<p className="text-red-500">{errors.tipoCliente}</p>
									)}
								</div>
							</div>
							<div>
								<Input
									value={documento ? documento.toString() : ''}
									onChange={(e) => setDocumento(Number(e.target.value))}
									placeholder="Documento"
								/>
								<div className="h-6">
									{errors.documento && (
										<p className="text-red-500">{errors.documento}</p>
									)}
								</div>
							</div>
							<Input
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
								placeholder="Nombre"
							/>
							<Input
								value={telefonno}
								onChange={(e) => setTelefonno(e.target.value)}
								placeholder="Teléfono"
							/>
							<Input
								value={dirrecion}
								onChange={(e) => setDirrecion(e.target.value)}
								placeholder="Dirección"
							/>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Correo electrónico"
							/>
						</div>
						<h2 className="text-lg font-semibold">Datos generales</h2>
						<div className="grid grid-cols-2 gap-4">
							<Input
								value={rnc}
								onChange={(e) => setRnc(e.target.value)}
								placeholder="RNC"
							/>
							<div>
								<Input
									value={limiteCredito ? limiteCredito.toString() : ''}
									onChange={(e) => setLimiteCredito(Number(e.target.value))}
									placeholder="Límite de crédito"
								/>
								<div className="h-6">
									{errors.limiteCredito && (
										<p className="text-red-500">{errors.limiteCredito}</p>
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
