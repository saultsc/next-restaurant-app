'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteCliente = async (id: string | number) => {
	try {
		const deletedCliente = await prisma.cliente.delete({
			where: { id: Number(id) },
		});
		return deletedCliente;
	} catch (error) {
		console.log('Error deleting cliente:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
