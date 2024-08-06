'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostDepartamento {
	nombre: string;
	provincia: string;
}

export const postDepartamento = async ({ nombre, provincia }: PostDepartamento) => {
	try {
		const newDepartamento = await prisma.departamento.create({
			data: {
				nombre,
				provincia,
			},
		});
		return newDepartamento;
	} catch (error) {
		console.log('Error creating departamento:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
