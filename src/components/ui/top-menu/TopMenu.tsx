'use client';

import Link from 'next/link';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';

import { titleFonts } from '@/config/fonts';
import { useUiStore } from '@/store';

export const TopMenu = () => {
	const openMenu = useUiStore((store) => store.openSideMenu);

	return (
		<nav className="flex px-5 justify-between items-center h-[60px] w-full border shadow-lg">
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
					className="m-2 rounded-md transition-all hover:bg-gray-100"
					onClick={() => openMenu()}
				>
					Menu
				</button>
			</div>
		</nav>
	);
};
