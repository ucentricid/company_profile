import { CheckCircle2, Zap, Smartphone, LayoutDashboard, ShoppingCart, HardDrive, ShieldCheck } from "lucide-react";

export default function UkasirFiturPage() {
  const features = [
    {
      title: "Transaksi Cepat",
      desc: "Input produk dan transaksi dalam hitungan detik. Mendukung scan barcode dan pencarian produk yang instan.",
      icon: Zap,
      details: ["Input Produk Instan", "Diskon Per Barang", "Metode Pembayaran Tunai & QRIS", "Kembalian Otomatis"]
    },
    {
      title: "Manajemen Produk",
      desc: "Kelola ribuan produk dengan mudah tanpa pusing. Atur harga modal dan harga jual untuk hitung laba.",
      icon: ShoppingCart,
      details: ["Tambah/Edit Produk", "Kategori Produk", "Custom Harga", "Import Excel (Segera)"]
    },
    {
      title: "Laporan Lengkap",
      desc: "Laporan yang bersih dan mudah dipahami. Tahu persis berapa laba bersih Anda setiap harinya.",
      icon: LayoutDashboard,
      details: ["Laporan Harian", "Laporan Bulanan", "Laporan Produk Terlaris", "Laporan Laba Kotor"]
    },
    {
      title: "Stok Barang Real-time",
      desc: "Stok berkurang otomatis saat terjual. Dapatkan notifikasi jika stok barang tertentu mulai menipis.",
      icon: HardDrive,
      details: ["Pantau Stok Otomatis", "Histori Stok Masuk", "Notifikasi Stok Menipis", "Opname Stok"]
    },
    {
      title: "Cetak Struk",
      desc: "Bisa cetak struk untuk pelanggan sebagai bukti transaksi. Sangat profesional untuk UMKM.",
      icon: Smartphone,
      details: ["Support Printer Bluetooth", "Support Printer USB", "Custom Header Struk", "Footer Pesan Terima Kasih"]
    },
    {
      title: "Backup & Aman",
      desc: "Data tersimpan aman di perangkat Anda sendiri. Tidak perlu takut data bocor atau hilang.",
      icon: ShieldCheck,
      details: ["Backup ke Cloud/Internal", "Restore Data Mudah", "Enkripsi Data", "Akses Offline Total"]
    }
  ];

  return (
    <div className="bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Fitur Lengkap</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
            Segalanya yang Anda butuhkan untuk mengelola toko
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            uKasir dirancang dengan fitur esensial tanpa ribet. Fokus pada kemudahan penggunaan namun tetap powerful untuk bisnis UMKM.
          </p>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-gray-50/50 p-8 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 font-red-hat-display">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed italic">{feature.desc}</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                   {feature.details.map((detail, dIdx) => (
                     <div key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{detail}</span>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
