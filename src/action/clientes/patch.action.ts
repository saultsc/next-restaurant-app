'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchCliente {
	id: string | number;
	tipoCliente?: string;
	documento?: number;
	rnc?: string;
	nombre?: string;
	telefonno?: string;
	dirrecion?: string;
	email?: string;
	limiteCredito?: number;
}

export const patchCliente = async ({ id, ...data }: PatchCliente) => {
	try {
		const updatedCliente = await prisma.cliente.update({
			where: { id: Number(id) },
			data,
		});
		return updatedCliente;
	} catch (error) {
		console.log('Error updating cliente:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
