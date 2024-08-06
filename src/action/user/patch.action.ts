'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PatchUser {
	id: string | number;
	fullName?: string;
	email?: string;
	password?: string;
	role?: 'admin' | 'user';
}

export const patchUser = async ({ id, fullName, email, password, role }: PatchUser) => {
	try {
		const updatedUser = await prisma.user.update({
			where: { id: Number(id) },
			data: {
				fullName,
				email,
				password,
				role,
			},
		});
		return updatedUser;
	} catch (error) {
		console.log('Error updating user:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
