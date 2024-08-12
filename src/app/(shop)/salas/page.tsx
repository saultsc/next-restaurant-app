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
import { Sala } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import { deleteSala, getSala, patchSala, postSala } from '@/action';
import clsx from 'clsx';
import { SalaModal } from '@/components/sala/sala-modal/SalaModal';
import { MesasAssign } from '@/components/mesas-assign/MesasAssign';

export default function SalaPage() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [salas, setSalas] = useState<Sala[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getSala(queryParams);

		setSalas(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addSala = useCallback(async (newSala: Sala) => {
		try {
			const createdSala = await postSala(newSala as any);
			setSalas((prevSalas) => [
				...(prevSalas as any),
				{ ...createdSala, id: prevSalas.length + 1 },
			]);
		} catch (error) {
			console.log('Error adding sala:', error);
		}
	}, []);

	const updateSala = useCallback(async (updatedSala: Sala) => {
		try {
			const result = await patchSala(updatedSala as any);
			setSalas((prevSalas: any) =>
				prevSalas.map((sala: any) => (sala.id === updatedSala.id ? result : sala))
			);
		} catch (error) {
			console.log('Error updating sala:', error);
		}
	}, []);

	const deleteSalaById = async (salaId: number) => {
		try {
			await deleteSala(salaId);
			setSalas((prevSalas) => prevSalas.filter((sala) => sala.id !== salaId));
		} catch (error) {
			console.log('Error deleting sala:', error);
		}
	};

	const handleDeleteClick = (salaId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', salaId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Sala"
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
					<CardTitle>Salas</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': salas.length > 0,
							'items-center': salas.length === 0,
						})}
					>
						{salas.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Codigo</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead className="text-center">Mesas</TableHead>
										<TableHead className="text-center">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{salas.map((sala: Sala) => (
										<TableRow key={sala.id}>
											<TableCell>{sala.id}</TableCell>
											<TableCell>{sala.nombre}</TableCell>
											<TableCell className="text-center">
												<MesasAssign
													salaId={sala.id}
													salaNombre={sala.nombre}
												/>
											</TableCell>
											<TableCell className="text-center">
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															sala.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() => handleDeleteClick(sala.id)}
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
					{salas.length > 0 && (
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

			<SalaModal addSala={addSala} updateSala={updateSala} />
			<ReconfirmModal deleteEntity={deleteSalaById} entityName="Sala" />
		</div>
	);
}
