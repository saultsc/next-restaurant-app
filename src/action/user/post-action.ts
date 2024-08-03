'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PostUser {
	fullName: string;
	email: string;
	password: string;
	role: 'admin' | 'user';
}

export const postAction = async ({ fullName, email, password, role }: PostUser) => {
	try {
		const newUser = await prisma.user.create({
			data: {
				fullName,
				email,
				password,
				role,
			},
		});
		return newUser;
	} catch (error) {
		console.error('Error creating user:', error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
};
