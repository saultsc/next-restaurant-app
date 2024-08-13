'use client';

import { Sidebar, TopMenu } from '@/components';
import { useUserStore } from '@/store';
import { useEffect, useState, useRef } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [toggle, setToggle] = useState(false);
	const isMounted = useRef(false);

	const initialize = useUserStore((state) => state.initialize);

	useEffect(() => {
		isMounted.current = true;
		initialize();

		return () => {
			isMounted.current = false;
		};
	}, [initialize]);

	const safeSetToggle = (value: boolean) => {
		if (isMounted.current) {
			setToggle(value);
		}
	};

	return (
		<main className="min-h-screen bg-gray-100">
			<TopMenu />
			<Sidebar />

			<div className="px-0 sm:px-10">{children}</div>
		</main>
	);
}
