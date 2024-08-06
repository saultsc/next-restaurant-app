'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostMesa {
	nombre: string;
	capacidad: number;
	estado: 'disponible' | 'ocupada' | 'reservada';
}

export const postMesa = async ({ nombre, capacidad, estado }: PostMesa) => {
	try {
		const newMesa = await prisma.mesa.create({
			data: {
				nombre,
				capacidad,
				estado,
			},
		});
		return newMesa;
	} catch (error) {
		console.log('Error creating mesa:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
