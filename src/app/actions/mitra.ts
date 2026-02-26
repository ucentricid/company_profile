"use server"

import { prisma } from "@/lib/prisma"

export async function getMitraAktif(
    page: number = 1,
    searchQuery: string = "",
    startDate?: string,
    endDate?: string
) {
    const limit = 50
    const skip = (page - 1) * limit

    try {
        let whereClause: any = {}

        if (searchQuery) {
            whereClause.OR = [
                { token_number: { contains: searchQuery, mode: 'insensitive' } },
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { email: { contains: searchQuery, mode: 'insensitive' } },
            ]
        }

        if (startDate || endDate) {
            whereClause.register_date = {}
            if (startDate) {
                const start = new Date(startDate)
                start.setHours(0, 0, 0, 0)
                whereClause.register_date.gte = start
            }
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                whereClause.register_date.lte = end
            }
        }

        const [tokens, total] = await Promise.all([
            prisma.ukasir_token.findMany({
                where: whereClause,
                orderBy: {
                    register_date: 'desc'
                },
                take: limit,
                skip: skip
            }),
            prisma.ukasir_token.count({
                where: whereClause
            })
        ])

        return {
            data: JSON.parse(JSON.stringify(tokens)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching Mitra Aktif tokens:", error)
        return {
            data: [],
            meta: {
                total: 0,
                page,
                limit,
                totalPages: 0
            }
        }
    }
}
