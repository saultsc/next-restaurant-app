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
import { Departamento } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import {
	deleteDepartamento,
	getDepartamentos,
	patchDepartamento,
	postDepartamento,
} from '@/action';
import clsx from 'clsx';
import { DepartamentoModal } from '@/components/departamentos/departamentos-modal/DepartamentosModal';

export default function DepartamentoPage() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getDepartamentos(queryParams);

		setDepartamentos(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addDepartamento = useCallback(async (newDepartamento: Departamento) => {
		try {
			const createdDepartamento = await postDepartamento(newDepartamento as any);
			setDepartamentos((prevDepartamentos) => [
				...(prevDepartamentos as any),
				{ ...createdDepartamento, id: prevDepartamentos.length + 1 },
			]);
		} catch (error) {
			console.log('Error adding departamento:', error);
		}
	}, []);

	const updateDepartamento = useCallback(async (updatedDepartamento: Departamento) => {
		try {
			const result = await patchDepartamento(updatedDepartamento as any);
			setDepartamentos((prevDepartamentos: any) =>
				prevDepartamentos.map((departamento: any) =>
					departamento.id === updatedDepartamento.id ? result : departamento
				)
			);
		} catch (error) {
			console.log('Error updating departamento:', error);
		}
	}, []);

	const deleteDepartamentoById = async (departamentoId: number) => {
		try {
			await deleteDepartamento(departamentoId);
			setDepartamentos((prevDepartamentos) =>
				prevDepartamentos.filter((departamento) => departamento.id !== departamentoId)
			);
		} catch (error) {
			console.log('Error deleting departamento:', error);
		}
	};

	const handleDeleteClick = (departamentoId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', departamentoId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Departamento"
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
					<CardTitle>Departamentos</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': departamentos.length > 0,
							'items-center': departamentos.length === 0,
						})}
					>
						{departamentos.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Codigo</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead>Provincia</TableHead>
										<TableHead className="text-center">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{departamentos.map((departamento: any) => (
										<TableRow key={departamento.id}>
											<TableCell>{departamento.id}</TableCell>
											<TableCell>{departamento.nombre}</TableCell>
											<TableCell>{departamento.provincia}</TableCell>
											<TableCell className="text-center">
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															departamento.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() =>
														handleDeleteClick(departamento.id)
													}
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
					{departamentos.length > 0 && (
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

			<DepartamentoModal
				addDepartamento={addDepartamento}
				updateDepartamento={updateDepartamento}
			/>
			<ReconfirmModal deleteEntity={deleteDepartamentoById} entityName="Departamento" />
		</div>
	);
}
