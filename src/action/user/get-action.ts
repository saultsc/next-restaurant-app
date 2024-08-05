'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QueryParams {
	id?: string | number;
	currentPage?: number;
	rowPerPage?: number;
	search?: string;
}

export const getAction = async (queryParams: QueryParams) => {
	const { id, currentPage = 1, rowPerPage = 10, search } = queryParams;

	try {
		if (id) {
			const user = await prisma.user.findUnique({
				where: { id: Number(id) },
			});
			return {
				ok: true,
				data: user ? [user] : [],
				pagination: {
					totalRecords: user ? 1 : 0,
					totalPages: 1,
					currentPage: 1,
					rowPerPage: 1,
				},
			};
		}

		const where = search
			? {
					OR: [{ fullName: { contains: search } }, { email: { contains: search } }],
			  }
			: {};

		const totalRecords = await prisma.user.count({ where });
		const data = await prisma.user.findMany({
			where,
			skip: (currentPage - 1) * rowPerPage,
			take: rowPerPage,
		});

		return {
			ok: true,
			data: data.length ? data : [],
			pagination: {
				totalRecords,
				totalPages: Math.ceil(totalRecords / rowPerPage),
				currentPage,
				rowPerPage,
			},
		};
	} catch (error: unknown) {
		return {
			ok: false,
			data: [],
			pagination: {
				totalRecords: 0,
				totalPages: 0,
				currentPage: 1,
				rowPerPage: 10,
			},
		};
	} finally {
		await prisma.$disconnect();
	}
};
