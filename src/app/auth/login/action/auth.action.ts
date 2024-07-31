'use server';

import { InvalidCredentialsError } from '@/error/auth.error';
import { signToken } from '@/lib/jwt';
import { PrismaClient } from '@prisma/client';

interface Credentials {
	email: string;
	password: string;
	rememberMe?: boolean;
}

interface Response {
	ok: boolean;
	message: string;
	token?: string;
}

const prisma = new PrismaClient();

export const login = async ({ email, password }: Credentials): Promise<Response> => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user)
			throw new InvalidCredentialsError('Credenciales invalidas - Usuario no encontrado');
		if (password !== user.password)
			throw new InvalidCredentialsError('Credenciales invalidas - Contraseña incorrecta');

		const token = await signToken({ userId: user.id }, '1h');

		return {
			ok: true,
			message: 'Inicio de sesión exitoso',
			token, // Incluye el token en la respuesta
		};
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return { ok: false, message: error.message };
		}

		console.log(error);
		return { ok: false, message: 'Error del servidor' };
	}
};

const logout = () => {};
