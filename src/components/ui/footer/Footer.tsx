import { titleFonts } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
	return (
		<div className="flex w-full justify-center text-xs mb-6 absolute bottom-0">
			<Link href={'/'}>
				<span className={`${titleFonts.className} antialiased font-bold`}>
					Restaurant {''}
				</span>
				<span>| App</span>
				<span>© {new Date().getFullYear()}</span>
			</Link>

			<Link href={'/'} className="mx-2">
				Privacidad & Legal
			</Link>
			<Link href={'/'} className="mx-2">
				Ubicaciones
			</Link>
		</div>
	);
};
