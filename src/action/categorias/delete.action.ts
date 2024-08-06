'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteCategoria = async (id: string | number) => {
	try {
		const deletedCategoria = await prisma.categoria.delete({
			where: { id: Number(id) },
		});
		return deletedCategoria;
	} catch (error) {
		console.log('Error deleting categoria:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
