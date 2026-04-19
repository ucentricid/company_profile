import Link from "next/link";
import { CheckCircle2, ShoppingCart, Monitor, ShieldCheck, Zap, Smartphone, HardDrive, LayoutDashboard, X, ArrowRight } from "lucide-react";

export default function UkasirPage() {
  return (
    <div className="flex flex-col">
      {/* SECTION 1 — HERO with Mesh Gradient & Premium Aesthetic */}
      <section className="relative overflow-hidden ukasir-mesh-gradient pt-32 pb-24 sm:pt-48 sm:pb-32 lg:pb-40">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                Partner UMKM Indonesia
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl font-red-hat-display leading-[1.1]">
                Aplikasi Kasir <br/>
                <span className="ukasir-text-gradient">Offline Terpercaya.</span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-gray-600 max-w-lg">
                Transaksi lebih cepat, laporan otomatis, dan <strong>tanpa biaya bulanan</strong>. Cukup beli sekali, pakai selamanya.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link
                  href="/buy"
                  className="ukasir-btn-glow rounded-2xl bg-blue-600 px-10 py-4 text-base font-bold text-white shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Beli Lisensi Sekarang
                </Link>
                <Link href="/trial" className="text-base font-bold leading-6 text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                  Coba Gratis 14 Hari <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative lg:mt-0 mt-12">
               <div className="relative z-10 rounded-3xl ukasir-glass p-4 shadow-2xl border border-white/50 ring-1 ring-black/5">
                  <div className="aspect-16/10 rounded-2xl bg-gray-900 shadow-inner flex items-center justify-center overflow-hidden relative">
                      {/* Fake UI Interface */}
                      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-gray-800 to-black opacity-90"></div>
                      <div className="flex flex-col items-center gap-4 text-blue-400 z-10">
                          <LayoutDashboard size={100} strokeWidth={1} className="animate-pulse" />
                          <span className="text-xs font-mono tracking-widest text-blue-300 uppercase">uKasir Interface v1.2</span>
                      </div>
                  </div>
               </div>
               {/* Background Decorative Circles */}
               <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
               <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM with Refined Cards */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Pain Points</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
               Kenapa Harus Pindah dari Cara Lama?
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              {[
                { title: "Manual & Lambat", desc: "Catatan kertas sering hilang, antrian jadi panjang, dan pelanggan tidak puas.", color: "bg-red-50 text-red-600" },
                { title: "Laporan Simpang Siur", desc: "Tidak tahu untung bersih? Data penjualan yang berantakan bikin bisnis sulit berkembang.", color: "bg-orange-50 text-orange-600" },
                { title: "Biaya Bulanan Mahal", desc: "Aplikasi lain menghisap keuntungan Anda setiap bulan dengan biaya langganan.", color: "bg-purple-50 text-purple-600" }
              ].map((p, i) => (
                <div key={i} className="flex flex-col p-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <dt className="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900 font-red-hat-display">
                    <div className={`p-2 rounded-xl ${p.color}`}>
                        <X className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {p.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 italic">
                    <p className="flex-auto">"{p.desc}"</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* SECTION 4 — BENTO GRID FEATURES */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-widest">Fitur Unggulan</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
               Solusi Modern Untuk UMKM Pintar
            </p>
          </div>
          
          <div className="ukasir-bento-grid">
            {/* Bento Item 1: Large */}
            <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-blue-600 p-10 text-white flex flex-col justify-between overflow-hidden relative group">
                <div className="relative z-10">
                    <Zap className="h-10 w-10 mb-6 text-blue-200" />
                    <h3 className="text-3xl font-bold font-red-hat-display">Transaksi Express</h3>
                    <p className="mt-4 text-blue-100 text-lg max-w-md">Layani pelanggan dalam hitungan detik. Scan barcode, pilih menu, cetak struk. Semudah itu.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <Smartphone size={300} strokeWidth={1} />
                </div>
            </div>

            {/* Bento Item 2 */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
                <div>
                   <LayoutDashboard className="h-8 w-8 text-blue-600 mb-4" />
                   <h3 className="text-xl font-bold text-gray-900 font-red-hat-display">Laporan Otomatis</h3>
                </div>
                <p className="mt-4 text-sm text-gray-600">Laporan harian, mingguan, dan bulanan jadi dalam satu klik saja.</p>
            </div>

            {/* Bento Item 3 */}
            <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between">
                <div>
                  <HardDrive className="h-8 w-8 text-emerald-600 mb-4" />
                  <h3 className="text-xl font-bold text-emerald-900 font-red-hat-display">Offline Total</h3>
                </div>
                <p className="mt-4 text-sm text-emerald-800">Tidak ada internet? Tidak masalah. Bisnis tetap jalan terus.</p>
            </div>

            {/* Bento Item 4 */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm flex flex-col justify-between">
                <div>
                   <ShoppingCart className="h-8 w-8 text-blue-600 mb-4" />
                   <h3 className="text-xl font-bold text-gray-900 font-red-hat-display">Stok Real-time</h3>
                </div>
                <p className="mt-4 text-sm text-gray-600">Pantau stok barang masuk dan keluar secara akurat.</p>
            </div>

            {/* Bento Item 5 */}
            <div className="rounded-3xl bg-gray-900 p-8 text-white flex flex-col justify-between">
                <div>
                   <ShieldCheck className="h-8 w-8 text-blue-400 mb-4" />
                   <h3 className="text-xl font-bold font-red-hat-display">Keamanan Data</h3>
                </div>
                <p className="mt-4 text-sm text-gray-400">Data Anda adalah milik Anda. Sepenuhnya tersimpan di perangkat lokal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — VALUE PROP (Final WOW) */}
      <section className="bg-white py-24 sm:py-32 overflow-hidden relative">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-[3rem] bg-gray-50 px-10 py-20 sm:p-24 lg:flex lg:items-center lg:gap-20 border border-gray-100 shadow-inner relative overflow-hidden">
               <div className="relative z-10 lg:w-1/2">
                  <h2 className="text-4xl font-extrabold text-gray-900 font-red-hat-display leading-tight">
                     Sekali Investasi, <br/>
                     <span className="ukasir-text-gradient">Untung Berkali-kali.</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600 leading-relaxed italic">
                    "Kami percaya UMKM tidak boleh dibebani biaya bulanan yang menghambat pertumbuhan. uKasir hadir sebagai partner setia bisnis Anda."
                  </p>
                  <div className="mt-10 flex gap-4 items-center">
                      <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">10k+</div>
                      <div>
                         <p className="text-sm font-bold text-gray-900">Dipercaya UMKM</p>
                         <p className="text-xs text-gray-500">Membantu digitalisasi toko mikro di seluruh Indonesia.</p>
                      </div>
                  </div>
               </div>
               <div className="lg:w-1/2 mt-16 lg:mt-0 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-blue-100/50 border border-blue-50">
                         <h4 className="font-bold text-blue-600 text-lg mb-1 font-red-hat-display">0%</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Biaya Bulanan</p>
                      </div>
                      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-emerald-100/50 border border-emerald-50">
                         <h4 className="font-bold text-emerald-600 text-lg mb-1 font-red-hat-display">100%</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Offline Mode</p>
                      </div>
                      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-xl shadow-gray-100/50 border border-gray-50">
                         <h4 className="font-bold text-gray-900 text-lg mb-1 font-red-hat-display">Update Selamanya</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Tanpa biaya tambahan untuk fitur baru.</p>
                      </div>
                  </div>
               </div>
               
               {/* Pattern Background */}
               <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500 opacity-[0.03] skew-x-12 translate-x-20"></div>
            </div>
         </div>
      </section>
    </div>
  );
}
