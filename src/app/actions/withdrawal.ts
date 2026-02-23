"use server"

import { prisma } from "@/lib/prisma"

export async function getWithdrawals(
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
                { user_email: { contains: searchQuery, mode: 'insensitive' } },
                { bank_name: { contains: searchQuery, mode: 'insensitive' } },
                { account_number: { contains: searchQuery, mode: 'insensitive' } },
                { account_name: { contains: searchQuery, mode: 'insensitive' } },
            ]
        }

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

        const [records, total] = await Promise.all([
            prisma.withdrawals.findMany({
                where: whereClause,
                orderBy: {
                    created_at: 'desc'
                },
                take: limit,
                skip: skip
            }),
            prisma.withdrawals.count({
                where: whereClause
            })
        ])

        return {
            data: JSON.parse(JSON.stringify(records)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        console.error("Error fetching withdrawals:", error)
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

export async function updateWithdrawalStatus(id: string, newStatus: string) {
    try {
        const validStatuses = ['pending', 'process', 'approved', 'success', 'rejected']
        if (!validStatuses.includes(newStatus.toLowerCase())) {
            return { success: false, error: "Invalid status" }
        }

        const updated = await prisma.withdrawals.update({
            where: { id },
            data: {
                status: newStatus.toLowerCase(),
                updated_at: new Date()
            }
        })

        return { success: true, data: updated }
    } catch (error) {
        console.error("Error updating withdrawal status:", error)
        return { success: false, error: "Failed to update status" }
    }
}
