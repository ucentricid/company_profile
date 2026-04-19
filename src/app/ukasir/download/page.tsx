import { Smartphone, Monitor, Download, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UkasirDownloadPage() {
  const platforms = [
    {
      name: "Android",
      icon: Smartphone,
      version: "v1.2.4",
      size: "18 MB",
      desc: "Ideal untuk penggunaan mobile atau tablet kasir. Mendukung printer thermal bluetooth.",
      link: "#",
      primary: true
    },
    {
      name: "Windows",
      icon: Monitor,
      version: "v1.2.0",
      size: "45 MB",
      desc: "Cocok untuk penggunaan PC Desktop atau Laptop di meja kasir. Mendukung printer thermal USB.",
      link: "#",
      primary: false
    }
  ];

  return (
    <div className="bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Mulai Gunakan</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
            Download uKasir Sekarang
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Pilih platform yang sesuai dengan perangkat di toko Anda. Instalasi cepat, tanpa pengaturan rumit.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {platforms.map((p, idx) => (
            <div key={idx} className={`rounded-3xl p-8 border ${p.primary ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 bg-white'} flex flex-col`}>
               <div className={`p-3 rounded-2xl w-fit ${p.primary ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <p.icon className="h-8 w-8" />
               </div>
               <h3 className="mt-6 text-2xl font-bold text-gray-900 font-red-hat-display">uKasir for {p.name}</h3>
               <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span>Versi {p.version}</span>
                  <span>•</span>
                  <span>Ukuran {p.size}</span>
               </div>
               <p className="mt-4 text-gray-600 leading-relaxed italic flex-1">
                  "{p.desc}"
               </p>
               <button className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold transition-all active:scale-95 ${p.primary ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-gray-900 text-white hover:bg-black underline'}`}>
                  Download Installer <Download className="h-4 w-4" />
               </button>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t pt-16">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 font-bold">1</div>
                 <h4 className="font-bold text-gray-900">Download</h4>
                 <p className="mt-2 text-sm text-gray-600">Pilih file sesuai OS perangkat Anda.</p>
              </div>
              <div className="text-center">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 font-bold">2</div>
                 <h4 className="font-bold text-gray-900">Instal</h4>
                 <p className="mt-2 text-sm text-gray-600">Buka file dan ikuti panduan instalasi.</p>
              </div>
              <div className="text-center">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 font-bold">3</div>
                 <h4 className="font-bold text-gray-900">Selesai</h4>
                 <p className="mt-2 text-sm text-gray-600">Buka uKasir dan mulai transaksi pertama Anda.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
