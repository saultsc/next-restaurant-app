'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostSala {
	nombre: string;
}

export const postSala = async ({ nombre }: PostSala) => {
	try {
		const newSala = await prisma.sala.create({
			data: {
				nombre,
			},
		});
		return newSala;
	} catch (error) {
		console.log('Error creating sala:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
