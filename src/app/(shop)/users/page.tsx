'use client';

import { useState, useEffect } from 'react';
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
import { IoAddOutline, IoSearchOutline } from 'react-icons/io5';
import { useDialogStore } from '@/store';
import { getAction } from '@/action/user/get-action';
import { User } from '@/interfaces';

export default function Component() {
	const openDialog = useDialogStore((store) => store.openDialog);
	const [users, setUsers] = useState([] as any);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowPerPage] = useState(10);
	const [search, setSearch] = useState('');
	const [totalPages, setTotalPages] = useState(1);

	const fetchData = async () => {
		const queryParams = { currentPage, rowPerPage, search };
		const result = await getAction(queryParams);
		if (result.ok && result.data) {
			setUsers(result.data);
			setTotalPages(result.pagination.totalPages);
		} else {
			// Manejar error
			console.log(result.message);
		}
	};

	// Efecto para obtener datos cuando cambian la página actual o el término de búsqueda
	useEffect(() => {
		fetchData();
	}, [currentPage, search]);

	// Manejar la búsqueda y reiniciar la página actual a 1
	const handleSearch = () => {
		setCurrentPage(1);
		fetchData();
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
					<div className="h-[560px] overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Codigo</TableHead>
									<TableHead>Nombre</TableHead>
									<TableHead>Correo</TableHead>
									<TableHead>Role</TableHead>
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
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={setCurrentPage}
						/>
					</div>
				</CardContent>
			</Card>

			<UserModal />
		</div>
	);
}
