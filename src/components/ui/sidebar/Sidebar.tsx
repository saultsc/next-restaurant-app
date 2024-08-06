'use client';

import Link from 'next/link';
import clsx from 'clsx';

import {
	IoCloseOutline,
	IoFastFoodOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoPersonOutline,
	IoSearchOutline,
	IoTicketOutline,
} from 'react-icons/io5';

import { BiCategory } from 'react-icons/bi';
import { MdOutlineDepartureBoard } from 'react-icons/md';

import { useUiStore } from '@/store';
import { useUserStore } from '@/store/auth/user.store';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
	const router = useRouter();
	const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
	const closeMenu = useUiStore((state) => state.closeSideMenu);
	const logout = useUserStore((state) => state.logout);
	const isUserAdmin = useUserStore((state) => state.isAdmin);

	const onLogout = () => {
		setTimeout(() => {
			logout();
			router.replace('/login');
		}, 100);
	};

	return (
		<div>
			{/* Background */}
			{isSideMenuOpen && (
				<div className="fixed top-0 w-screen h-screen z-10 bg-black opacity-30" />
			)}

			{/* Blur */}
			{isSideMenuOpen && (
				<div
					onClick={() => closeMenu()}
					className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
				/>
			)}

			{/* Sidemenu */}
			<nav
				className={clsx(
					'fixed p-5 right-0 top-0 w-[400px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-200',
					{
						'translate-x-full': !isSideMenuOpen,
					}
				)}
			>
				<IoCloseOutline
					size={30}
					className="absolute top-5 right-5 cursor-pointer"
					onClick={() => closeMenu()}
				/>

				{/* Input */}
				<div className="relative mt-14">
					<IoSearchOutline size={20} className="absolute top-2 left-2" />
					<input
						type="text"
						placeholder="Buscar"
						className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
					/>
				</div>

				{/* Menu */}

				<Link
					href={'/'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoTicketOutline size={20} />
					<span className="ml-3 text-xl">Ordenes</span>
				</Link>

				{/* Line Separator */}
				<div className="w-full h-px bg-gray-200 my-10" />

				<Link
					href={'/'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoFastFoodOutline size={20} />
					<span className="ml-3 text-xl">Productos</span>
				</Link>
				<Link
					href={'/categorias'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<BiCategory size={20} />
					<span className="ml-3 text-xl">Categorias</span>
				</Link>
				<Link
					href={'/departamentos'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<MdOutlineDepartureBoard size={20} />
					<span className="ml-3 text-xl">Departamentos</span>
				</Link>
				<Link
					href={'/clientes'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoPersonOutline size={20} />
					<span className="ml-3 text-xl">Clientes</span>
				</Link>
				<Link
					href={'/mesas'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoPersonOutline size={20} />
					<span className="ml-3 text-xl">Mesas</span>
				</Link>
				<Link
					href={'/salas'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoPersonOutline size={20} />
					<span className="ml-3 text-xl">Salas</span>
				</Link>

				{isUserAdmin && (
					<Link
						href={'/users'}
						className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
						onClick={() => closeMenu()}
					>
						<IoPeopleOutline size={20} />
						<span className="ml-3 text-xl">Usuarios</span>
					</Link>
				)}

				<div>
					<button
						onClick={onLogout}
						className="absolute bottom-10 right-16 flex flex-row w-[260px] h-12 items-center justify-center text-white bg-red-500 hover:bg-red-700 rounded-xl"
					>
						<IoLogOutOutline size={20} />
						<span className="ml-3 text-xl">Salir</span>
					</button>
				</div>
			</nav>
		</div>
	);
};
