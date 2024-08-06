'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteMesa = async (id: string | number) => {
	try {
		const deletedMesa = await prisma.mesa.delete({
			where: { id: Number(id) },
		});
		return deletedMesa;
	} catch (error) {
		console.log('Error deleting mesa:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
