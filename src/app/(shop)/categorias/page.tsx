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
import { Categoria } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import { deleteCategoria, getCategorias, patchCategoria, postCategoria } from '@/action';
import clsx from 'clsx';
import { CategoriaModal } from '@/components/categorias/categorias-modal/CategoriasModal';

export default function CategoriaPage() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getCategorias(queryParams);

		setCategorias(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addCategoria = useCallback(async (newCategoria: Categoria) => {
		try {
			const createdCategoria = await postCategoria(newCategoria as any);
			setCategorias((prevCategorias) => [...prevCategorias, createdCategoria]);
		} catch (error) {
			console.log('Error adding categoria:', error);
		}
	}, []);

	const updateCategoria = useCallback(async (updatedCategoria: Categoria) => {
		try {
			const result = await patchCategoria(updatedCategoria as any);
			setCategorias((prevCategorias) =>
				prevCategorias.map((categoria) =>
					categoria.id === updatedCategoria.id ? result : categoria
				)
			);
		} catch (error) {
			console.log('Error updating categoria:', error);
		}
	}, []);

	const deleteCategoriaById = async (categoriaId: number) => {
		try {
			await deleteCategoria(categoriaId);
			setCategorias((prevCategorias) =>
				prevCategorias.filter((categoria) => categoria.id !== categoriaId)
			);
		} catch (error) {
			console.log('Error deleting categoria:', error);
		}
	};

	const handleDeleteClick = (categoriaId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', categoriaId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Categoría"
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
					<CardTitle>Categorías</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': categorias.length > 0,
							'items-center': categorias.length === 0,
						})}
					>
						{categorias.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Codigo</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead className="text-center">Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{categorias.map((categoria) => (
										<TableRow key={categoria.id}>
											<TableCell>{categoria.id}</TableCell>
											<TableCell>{categoria.nombre}</TableCell>
											<TableCell className="text-center">
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															categoria.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() => handleDeleteClick(categoria.id)}
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
					{categorias.length > 0 && (
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

			<CategoriaModal addCategoria={addCategoria} updateCategoria={updateCategoria} />
			<ReconfirmModal deleteEntity={deleteCategoriaById} entityName="Categoría" />
		</div>
	);
}
