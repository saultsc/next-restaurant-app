'use client';

import { Sidebar, TopMenu } from '@/components';
import { useUserStore } from '@/store';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const initialize = useUserStore((state) => state.initialize);

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<main className="min-h-screen bg-gray-100">
			<TopMenu />
			<Sidebar />

			<div className="px-0 sm:px-10">{children}</div>
		</main>
	);
}
