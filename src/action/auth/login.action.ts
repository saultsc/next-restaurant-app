'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { signToken } from '../../lib/jwt';

interface Credentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

interface Response {
	ok: boolean;
	message: string;
	token?: string;
	nextRoute: string;
}

const prisma = new PrismaClient();

export const login = async (credentials: Credentials): Promise<Response> => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: credentials.email,
			},
		});

		if (!user) return { ok: false, message: 'invalid Credentials', nextRoute: '/auth/login' };
		const token = await signToken({ userId: user.id, role: user.role });

		cookies().set('token', token, { maxAge: 3600 });

		return { ok: true, message: 'Inicio exitoso', nextRoute: '/' };
	} catch (error) {
		return { ok: false, message: 'Error del servidor', nextRoute: '/auth/login' };
	}
};
