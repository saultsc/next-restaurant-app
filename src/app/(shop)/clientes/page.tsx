'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pagination } from '@/components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { IoAddOutline, IoSearchOutline, IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { useDialogStore } from '@/store';
import { Cliente } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import { deleteCliente, getCliente, patchCliente, postCliente } from '@/action';
import clsx from 'clsx';
import { ClientModal } from '@/components/clientes/clientes-model/ClientesModal';

export default function ClientePage() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [clientes, setClientes] = useState<Cliente[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getCliente(queryParams);

		setClientes(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addCliente = useCallback(async (newCliente: Cliente) => {
		try {
			console.log(newCliente);
			const createdCliente = await postCliente(newCliente as any);
			console.log(createdCliente);
			setClientes((prevClientes) => [
				...(prevClientes as any),
				{ ...createdCliente, id: prevClientes.length + 1 },
			]);
		} catch (error) {
			console.log('Error adding cliente:', error);
		}
	}, []);

	const updateCliente = useCallback(async (updatedCliente: Cliente) => {
		try {
			const result = await patchCliente(updatedCliente as any);
			setClientes((prevClientes: any) =>
				prevClientes.map((cliente: any) =>
					cliente.id === updatedCliente.id ? result : cliente
				)
			);
		} catch (error) {
			console.log('Error updating cliente:', error);
		}
	}, []);

	const deleteClienteById = async (clienteId: number) => {
		try {
			await deleteCliente(clienteId);
			setClientes((prevClientes) =>
				prevClientes.filter((cliente) => cliente.id !== clienteId)
			);
		} catch (error) {
			console.log('Error deleting cliente:', error);
		}
	};

	const handleDeleteClick = (clienteId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', clienteId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Cliente"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button
						variant="default"
						className="bg-blue-600 hover:bg-blue-700"
						onClick={handleSearch}
					>
						<IoSearchOutline className="mr-2 h-4 w-4" />
						BUSCAR
					</Button>
				</div>
				<div className="flex space-x-4">
					<Button
						onClick={openDialog}
						variant="default"
						className="ml-auto bg-green-600 hover:bg-green-700 text-white"
					>
						<IoAddOutline size={20} className="mr-2" />
						AGREGAR
					</Button>
				</div>
			</div>

			<Card>
				<CardHeader className="bg-black/90 rounded-t-md text-white">
					<CardTitle>Clientes</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': clientes.length > 0,
							'items-center': clientes.length === 0,
						})}
					>
						{clientes.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Codigo</TableHead>
										<TableHead>Tipo Cliente</TableHead>
										<TableHead>Documento</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead>Correo</TableHead>
										<TableHead>Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{clientes.map((cliente: any) => (
										<TableRow key={cliente.id}>
											<TableCell>{cliente.id}</TableCell>
											<TableCell>{cliente.tipoCliente}</TableCell>
											<TableCell>{cliente.documento}</TableCell>
											<TableCell>{cliente.nombre}</TableCell>
											<TableCell>{cliente.email}</TableCell>
											<TableCell>
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															cliente.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() => handleDeleteClick(cliente.id)}
												>
													<IoTrashOutline size={16} />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<p className="text-2xl font-bold">No hay datos</p>
						)}
					</div>
					{clientes.length > 0 && (
						<div>
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			<ClientModal addClient={addCliente} updateClient={updateCliente} />
			<ReconfirmModal deleteEntity={deleteClienteById} entityName="Cliente" />
		</div>
	);
}
