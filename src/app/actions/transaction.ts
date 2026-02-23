"use server"

import { prisma } from "@/lib/prisma"

export async function getTransactions(
    page: number = 1,
    searchQuery: string = "",
    startDate?: string,
    endDate?: string
) {
    const limit = 50
    const skip = (page - 1) * limit

    try {
        let whereClause: any = searchQuery ? {
            order_id: {
                contains: searchQuery,
                mode: 'insensitive' as const
            }
        } : {}

        if (startDate || endDate) {
            whereClause.created_at = {}
            if (startDate) {
                const start = new Date(startDate)
                start.setHours(0, 0, 0, 0)
                whereClause.created_at.gte = start
            }
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                whereClause.created_at.lte = end
            }
        }

        const [transactions, total] = await Promise.all([
            prisma.payments.findMany({
                where: whereClause,
                orderBy: {
                    created_at: 'desc'
                },
                take: limit,
                skip: skip
            }),
            prisma.payments.count({
                where: whereClause
            })
        ])

        // We need to pass plain objects to client
        return {
            data: JSON.parse(JSON.stringify(transactions)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching transactions:", error)
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
