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
        const decodedToken: any = await verifyToken(token);

        // Verificar si la ruta es /users y si el usuario no es administrador
        if (pathname.startsWith('/users') && decodedToken.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirigir a la página principal si el token es válido y la ruta es /auth/login
        if (pathname === '/auth/login') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } catch (error) {
        // Redirigir a /auth/login si el token no es válido
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};