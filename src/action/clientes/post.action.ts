'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostCliente {
	tipoCliente: string;
	documento: number;
	rnc?: string;
	nombre?: string;
	telefonno: string;
	dirrecion: string;
	email: string;
	limiteCredito: number;
}

export const postCliente = async ({
	dirrecion,
	documento,
	email,
	limiteCredito,
	nombre,
	rnc,
	telefonno,
	tipoCliente,
}: PostCliente) => {
	try {
		const newUser = await prisma.cliente.create({
			data: {
				dirrecion,
				documento,
				email,
				limiteCredito,
				nombre,
				rnc,
				tipoCliente,
				telefonno,
			},
		});
		return newUser;
	} catch (error) {
		console.log('Error creating user:', error);
		throw error;
	}
};
