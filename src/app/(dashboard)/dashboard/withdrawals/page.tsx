"use client"

import { useEffect, useState } from "react"
import { getWithdrawals, updateWithdrawalStatus } from "@/app/actions/withdrawal"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { withdrawals } from "@prisma/client"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { Modal } from "@/components/ui/Modal"

export default function WithdrawalsPage() {
    const [data, setData] = useState<withdrawals[]>([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ totalPages: 1, total: 0, limit: 50 })

    const [selectedWd, setSelectedWd] = useState<withdrawals | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        setUpdatingStatus(true)
        try {
            const res = await updateWithdrawalStatus(id, newStatus)
            if (res?.success) {
                // Refresh data
                fetchWithdrawals()
                // Update selected Wd so modal UI updates immediately
                if (selectedWd && selectedWd.id === id) {
                    setSelectedWd({ ...selectedWd, status: newStatus.toLowerCase(), updated_at: new Date() })
                }
            } else {
                alert(res?.error || "Failed to update status")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setUpdatingStatus(false)
        }
    }

    const fetchWithdrawals = async (
        silently = false,
        currentPage = page,
        currentSearch = searchQuery,
        currentStart = startDate,
        currentEnd = endDate
    ) => {
        if (!silently) setLoading(true)
        else setIsRefreshing(true)

        try {
            const res = await getWithdrawals(currentPage, currentSearch, currentStart, currentEnd)
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
            fetchWithdrawals(false, 1, searchQuery, startDate, endDate)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, startDate, endDate])

    // Fetch when page changes
    useEffect(() => {
        // Only fetch on page change (search is handled by the effect above)
        fetchWithdrawals(false, page, searchQuery, startDate, endDate)
    }, [page])

    // Independent polling effect
    useEffect(() => {
        const interval = setInterval(() => {
            fetchWithdrawals(true, page, searchQuery, startDate, endDate)
        }, 5000)

        // Cleanup the interval
        return () => clearInterval(interval)
    }, [page, searchQuery, startDate, endDate])

    const getStatusColor = (status: string | null) => {
        if (!status) return "bg-gray-500/10 text-gray-500"
        switch (status.toLowerCase()) {
            case "success":
            case "completed":
                return "bg-emerald-500/10 text-emerald-500"
            case "pending":
                return "bg-orange-500/10 text-orange-500"
            case "failed":
            case "rejected":
            case "cancel":
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Affiliate Withdrawals</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage and review affiliate withdrawal requests.
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap md:justify-end">
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
                            placeholder="Search Email/Bank/Account..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64 bg-white border-slate-200"
                        />
                    </div>
                    <button
                        onClick={() => fetchWithdrawals()}
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
                        <p className="text-slate-500 text-sm">Loading withdrawals...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <Table>
                                <TableHeader className="bg-slate-50 border-b border-slate-200">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-600 font-semibold whitespace-nowrap">User Name</TableHead>
                                        <TableHead className="text-slate-600 font-semibold">User Email</TableHead>
                                        <TableHead className="text-slate-600 font-semibold">Bank Info</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-right whitespace-nowrap">Amount</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-center">Status</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-right whitespace-nowrap">Date</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-center w-24">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow className="border-0">
                                            <TableCell colSpan={7} className="text-center h-32 text-slate-500">
                                                No withdrawals found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((wd) => (
                                            <TableRow key={wd.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-semibold text-slate-800 whitespace-nowrap">
                                                    {wd.account_name || '-'}
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-500 whitespace-nowrap">
                                                    {wd.user_email || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-700">{wd.bank_name}</span>
                                                        <span className="font-mono text-xs text-slate-500">{wd.account_number}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-slate-800 whitespace-nowrap">
                                                    {formatCurrency(wd.amount)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`px-2 py-0.5 border-0 font-medium whitespace-nowrap capitalize ${getStatusColor(wd.status)}`}>
                                                        {wd.status || 'UNKNOWN'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 text-sm whitespace-nowrap">
                                                    {formatDate(wd.created_at)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-orange-50"
                                                        onClick={() => {
                                                            setSelectedWd(wd)
                                                            setIsModalOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
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

            {/* Detail Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Withdrawal Details"
                description={`Full information for withdrawal request`}
                maxWidth="max-w-2xl"
            >
                {selectedWd && (
                    <div className="space-y-6">
                        {/* Summary Header */}
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Requested Amount</p>
                                <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(selectedWd.amount)}</h3>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-sm text-slate-500 mb-1.5">Current Status</p>
                                <div className="relative">
                                    <select
                                        value={selectedWd.status?.toLowerCase() || 'pending'}
                                        onChange={(e) => handleUpdateStatus(selectedWd.id, e.target.value)}
                                        disabled={updatingStatus}
                                        className={`px-3 py-1.5 rounded-full border-0 text-sm font-medium capitalize appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm ${getStatusColor(selectedWd.status)}`}
                                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                                    >
                                        <option value="pending" className="bg-white text-slate-700">Pending</option>
                                        <option value="process" className="bg-white text-slate-700">Process</option>
                                        <option value="approved" className="bg-white text-slate-700">Approved</option>
                                        <option value="success" className="bg-white text-slate-700">Success</option>
                                        <option value="rejected" className="bg-white text-slate-700">Rejected</option>
                                    </select>
                                    {updatingStatus && (
                                        <span className="absolute -bottom-5 right-0 text-[10px] text-primary animate-pulse whitespace-nowrap">
                                            Updating...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* General Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">General Info</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Withdrawal ID</p>
                                        <p className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mt-1 break-all">
                                            {selectedWd.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">User Email</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                            {selectedWd.user_email || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Created At</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                            {formatDate(selectedWd.created_at)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Last Updated</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                            {formatDate(selectedWd.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Bank Details</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Bank Name</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                            {selectedWd.bank_name || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Account Name</p>
                                        <p className="text-sm font-medium text-slate-700 mt-1">
                                            {selectedWd.account_name || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Account Number</p>
                                        <p className="font-mono text-base font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                                            {selectedWd.account_number || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
