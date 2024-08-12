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
import { Mesa } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import { deleteMesa, getMesas, patchMesa, postMesa } from '@/action';
import clsx from 'clsx';
import { MesaModal } from '@/components/mesa/mesa-modal/MesaModal';

export default function MesaPage() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [mesas, setMesas] = useState<Mesa[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getMesas(queryParams);

		setMesas(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addMesa = useCallback(async (newMesa: Mesa) => {
		try {
			const createdMesa = await postMesa(newMesa as any);
			setMesas((prevMesas) => [
				...(prevMesas as any),
				{ ...createdMesa, id: prevMesas.length + 1 },
			]);
		} catch (error) {
			console.log('Error adding mesa:', error);
		}
	}, []);

	const updateMesa = useCallback(async (updatedMesa: Mesa) => {
		try {
			const result = await patchMesa(updatedMesa as any);
			setMesas((prevMesas: any) =>
				prevMesas.map((mesa: any) => (mesa.id === updatedMesa.id ? result : mesa))
			);
		} catch (error) {
			console.log('Error updating mesa:', error);
		}
	}, []);

	const deleteMesaById = async (mesaId: number) => {
		try {
			await deleteMesa(mesaId);
			setMesas((prevMesas) => prevMesas.filter((mesa) => mesa.id !== mesaId));
		} catch (error) {
			console.log('Error deleting mesa:', error);
		}
	};

	const handleDeleteClick = (mesaId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', mesaId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Mesa"
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
					<CardTitle>Mesas</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': mesas.length > 0,
							'items-center': mesas.length === 0,
						})}
					>
						{mesas.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className="text-center">Capacidad</TableHead>
										<TableHead className="text-center">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{mesas.map((mesa: Mesa) => (
										<TableRow key={mesa.id}>
											<TableCell>{mesa.id}</TableCell>
											<TableCell>{mesa.nombre}</TableCell>
											<TableCell>{mesa.estado}</TableCell>
											<TableCell className="text-center">
												{mesa.capacidad}
											</TableCell>
											<TableCell className="text-center">
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															mesa.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() => handleDeleteClick(mesa.id)}
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
					{mesas.length > 0 && (
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

			<MesaModal addMesa={addMesa} updateMesa={updateMesa} />
			<ReconfirmModal deleteEntity={deleteMesaById} entityName="Mesa" />
		</div>
	);
}
