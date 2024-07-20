'use client';

import Link from 'next/link';
import clsx from 'clsx';

import {
	IoCloseOutline,
	IoFastFoodOutline,
	IoLogOutOutline,
	IoPeopleOutline,
	IoSearchOutline,
	IoTicketOutline,
} from 'react-icons/io5';

import { useUiStore } from '@/store';

export const Sidebar = () => {
	const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
	const closeMenu = useUiStore((state) => state.closeSideMenu);

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
					href={'/users'}
					className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
					onClick={() => closeMenu()}
				>
					<IoPeopleOutline size={20} />
					<span className="ml-3 text-xl">Usuarios</span>
				</Link>

				<div>
					<button className="absolute bottom-10 right-16 flex flex-row w-[260px] h-12 items-center justify-center text-white bg-red-500 hover:bg-red-700 rounded-xl">
						<IoLogOutOutline size={20} />
						<span className="ml-3 text-xl">Salir</span>
					</button>
				</div>
			</nav>
		</div>
	);
};
