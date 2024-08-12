'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';

import {
	IoCloseOutline,
	IoFastFoodOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoPersonOutline,
	IoSearchOutline,
	IoTicketOutline,
	IoChevronDownOutline,
	IoChevronForwardOutline,
} from 'react-icons/io5';

import { BiCategory } from 'react-icons/bi';
import { MdOutlineDepartureBoard, MdTableBar } from 'react-icons/md';
import { BsHouseAdd } from 'react-icons/bs';

import { useUiStore } from '@/store';
import { useUserStore } from '@/store/auth/user.store';
import { useRouter } from 'next/navigation';

export const Sidebar = () => {
	const router = useRouter();
	const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
	const closeMenu = useUiStore((state) => state.closeSideMenu);
	const logout = useUserStore((state) => state.logout);
	const isUserAdmin = useUserStore((state) => state.isAdmin);

	const [isMantenimientosOpen, setIsMantenimientosOpen] = useState(false);

	const onLogout = () => {
		logout();
		router.replace('/login');
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
					'fixed p-5 right-0 top-0 w-[400px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-200 overflow-y-auto flex flex-col',
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
					<IoSearchOutline size={20} className="absolute top-2 left-2 text-blue-500" />
					<input
						type="text"
						placeholder="Buscar"
						className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
					/>
				</div>

				{/* Menu */}
				<Link
					href={'/peidos'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoTicketOutline size={20} />
					<span className="ml-3 text-xl">Pedidos</span>
				</Link>
				<Link
					href={'/productos'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoFastFoodOutline size={20} />
					<span className="ml-3 text-xl">Productos</span>
				</Link>

				{/* Line Separator */}
				<div className="w-full h-px bg-gray-200 my-3" />

				{/* Mantenimientos */}
				<div className="mt-10 space-y-2 mb-10">
					<div
						className="flex items-center justify-between cursor-pointer bg-gray-200 text-gray-700 p-3 rounded-lg"
						onClick={() => setIsMantenimientosOpen(!isMantenimientosOpen)}
					>
						<h2 className="text-lg font-semibold transition-all">Mantenimientos</h2>
						<div
							className={clsx('transition-transform duration-300 ease-in-out', {
								'rotate-180': isMantenimientosOpen,
								'rotate-0': !isMantenimientosOpen,
							})}
						>
							<IoChevronDownOutline size={20} />
						</div>
					</div>
					<div
						className={clsx(
							'overflow-hidden transition-max-height duration-300 ease-in-out',
							{
								'max-h-0': !isMantenimientosOpen,
								'max-h-screen': isMantenimientosOpen,
							}
						)}
					>
						<div className="space-y-2 bg-gray-100 p-2 rounded-lg">
							<Link
								href={'/categorias'}
								className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
								onClick={() => closeMenu()}
							>
								<BiCategory size={20} />
								<span className="ml-3 text-xl">Categorias</span>
							</Link>
							<Link
								href={'/departamentos'}
								className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
								onClick={() => closeMenu()}
							>
								<MdOutlineDepartureBoard size={20} />
								<span className="ml-3 text-xl">Departamentos</span>
							</Link>
							<Link
								href={'/clientes'}
								className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
								onClick={() => closeMenu()}
							>
								<IoPersonOutline size={20} />
								<span className="ml-3 text-xl">Clientes</span>
							</Link>
							<Link
								href={'/mesas'}
								className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
								onClick={() => closeMenu()}
							>
								<MdTableBar size={20} />
								<span className="ml-3 text-xl">Mesas</span>
							</Link>
							<Link
								href={'/salas'}
								className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
								onClick={() => closeMenu()}
							>
								<BsHouseAdd size={20} />
								<span className="ml-3 text-xl">Salas</span>
							</Link>
							{isUserAdmin && (
								<Link
									href={'/users'}
									className="flex items-center p-2 hover:bg-gray-200 rounded transition-all"
									onClick={() => closeMenu()}
								>
									<IoPeopleOutline size={20} />
									<span className="ml-3 text-xl">Usuarios</span>
								</Link>
							)}
						</div>
					</div>
				</div>

				{/* Logout Button */}
				<div className="mt-auto">
					<button
						onClick={onLogout}
						className="flex flex-row w-full h-12 items-center justify-center text-white bg-red-500 hover:bg-red-700 rounded-xl"
					>
						<IoLogOutOutline size={20} />
						<span className="ml-3 text-xl">Salir</span>
					</button>
				</div>
			</nav>
		</div>
	);
};
