import { NextResponse, type NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;

	if (!token) {
		if (pathname !== '/auth/login') {
			return NextResponse.redirect(new URL('/auth/login', request.url));
		}
		return NextResponse.next();
	}

	try {
		if (pathname === '/auth/login') {
			return NextResponse.redirect(new URL('/', request.url));
		}
	} catch (error) {
		return NextResponse.redirect(new URL('/auth/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
