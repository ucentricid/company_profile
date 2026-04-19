"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Swal from "sweetalert2"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import Link from "next/link"

type PortfolioStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"

interface Portfolio {
   id: string
   title: string
   slug: string
   User: { name: string, image: string | null }
   status: PortfolioStatus
   createdAt: string
}

export default function PortfolioCMSClient() {
  const { data: session, status: sessionStatus } = useSession()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PortfolioStatus | "ALL">("PENDING")

  const fetchPortfolios = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/portfolio")
      if (res.ok) {
        let data: Portfolio[] = await res.json()
        if (filter !== "ALL") {
          data = data.filter(p => p.status === filter)
        }
        setPortfolios(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === "admin" || session?.user?.role === "superadmin") {
      fetchPortfolios()
    }
  }, [filter, session])

  const handleUpdateStatus = async (id: string, newStatus: PortfolioStatus) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Status portofolio berhasil diubah menjadi ${newStatus}.`,
          timer: 1500,
          showConfirmButton: false
        })
        fetchPortfolios()
      } else {
        const error = await res.json()
        Swal.fire("Gagal", error.message || "Terjadi kesalahan", "error")
      }
    } catch (error) {
       console.error(error)
       Swal.fire("Error", "Gagal menghubungi server", "error")
    }
  }

  const confirmAction = (id: string, action: "APPROVE" | "REJECT") => {
     Swal.fire({
         title: action === "APPROVE" ? "Setujui Portofolio?" : "Tolak Portofolio?",
         text: action === "APPROVE" ? "Portofolio ini akan langsung tayang ke publik." : "Portofolio akan dikembalikan ke pengguna (ditolak).",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: action === "APPROVE" ? "#10b981" : "#ef4444",
         cancelButtonColor: "#6b7280",
         confirmButtonText: action === "APPROVE" ? "Ya, Terbitkan!" : "Ya, Tolak!",
         cancelButtonText: "Batal"
     }).then((result) => {
         if (result.isConfirmed) {
            handleUpdateStatus(id, action === "APPROVE" ? "APPROVED" : "REJECTED")
         }
     })
  }

  const getStatusBadge = (status: PortfolioStatus) => {
      switch (status) {
         case "DRAFT": return <Badge variant="secondary">Draft</Badge>
         case "PENDING": return <Badge variant="warning">Menunggu Review</Badge>
         case "APPROVED": return <Badge variant="success">Tayang</Badge>
         case "REJECTED": return <Badge variant="destructive">Ditolak</Badge>
         default: return null
      }
   }

  if (sessionStatus === "loading") return <div>Loading...</div>
  if (session?.user?.role !== "admin" && session?.user?.role !== "superadmin") return <div>Akses Ditolak. Halaman khusus admin.</div>

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle className="text-2xl">Manajemen Portofolio (CMS)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Button variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>Semua</Button>
          <Button variant={filter === "PENDING" ? "default" : "outline"} onClick={() => setFilter("PENDING")}>Butuh Review</Button>
          <Button variant={filter === "APPROVED" ? "default" : "outline"} onClick={() => setFilter("APPROVED")}>Sudah Tayang</Button>
          <Button variant={filter === "REJECTED" ? "default" : "outline"} onClick={() => setFilter("REJECTED")}>Ditolak</Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Judul Portofolio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Submit</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Memuat data...</TableCell>
                </TableRow>
              ) : portfolios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Tidak ada portofolio dengan status {filter}</TableCell>
                </TableRow>
              ) : (
                portfolios.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.User.name}</TableCell>
                    <TableCell className="max-w-xs truncate" title={post.title}>{post.title}</TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                         <Link href={`/portfolio/p/${post.slug}`} target="_blank">
                            <Button size="sm" variant="outline">Review</Button>
                         </Link>
                         {post.status === "PENDING" && (
                           <>
                              <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => confirmAction(post.id, "APPROVE")}>Setuju</Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => confirmAction(post.id, "REJECT")}>Tolak</Button>
                           </>
                         )}
                         {post.status === "APPROVED" && (
                           <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => confirmAction(post.id, "REJECT")}>Tarik Tayangan</Button>
                         )}
                         {post.status === "REJECTED" && (
                           <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => confirmAction(post.id, "APPROVE")}>Publikasi Ulang</Button>
                         )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
