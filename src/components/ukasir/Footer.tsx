import Link from "next/link";

export default function UkasirFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-[#1E1B4B] font-red-hat-display tracking-tight">
              uKasir<span className="text-blue-600">.</span>
            </Link>
            <p className="mt-6 text-sm text-gray-500 leading-relaxed font-medium">
              Solusi kasir offline modern untuk UMKM Indonesia. Cukup beli sekali, pakai selamanya tanpa biaya langganan.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Menu</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">Home</Link></li>
              <li><Link href="/fitur" className="text-gray-600 hover:text-blue-600 text-sm">Fitur</Link></li>
              <li><Link href="/harga" className="text-gray-600 hover:text-blue-600 text-sm">Harga</Link></li>
              <li><Link href="/download" className="text-gray-600 hover:text-blue-600 text-sm">Download</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/reseller" className="text-gray-600 hover:text-blue-600 text-sm">Reseller</Link></li>
              <li><Link href="/support" className="text-gray-600 hover:text-blue-600 text-sm">Pusat Bantuan</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Kontak Kami</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Email: support@ukasir.id</li>
              <li>WhatsApp: +62 8xx-xxxx-xxxx</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} uKasir. Part of UCENTRIC.
          </p>
        </div>
      </div>
    </footer>
  );
}
