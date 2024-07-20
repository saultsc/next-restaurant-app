import { Footer, Sidebar, TopMenu } from '@/components';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen bg-gray-100">
			<TopMenu />
			<Sidebar />

			<div className="px-0 sm:px-10">{children}</div>

			<Footer />
		</main>
	);
}
