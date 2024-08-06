'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchSala {
	id: string | number;
	nombre?: string;
}

export const patchSala = async ({ id, nombre }: PatchSala) => {
	try {
		const updatedSala = await prisma.sala.update({
			where: { id: Number(id) },
			data: {
				nombre,
			},
		});
		return updatedSala;
	} catch (error) {
		console.log('Error updating sala:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
