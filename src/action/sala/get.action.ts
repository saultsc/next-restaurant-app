'use server';

import { QueryParams } from '@/interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSala = async (queryParams: QueryParams) => {
    const { id, currentPage = 1, rowPerPage = 10, search } = queryParams;

    try {
        if (id) {
            const sala = await prisma.sala.findUnique({
                where: { id: Number(id) },
            });
            return {
                ok: true,
                data: sala ? [sala] : [],
                pagination: {
                    totalRecords: sala ? 1 : 0,
                    totalPages: 1,
                    currentPage: 1,
                    rowPerPage: 1,
                },
            };
        }

        const where = search
            ? {
                    OR: [{ nombre: { contains: search } }, { estado: { contains: search } }],
              }
            : {};

        const totalRecords = await prisma.sala.count({ where });
        const data = await prisma.sala.findMany({
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