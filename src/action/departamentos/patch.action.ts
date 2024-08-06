'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchDepartamento {
	id: string | number;
	nombre?: string;
	provincia?: string;
}

export const patchDepartamento = async ({ id, nombre, provincia }: PatchDepartamento) => {
	try {
		const updatedDepartamento = await prisma.departamento.update({
			where: { id: Number(id) },
			data: {
				nombre,
				provincia,
			},
		});
		return updatedDepartamento;
	} catch (error) {
		console.log('Error updating departamento:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
