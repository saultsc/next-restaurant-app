'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteUser = async (id: string | number) => {
	try {
		const deletedUser = await prisma.user.delete({
			where: { id: Number(id) },
		});
		return deletedUser;
	} catch (error) {
		console.log('Error deleting user:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
