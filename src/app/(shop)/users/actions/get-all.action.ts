import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUser = async () => {
	try {
		const users = await prisma.user.findMany();
		console.log(users);

		return users;
	} catch (error) {
		console.error(error);
	}
};
