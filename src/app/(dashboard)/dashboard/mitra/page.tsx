"use client"

import { useEffect, useState } from "react"
import { getMitraAktif } from "@/app/actions/mitra"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table"
import { ukasir_token } from "@prisma/client"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet, Eye } from "lucide-react"

export default function MitraAktifPage() {
    const [data, setData] = useState<ukasir_token[]>([])
    const [loading, setLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [page, setPage] = useState(1)
    const [meta, setMeta] = useState({ totalPages: 1, total: 0, limit: 50 })

    // Modal state
    const [selectedMitra, setSelectedMitra] = useState<ukasir_token | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchMitra = async (
        silently = false,
        currentPage = page,
        currentSearch = searchQuery,
        currentStart = startDate,
        currentEnd = endDate
    ) => {
        if (!silently) setLoading(true)
        else setIsRefreshing(true)

        try {
            const res = await getMitraAktif(currentPage, currentSearch, currentStart, currentEnd)
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
            fetchMitra(false, 1, searchQuery, startDate, endDate)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery, startDate, endDate])

    // Fetch when page changes
    useEffect(() => {
        // Only fetch on page change (search is handled by the effect above)
        fetchMitra(false, page, searchQuery, startDate, endDate)
    }, [page])

    // Independent polling effect that always uses the *latest* page & searchQuery 
    // without resetting anything or triggering the loading state
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMitra(true, page, searchQuery, startDate, endDate)
        }, 5000)

        // Cleanup the interval
        return () => clearInterval(interval)
    }, [page, searchQuery, startDate, endDate])

    const getStatusColor = (status: boolean | null) => {
        if (status === null) return "bg-gray-500/10 text-gray-500"
        return status ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
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

    const getDeviceIcon = (deviceType: string | null) => {
        if (!deviceType) return <Monitor className="w-4 h-4 text-slate-400" />
        deviceType = deviceType.toLowerCase()
        if (deviceType.includes('mobile') || deviceType.includes('phone') || deviceType.includes('android') || deviceType.includes('ios')) {
            return <Smartphone className="w-4 h-4 text-slate-500" />
        }
        if (deviceType.includes('tablet') || deviceType.includes('ipad')) {
            return <Tablet className="w-4 h-4 text-slate-500" />
        }
        return <Monitor className="w-4 h-4 text-slate-500" />
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Mitra Aktif</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Daftar perangkat (UKasir Token) dari mitra yang terdaftar.
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
                            placeholder="Search Name/Email/Token..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-64 bg-white border-slate-200"
                        />
                    </div>
                    <button
                        onClick={() => fetchMitra()}
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
                        <p className="text-slate-500 text-sm">Loading Mitra Aktif...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto flex-1">
                            <Table>
                                <TableHeader className="bg-slate-50 border-b border-slate-200">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-600 font-semibold whitespace-nowrap">Order ID</TableHead>
                                        <TableHead className="text-slate-600 font-semibold">User</TableHead>
                                        <TableHead className="text-slate-600 font-semibold whitespace-nowrap">Token Number</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-center">Status</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-right">Register Date</TableHead>
                                        <TableHead className="text-slate-600 font-semibold text-center w-24">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow className="border-0">
                                            <TableCell colSpan={7} className="text-center h-32 text-slate-500">
                                                No Mitra Aktif found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((mitra) => (
                                            <TableRow key={mitra.token_number} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                                                    {mitra.order_id || '-'}
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-800 whitespace-nowrap">
                                                    {mitra.name || '-'}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-slate-600 whitespace-nowrap">
                                                    {mitra.token_number}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`px-2 py-0.5 border-0 font-medium whitespace-nowrap ${getStatusColor(mitra.status_active)}`}>
                                                        {mitra.status_active ? 'ACTIVE' : 'INACTIVE'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-500 text-sm whitespace-nowrap">
                                                    {formatDate(mitra.register_date)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-orange-50"
                                                        onClick={() => {
                                                            setSelectedMitra(mitra)
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
                title="Mitra Details"
                description={`Detail information for token ${selectedMitra?.token_number}`}
                maxWidth="max-w-2xl"
            >
                {selectedMitra && (
                    <div className="space-y-6">
                        {/* User Summary */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
                                {selectedMitra.name ? selectedMitra.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{selectedMitra.name || 'Unknown User'}</h3>
                                <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                                    <p>Email: <span className="text-slate-700 font-medium">{selectedMitra.email || '-'}</span></p>
                                    <p>Phone: <span className="text-slate-700 font-medium">{selectedMitra.phone || '-'}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Registration Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Registration</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Token Number</p>
                                        <p className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mt-1">
                                            {selectedMitra.token_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Order ID</p>
                                        <p className="font-mono text-sm font-medium text-slate-700">
                                            {selectedMitra.order_id || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <Badge className={`px-2 py-0.5 border-0 font-medium ${getStatusColor(selectedMitra.status_active)}`}>
                                            {selectedMitra.status_active ? 'ACTIVE' : 'INACTIVE'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Register Date</p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {formatDate(selectedMitra.register_date)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Device & Referral */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">System Info</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Device Category</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getDeviceIcon(selectedMitra.device_type)}
                                            <p className="text-sm font-medium text-slate-700 capitalize">
                                                {selectedMitra.device_type || 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Device Name</p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {selectedMitra.device_name || 'Unknown Device'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Device ID</p>
                                        <p className="font-mono text-xs font-medium text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 mt-1 break-all">
                                            {selectedMitra.device_id || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Referral Code Used</p>
                                        <p className="font-mono text-sm font-medium text-primary bg-primary/5 px-2 py-1 rounded inline-block mt-1">
                                            {selectedMitra.referral_code || '-'}
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
