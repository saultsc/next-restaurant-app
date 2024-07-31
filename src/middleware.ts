import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;

	if (!token) {
		// Redirigir siempre a /auth/login si no hay token
		if (pathname !== '/auth/login') {
			return NextResponse.redirect(new URL('/auth/login', request.url));
		}
		return NextResponse.next();
	}

	const isValid = await verifyToken(token);
	if (!isValid) {
		// Redirigir siempre a /auth/login si el token no es válido
		if (pathname !== '/auth/login') {
			return NextResponse.redirect(new URL('/auth/login', request.url));
		}
		return NextResponse.next();
	}

	// Redirigir a la página principal si el token es válido y la ruta es /auth/login
	if (pathname === '/auth/login') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
