'use server';

import { InvalidCredentialsError } from '@/error/auth.error';
import { signToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { serialize } from 'cookie';

interface Credentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

interface Response {
	ok: boolean;
	message: string;
}

const prisma = new PrismaClient();

export const login = async ({
	email,
	password,
	rememberMe = false,
}: Credentials): Promise<Response> => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) throw new InvalidCredentialsError('Credenciales invalidas');
		if (!bcryptjs.compareSync(password, user.password))
			throw new InvalidCredentialsError('Credenciales invalidas');
		if (rememberMe) localStorage.setItem('email', email);

		const token = await signToken({ userId: user.id }, '1h');

		const cookie = serialize('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60,
			path: '/',
		});

		return { ok: true, message: '' };
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return { ok: false, message: error.message };
		}

		return { ok: false, message: 'Error del servidor' };
	}
};

const logout = () => {};
