import type { Metadata } from 'next';
import './globals.css';

import { inter, titleFonts } from '@/config/fonts';

export const metadata: Metadata = {
	title: 'Restaurant | App',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${titleFonts.className} antialiased`}>{children}</body>
		</html>
	);
}
