import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUser = async () => {
	const users = await prisma.user.findMany();

	console.log(users);
};
