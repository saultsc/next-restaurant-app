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
	const [documento, setDocumento] = useState<Number | null>();
	const [rnc, setRnc] = useState('');
	const [nombre, setNombre] = useState('');
	const [telefonno, settelefonno] = useState('');
	const [dirrecion, setDirrecion] = useState('');
	const [email, setEmail] = useState('');
	const [limiteCredito, setLimiteCredito] = useState<Number | null>();
	const [isLoading, setIsLoading] = useState(true);

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
						settelefonno(client.telefonno ?? '');
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
		settelefonno('');
		setDirrecion('');
		setEmail('');
		setLimiteCredito(null);
	};

	const validateFields = () => {
		if (!tipoCliente) return 'El tipo de cliente es requerido';
		if (!documento) return 'El documento es requerido';
		if (!rnc) return 'El RNC es requerido';
		if (!nombre) return 'El nombre es requerido';
		if (!telefonno) return 'El teléfono es requerido';
		if (!dirrecion) return 'La dirección es requerida';
		if (!email) return 'El correo electrónico es requerido';
		if (!limiteCredito) return 'El límite de crédito es requerido';
		return null;
	};

	const handleSave = () => {
		const validationError = validateFields();
		if (validationError) {
			toast.error(validationError);
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
						<div className="mt-2">
							<DialogDescription>
								{isEditing
									? 'Edita los detalles del cliente a continuación.'
									: 'Rellena los detalles para agregar un nuevo cliente.'}
							</DialogDescription>
						</div>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<select
							value={tipoCliente}
							onChange={(e) => setTipoCliente(e.target.value)}
							className="border rounded p-2"
						>
							<option value="">Selecciona el tipo de cliente</option>
							<option value="Empresa">Empresa</option>
							<option value="Otra cosa">Otra cosa</option>
						</select>
						<Input
							value={documento ? documento.toString() : ''}
							onChange={(e) => setDocumento(Number(e.target.value))}
							placeholder="Documento"
						/>
						<Input
							value={rnc}
							onChange={(e) => setRnc(e.target.value)}
							placeholder="RNC"
						/>
						<Input
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							placeholder="Nombre"
						/>
						<Input
							value={telefonno}
							onChange={(e) => settelefonno(e.target.value)}
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
						<Input
							value={limiteCredito?.toString()}
							onChange={(e) => setLimiteCredito(Number(e.target.value))}
							placeholder="Límite de crédito"
						/>
						<Button onClick={handleSave} className="w-full">
							{isEditing ? 'Guardar los cambios' : 'Agregar cliente'}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<ToastContainer />
		</>
	);
};
