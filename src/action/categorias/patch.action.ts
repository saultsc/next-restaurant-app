'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchCategoria {
	id: string | number;
	nombre?: string;
}

export const patchCategoria = async ({ id, nombre }: PatchCategoria) => {
	try {
		const updatedCategoria = await prisma.categoria.update({
			where: { id: Number(id) },
			data: {
				nombre,
			},
		});
		return updatedCategoria;
	} catch (error) {
		console.log('Error updating categoria:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
