'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchMedida {
	id: string | number;
	nombre?: string;
}

export const patchMedida = async ({ id, nombre }: PatchMedida) => {
	try {
		const updatedMedida = await prisma.medida.update({
			where: { id: Number(id) },
			data: {
				nombre,
			},
		});
		return updatedMedida;
	} catch (error) {
		console.log('Error updating medida:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
