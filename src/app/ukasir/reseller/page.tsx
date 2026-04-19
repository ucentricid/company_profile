"use client";

import { useState } from "react";
import { Send, CheckCircle, Users, BadgePercent, Layout, Headphones } from "lucide-react";
import Swal from "sweetalert2";

export default function UkasirResellerPage() {
  const [formData, setFormData] = useState({
    nama: "",
    kota: "",
    whatsapp: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    Swal.fire({
      title: "Pendaftaran Berhasil!",
      text: "Terima kasih telah mendaftar. Tim kami akan segera menghubungi Anda melalui WhatsApp.",
      icon: "success",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Sip, Saya Tunggu!",
    });
    setFormData({ nama: "", kota: "", whatsapp: "", email: "" });
  };

  const benefits = [
    { icon: BadgePercent, title: "Komisi Penjualan", desc: "Dapatkan komisi yang menguntungkan untuk setiap lisensi yang terjual." },
    { icon: Layout, title: "Materi Promosi", desc: "Kami sediakan banner, video, dan template copywriting siap pakai." },
    { icon: Headphones, title: "Support Tim", desc: "Grup eksklusif reseller untuk bantuan teknis dan update terbaru." },
    { icon: Users, title: "Pertumbuhan Karier", desc: "Kesempatan menjadi distributor resmi di kota Anda." }
  ];

  return (
    <div className="bg-white pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Peluang Bisnis</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl font-red-hat-display">
            Bergabung Menjadi Reseller uKasir
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dapatkan penghasilan tambahan dengan membantu UMKM di sekitar Anda digitalisasi usaha mereka menggunakan aplikasi kasir terbaik.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
          {/* Benefits Side */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 font-red-hat-display mb-8">Kenapa Menjadi Reseller uKasir?</h3>
            <div className="space-y-8">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{b.title}</h4>
                    <p className="mt-1 text-sm text-gray-600">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 font-red-hat-display mb-6">Formulir Pendaftaran</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nama" className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  id="nama"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 transition-all"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="kota" className="block text-sm font-semibold text-gray-700">Kota Domisili</label>
                  <input
                    type="text"
                    id="kota"
                    required
                    value={formData.kota}
                    onChange={(e) => setFormData({...formData, kota: e.target.value})}
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 transition-all"
                    placeholder="Contoh: Jakarta"
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 transition-all"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Alamat Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-2 block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-600 focus:ring-blue-600 transition-all"
                  placeholder="anda@email.com"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                Kirim Pendaftaran <Send className="h-4 w-4" />
              </button>
              <p className="text-center text-xs text-gray-500">
                Dengan mendaftar, Anda menyetujui program reseller uKasir.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
