import { Check, Info } from "lucide-react";
import Link from "next/link";

export default function UkasirHargaPage() {
  const benefits = [
    "Lisensi Berlaku Selamanya",
    "Update Software Gratis",
    "Support Teknisi Prioritas",
    "Bisa Digunakan Offline",
    "Tanpa Biaya Bulanan",
    "Tanpa Biaya Admin",
  ];

  return (
    <div className="bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pilihan Investasi</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
            Harga Sederhana, Tanpa Biaya Tersembunyi
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Cukup beli sekali, pakai selamanya. Tidak perlu pusing dengan tagihan bulanan yang memberatkan bisnis UMKM Anda.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-md rounded-3xl bg-white border-2 border-blue-600 p-8 shadow-2xl ring-1 ring-gray-200">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-bold text-white uppercase tracking-wider">
              Paling Populer
            </div>
            
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-2xl font-bold leading-8 text-gray-900 font-red-hat-display">Lisensi Basic</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">Cocok untuk 1 toko dengan 1 perangkat kasir utama.</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">Rp 450.000</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/ sekali bayar</span>
            </p>
            
            <Link
              href="/buy"
              className="mt-8 block w-full rounded-full bg-blue-600 px-3 py-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all font-red-hat-display uppercase tracking-wide"
            >
              Beli Sekarang
            </Link>

            <ul role="list" className="mt-10 space-y-4 text-sm leading-6 text-gray-600">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-x-3 items-center">
                  <Check className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 rounded-xl bg-blue-50 p-4">
               <Info className="h-5 w-5 text-blue-600 mt-0.5" />
               <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Lisensi akan dikirimkan melalui Email dan WhatsApp segera setelah konfirmasi pembayaran dilakukan.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center rounded-3xl bg-gray-900 px-6 py-12 text-center sm:px-12 sm:py-20">
           <h2 className="text-2xl font-bold text-white sm:text-3xl font-red-hat-display">Masih Ragu?</h2>
           <p className="mt-4 text-lg text-gray-300">
              Coba uKasir gratis selama 14 hari tanpa kartu kredit dan rasakan kemudahannya.
           </p>
           <div className="mt-10">
              <Link
                href="/trial"
                className="rounded-full border border-white px-8 py-3 text-sm font-semibold text-white hover:bg-white hover:text-gray-900 transition-all"
              >
                Download & Coba Sekarang
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
