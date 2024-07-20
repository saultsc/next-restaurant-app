export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="">
			<div className="bg-white flex justify-center items-center h-screen">
				<div className="w-1/2 h-screen hidden lg:block bg-blue-500"></div>
				<div className="lg:p-36 md:p-52 p-8 lg:w-1/2 flex justify-center items-center">
					{children}
				</div>
			</div>
		</main>
	);
}
