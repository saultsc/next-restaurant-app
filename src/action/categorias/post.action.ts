'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
interface PostCategoria {
	nombre: string;
}

export const postCategoria = async ({ nombre }: PostCategoria) => {
	try {
		const newCategoria = await prisma.categoria.create({
			data: {
				nombre,
			},
		});
		return newCategoria;
	} catch (error) {
		console.log('Error creating categoria:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
