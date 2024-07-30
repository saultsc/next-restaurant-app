import { Column, UserTable } from '@/components/users/UserTable';
import { Title } from '@/components/ui/title/Title';
import { IoAddCircleOutline } from 'react-icons/io5';

const userColumns: Column[] = [
	{
		name: 'name',
		label: 'Nombre',
	},
	{
		name: 'email',
		label: 'Correo',
	},
	{
		name: 'role',
		label: 'Rol',
	},
];

const userRows = [
	{
		name: 'Esteicy Disla Cruz',
		email: 'esteicy123@gmail.com',
		role: 'Administrador',
	},
	{
		name: 'Carlos Saul Padilla',
		email: 'saul022188@gmail.com',
		role: 'Usuario',
	},
];

export default function ProductPage() {
	return (
		<div className="flex flex-col justify-between">
			<header>
				<Title title="Usuarios" />
			</header>

			<section className="flex flex-row w-full justify-end">
				<button className="flex flex-row h-12 p-4 rounded-lg items-center bg-green-500 hover:bg-green-600 transition-all">
					<IoAddCircleOutline size={25} className="mr-2" />
					Agregar
				</button>
			</section>

			<footer className="pt-10">
				{/* Table */}
				<UserTable columns={userColumns} rows={userRows} />
			</footer>
		</div>
	);
}
