export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main>
			<div className="bg-gray-100 flex justify-center items-center h-screen">
				<div className="w-1/2 h-screen hidden lg:block bg-blue-500"></div>
				<div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">{children}</div>
			</div>
		</main>
	);
}
