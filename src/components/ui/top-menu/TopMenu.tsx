'use client';

import Link from 'next/link';
import { IoSearchOutline, IoCartOutline, IoMenuOutline } from 'react-icons/io5';

import { titleFonts } from '@/config/fonts';
import { useUiStore } from '@/store';

export const TopMenu = () => {
	const openMenu = useUiStore((store) => store.openSideMenu);

	return (
		<nav className="flex px-5 justify-between items-center h-[60px] w-full shadow-xl bg-blue-600 text-white">
			{/* Logo */}
			<div>
				<Link href={'/'}>
					<span className={`${titleFonts.className} antialiased font-bold`}>
						Restaurant
					</span>
					<span> | App</span>
				</Link>
			</div>

			{/* Search, Cart, Menu */}
			<div className="flex items-center">
				<button
					className="flex items-center m-2 rounded-xl transition-all hover:bg-blue-700"
					onClick={() => openMenu()}
				>
					<IoMenuOutline size={25} className="mr-1" />
					Menu
				</button>
			</div>
		</nav>
	);
};
