'use server';

import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { signToken } from '@/lib/jwt';

export interface Credentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export interface Response {
	ok: boolean;
	message: string;
	token: string;
}

const prisma = new PrismaClient();

export const login = async (credentials: Credentials): Promise<Response> => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: credentials.email,
				password: credentials.password,
			},
		});

		if (!user) return { ok: false, message: 'Credenciales Incorrectas', token: '' };
		const token = await signToken({ userId: user.id, role: user.role });

		cookies().set('token', token, { 
			expires: new Date(Date.now() + 2 * 60 * 60 * 1000), 
			httpOnly: true, 
			maxAge: 7200,
	});

		return { ok: true, message: 'Inicio exitoso', token };
	} catch (error) {
		return { ok: false, message: 'Error del servidor', token: '' };
	}
};
