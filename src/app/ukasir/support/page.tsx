import { HelpCircle, Play, FileText, MessageCircle, Mail } from "lucide-react";

export default function UkasirSupportPage() {
  const faqs = [
    {
      q: "Apakah uKasir memerlukan koneksi internet?",
      a: "Tidak. uKasir dirancang dengan prinsip 'Offline-First' sehingga Anda tetap bisa melakukan transaksi walaupun tidak ada internet. Internet hanya diperlukan saat aktivasi lisensi atau backup data opsional."
    },
    {
      q: "Apakah ada biaya bulanan?",
      a: "Sama sekali tidak ada. uKasir menggunakan sistem lisensi 'Sekali Beli'. Anda cukup membayar satu kali di awal dan bisa menggunakan software selamanya."
    },
    {
      q: "Printer apa saja yang didukung?",
      a: "uKasir mendukung hampir semua printer thermal (ukuran 58mm atau 80mm). Untuk Android bisa menggunakan Bluetooth, dan untuk Windows bisa menggunakan kabel USB."
    },
    {
      q: "Bagaimana jika perangkat saya hilang atau rusak?",
      a: "Tenang, Anda dapat memindahkan lisensi ke perangkat baru dengan menghubungi tim support kami melalui WhatsApp atau Email resmi."
    }
  ];

  return (
    <div className="bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Pusat Bantuan</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
            Kami Siap Membantu Anda
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Temukan jawaban dari pertanyaan umum, pelajari cara penggunaan melalui tutorial, atau hubungi tim support kami secara langsung.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-6">
                <Play className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 font-red-hat-display">Video Tutorial</h3>
             <p className="mt-2 text-sm text-gray-600">Pelajari langkah-langkah penggunaan uKasir mulai dari awal hingga mahir melalui video pendek.</p>
             <button className="mt-6 text-sm font-bold text-blue-600 hover:underline">Tonton Sekarang →</button>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-6">
                <FileText className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 font-red-hat-display">Panduan Pengguna</h3>
             <p className="mt-2 text-sm text-gray-600">Dokumentasi lengkap dalam format teks dan gambar untuk membantu Anda memahami fitur uKasir.</p>
             <button className="mt-6 text-sm font-bold text-blue-600 hover:underline">Baca Selengkapnya →</button>
          </div>
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-6">
                <MessageCircle className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 font-red-hat-display">Live Chat Support</h3>
             <p className="mt-2 text-sm text-gray-600">Butuh bantuan cepat? Hubungi teknisi kami langsung melalui WhatsApp setiap hari pukul 09.00 - 21.00.</p>
             <button className="mt-6 text-sm font-bold text-blue-600 hover:underline">Chat WhatsApp →</button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
           <h3 className="text-2xl font-bold text-gray-900 font-red-hat-display text-center mb-12">Pertanyaan Populer (FAQ)</h3>
           <div className="mx-auto max-w-3xl space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
                   <div className="flex gap-4">
                      <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                      <div>
                         <h4 className="font-bold text-gray-900">{faq.q}</h4>
                         <p className="mt-3 text-sm text-gray-600 leading-relaxed italic">"{faq.a}"</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Contact Footer */}
        <div className="mt-24 rounded-3xl bg-blue-600 p-8 text-center text-white sm:p-12">
           <h3 className="text-2xl font-bold font-red-hat-display">Masih memiliki pertanyaan lain?</h3>
           <p className="mt-4 text-blue-100">Tim kami siap menjawab kebingungan Anda mengenai uKasir.</p>
           <div className="mt-10 flex flex-wrap justify-center gap-6">
              <a href="mailto:support@ukasir.id" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all">
                 <Mail className="h-4 w-4" /> support@ukasir.id
              </a>
              <a href="#" className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-white hover:bg-green-600 transition-all">
                 <MessageCircle className="h-4 w-4" /> WhatsApp Support
              </a>
           </div>
        </div>
      </div>
    </div>
  );
}
