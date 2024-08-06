'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteDepartamento = async (id: string | number) => {
	try {
		const deletedDepartamento = await prisma.departamento.delete({
			where: { id: Number(id) },
		});
		return deletedDepartamento;
	} catch (error) {
		console.log('Error deleting departamento:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
