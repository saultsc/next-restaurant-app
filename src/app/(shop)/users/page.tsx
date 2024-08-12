'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pagination, UserModal } from '@/components';
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
import { Badge } from '@/components/ui/badge';
import { IoAddOutline, IoSearchOutline, IoTrashOutline, IoPencilOutline } from 'react-icons/io5';
import { useDialogStore } from '@/store';
import { User } from '@/interfaces';
import { ReconfirmModal } from '@/components/reconfirm-modal/ReconfirmModal';
import { deleteUser, getUser, patchUser, postUser } from '@/action';
import clsx from 'clsx';

export default function Component() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const openDialogDeleteMode = useDialogStore((store) => store.openDialogDeleteMode);
	const openDialogUpdateMode = useDialogStore((store) => store.openDialogUpdateMode);
	const [users, setUsers] = useState<User[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState<string>('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = useCallback(async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getUser(queryParams);

		setUsers(result.data as any);
		setTotalPages(result.pagination.totalPages);
	}, [currentPage, rowPerPage, search]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchData();
	}, [fetchData]);

	const addUser = useCallback(async (newUser: User) => {
		try {
			const createdUser = await postUser(newUser as any);
			setUsers((prevUsers) => [...prevUsers, { ...createdUser, id: prevUsers.length + 1 }]);
		} catch (error) {
			console.log('Error adding user:', error);
		}
	}, []);

	const updateUser = useCallback(async (updatedUser: User) => {
		try {
			const result = await patchUser(updatedUser as any);
			setUsers((prevUsers: any) =>
				prevUsers.map((user: any) => (user.id === updatedUser.id ? result : user))
			);
		} catch (error) {
			console.log('Error updating user:', error);
		}
	}, []);

	const deleteUserById = async (userId: number) => {
		try {
			await deleteUser(userId);
			setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
		} catch (error) {
			console.log('Error deleting user:', error);
		}
	};

	const handleDeleteClick = (userId: number) => {
		openDialogDeleteMode('Confirmar Eliminación', userId);
	};

	return (
		<div className="p-4 mt-6">
			<div className="flex items-center justify-between space-x-4 mb-4">
				<div className="flex space-x-4">
					<Input
						type="search"
						placeholder="Usuario"
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
					<CardTitle>Usuarios</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={clsx('h-[560px] overflow-y-auto flex justify-center', {
							'items-start': users.length > 0,
							'items-center': users.length === 0,
						})}
					>
						{users.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Codigo</TableHead>
										<TableHead>Nombre</TableHead>
										<TableHead>Correo</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user: User) => (
										<TableRow key={user.id}>
											<TableCell>{user.id}</TableCell>
											<TableCell>{user.fullName}</TableCell>
											<TableCell>{user.email}</TableCell>
											<TableCell>
												<Badge className="bg-blue-500">
													{user.role === 'admin'
														? 'Administrador'
														: 'Usuario'}
												</Badge>
											</TableCell>
											<TableCell>
												<Button
													variant="default"
													className="bg-yellow-500 hover:bg-yellow-600 text-white mr-2"
													onClick={() =>
														openDialogUpdateMode(
															'Actualizando',
															user.id
														)
													}
												>
													<IoPencilOutline size={16} />
												</Button>
												<Button
													variant="default"
													className="bg-red-500 hover:bg-red-600 text-white"
													onClick={() => handleDeleteClick(user.id)}
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
					{users.length > 0 && (
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

			<UserModal addUser={addUser} updateUser={updateUser} />
			<ReconfirmModal deleteEntity={deleteUserById} entityName="Usuario" />
		</div>
	);
}
