'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QueryParams {
	currentPage: number;
	rowPerPage: number;
	search?: string;
}

export const getAction = async (queryParams: QueryParams) => {
	const { currentPage, rowPerPage, search } = queryParams;

	try {
		const where = search
			? {
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{ email: { contains: search, mode: 'insensitive' } },
					],
			  }
			: {};

		const totalRecords = await prisma.user.count({ where });
		const data = await prisma.user.findMany({
			where,
			skip: (currentPage - 1) * rowPerPage,
			take: rowPerPage,
		});

		if (!data.length) return { ok: false, message: 'No data found' };

		return {
			ok: true,
			data,
			pagination: {
				totalRecords,
				totalPages: Math.ceil(totalRecords / rowPerPage),
				currentPage,
				rowPerPage,
			},
		};
	} catch (error: unknown) {
		console.error('Error fetching data:', error);
		return { ok: false, message: 'Server error' };
	} finally {
		await prisma.$disconnect();
	}
};
