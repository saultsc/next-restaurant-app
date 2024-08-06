'use server';

import { QueryParams } from '@/interfaces';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMesas = async (queryParams: QueryParams) => {
    const { id, currentPage = 1, rowPerPage = 10, search } = queryParams;

    try {
        if (id) {
            const mesa = await prisma.mesa.findUnique({
                where: { id: Number(id) },
            });
            return {
                ok: true,
                data: mesa ? [mesa] : [],
                pagination: {
                    totalRecords: mesa ? 1 : 0,
                    totalPages: 1,
                    currentPage: 1,
                    rowPerPage: 1,
                },
            };
        }

        const where = search
            ? {
                    OR: [{ nombre: { contains: search } }, { capacidad: Number(search) }],
              }
            : {};

        const totalRecords = await prisma.mesa.count({ where });
        const data = await prisma.mesa.findMany({
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