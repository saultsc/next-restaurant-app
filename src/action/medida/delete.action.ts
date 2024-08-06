'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteMedida = async (id: string | number) => {
	try {
		const deletedMedida = await prisma.medida.delete({
			where: { id: Number(id) },
		});
		return deletedMedida;
	} catch (error) {
		console.log('Error deleting media:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
