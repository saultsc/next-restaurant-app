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

export const postAssignMesa = async (salaId: number, mesasId: number[]) => {
	try {
		// Obtener las mesas actualmente asignadas a la sala
		const currentAssignments = await prisma.salamesa.findMany({
			where: { salaId },
			select: { mesaId: true },
		});
		const currentMesaIds = currentAssignments.map((assignment) => assignment.mesaId);

		// Determinar mesas a asignar y desasignar
		const mesasToAssign = mesasId.filter((mesaId) => !currentMesaIds.includes(mesaId));
		const mesasToUnassign = currentMesaIds.filter((mesaId) => !mesasId.includes(mesaId));

		// Asignar mesas
		if (mesasToAssign.length > 0) {
			await prisma.salamesa.createMany({
				data: mesasToAssign.map((mesaId) => ({
					salaId,
					mesaId,
				})),
			});
		}

		// Desasignar mesas
		if (mesasToUnassign.length > 0) {
			await prisma.salamesa.deleteMany({
				where: {
					salaId,
					mesaId: {
						in: mesasToUnassign,
					},
				},
			});
		}

		return { ok: true, message: 'Mesas asignadas y desasignadas correctamente' };
	} catch (error) {
		console.log('Error managing mesa assignments:', error);
		return { ok: false, message: 'Error al asignar o desasignar mesas' };
	} finally {
		await prisma.$disconnect();
	}
};
