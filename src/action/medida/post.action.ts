'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface PostMedida {
	nombre: string;
}

export const postMedida = async ({ nombre }: PostMedida) => {
	try {
		const newCategoria = await prisma.medida.create({
			data: {
				nombre,
			},
		});
		return newCategoria;
	} catch (error) {
		console.log('Error creating medida:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
