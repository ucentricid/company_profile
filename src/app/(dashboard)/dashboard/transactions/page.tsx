"use client"

import { useEffect, useState } from "react"
import { getTransactions } from "@/app/actions/transaction"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { payments } from "@prisma/client"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react"

export default function TransactionsPage() {
    const [data, setData] = useState<payments[]>([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ totalPages: 1, total: 0, limit: 50 })

    const fetchTransactions = async (
        silently = false,
        currentPage = page,
        currentSearch = searchQuery,
        currentStart = startDate,
        currentEnd = endDate
    ) => {
        if (!silently) setLoading(true)
        else setIsRefreshing(true)

        try {
            const res = await getTransactions(currentPage, currentSearch, currentStart, currentEnd)
            setData(res.data)
            setMeta(res.meta)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    // Handle search input and date changes with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1) // Reset to first page on new search
            fetchTransactions(false, 1, searchQuery, startDate, endDate)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, startDate, endDate])

    // Fetch when page changes
    useEffect(() => {
        // Only fetch on page change (search is handled by the effect above)
        // If it's page 1, the search effect might have already fetched it, but this ensures consistency
        fetchTransactions(false, page, searchQuery, startDate, endDate)
    }, [page])

    // Independent polling effect that always uses the *latest* page & searchQuery 
    // without resetting anything or triggering the loading state
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTransactions(true, page, searchQuery, startDate, endDate)
        }, 5000)

        // Cleanup the interval
        return () => clearInterval(interval)
    }, [page, searchQuery, startDate, endDate])

    const getStatusColor = (status: string | null) => {
        if (!status) return "bg-gray-500/10 text-gray-500"
        switch (status.toLowerCase()) {
            case "success":
            case "settlement":
                return "bg-emerald-500/10 text-emerald-500"
            case "pending":
                return "bg-orange-500/10 text-orange-500"
            case "failed":
            case "cancel":
            case "deny":
            case "expire":
                return "bg-red-500/10 text-red-500"
            default:
                return "bg-slate-500/10 text-slate-500"
        }
    }

    const formatCurrency = (amount: any) => {
        const num = Number(amount) || 0
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num)
    }

    const formatDate = (dateString: any) => {
        if (!dateString) return '-'
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Real-time monitoring of user payments and transactions.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap justify-end">
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-white border-slate-200 text-slate-600"
                        />
                        <span className="text-slate-400">-</span>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-white border-slate-200 text-slate-600"
                        />
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search Order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64 bg-white border-slate-200"
                        />
                    </div>
                    <button
                        onClick={() => fetchTransactions()}
                        disabled={loading || isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {loading && data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 h-64 space-y-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <p className="text-slate-500 text-sm">Loading transactions...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <Table>
                                <TableHeader className="bg-slate-50 border-b border-slate-200">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-600 font-semibold whitespace-nowrap">Order ID</TableHead>
                                        <TableHead className="text-slate-600 font-semibold">User Details</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-right">Amount</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-center">Status</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow className="border-0">
                                            <TableCell colSpan={5} className="text-center h-32 text-slate-500">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((tx) => (
                                            <TableRow key={tx.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-mono text-xs text-slate-600 whitespace-nowrap">
                                                    {tx.order_id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-800">{tx.name}</span>
                                                        <span className="text-xs text-slate-500">{tx.email}</span>
                                                        <span className="text-xs text-slate-400">{tx.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-700 font-medium whitespace-nowrap">
                                                    {formatCurrency(tx.amount)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`px-2 py-0.5 border-0 font-medium ${getStatusColor(tx.status)}`}>
                                                        {tx.status?.toUpperCase() || 'UNKNOWN'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 text-sm whitespace-nowrap">
                                                    {formatDate(tx.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 mt-auto">
                            <p className="text-sm text-slate-500">
                                Showing <span className="font-medium">{data.length > 0 ? (page - 1) * meta.limit + 1 : 0}</span> to <span className="font-medium">{Math.min(page * meta.limit, meta.total)}</span> of <span className="font-medium">{meta.total}</span> entries
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium text-slate-600 px-2">
                                    Page {page} of {Math.max(1, meta.totalPages)}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                    disabled={page >= meta.totalPages || loading}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    )
}
