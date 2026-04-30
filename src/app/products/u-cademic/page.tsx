import Link from "next/link";
import { CheckCircle2, GraduationCap, Monitor, BookOpen, Users, Calendar, ArrowRight, X, ShieldCheck, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "U-Cademic | Smart Campus Ecosystem",
  description: "A smart campus ecosystem connecting schools, parents, and students. Digitalize academic processes effortlessly.",
};

export default function UCademicPage() {
  return (
    <div className="flex flex-col">
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-orange-50 via-white to-red-50 pt-32 pb-24 sm:pt-48 sm:pb-32 lg:pb-40">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600 ring-1 ring-inset ring-orange-600/20 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-orange-600"></span>
                Education Technology
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl leading-[1.1]">
                Smart Campus <br/>
                <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Ecosystem.</span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-gray-600 max-w-lg">
                Connect schools, parents, and students in one seamless platform. 
                Digitalize academic processes <strong>effortlessly</strong>.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <Link
                  href="/contact"
                  className="rounded-2xl bg-orange-600 px-10 py-4 text-base font-bold text-white shadow-2xl shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95"
                >
                  Request Demo
                </Link>
                <Link href="#features" className="text-base font-bold leading-6 text-gray-900 hover:text-orange-600 transition-colors flex items-center gap-2 group">
                  Explore Features <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative lg:mt-0 mt-12">
               <div className="relative z-10 rounded-3xl bg-white/70 backdrop-blur-xl p-4 shadow-2xl border border-white/50 ring-1 ring-black/5">
                  <div className="aspect-16/10 rounded-2xl bg-linear-to-br from-orange-500 to-red-600 shadow-inner flex items-center justify-center overflow-hidden relative">
                      <div className="flex flex-col items-center gap-4 text-white z-10">
                          <GraduationCap size={100} strokeWidth={1} className="animate-pulse" />
                          <span className="text-xs font-mono tracking-widest text-white/80 uppercase">U-Cademic Platform v2.0</span>
                      </div>
                  </div>
               </div>
               <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl"></div>
               <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-red-400/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEM */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-base font-semibold leading-7 text-orange-600 uppercase tracking-widest">Pain Points</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
               Why Traditional Education Systems Fall Short
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              {[
                { title: "Fragmented Communication", desc: "Information scattered across WhatsApp groups, emails, and paper notices. Parents miss important updates.", color: "bg-red-50 text-red-600" },
                { title: "Manual Administration", desc: "Attendance, grades, and reports handled manually. Hours wasted on paperwork instead of teaching.", color: "bg-orange-50 text-orange-600" },
                { title: "Limited Parent Insight", desc: "Parents have no real-time visibility into their child's progress, attendance, or school activities.", color: "bg-purple-50 text-purple-600" }
              ].map((p, i) => (
                <div key={i} className="flex flex-col p-8 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <dt className="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900">
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

      {/* SECTION 3 — FEATURES */}
      <section id="features" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-orange-600 uppercase tracking-widest">Core Modules</h2>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
               Everything Your Campus Needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: LMS */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                    <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Learning Management System</h3>
                <p className="text-gray-600">Create, distribute, and grade assignments digitally. Track student progress with intuitive dashboards.</p>
            </div>

            {/* Feature 2: Attendance */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6">
                    <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Attendance & Reports</h3>
                <p className="text-gray-600">Automated attendance tracking with real-time reports. Generate report cards in one click.</p>
            </div>

            {/* Feature 3: Parent Portal */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
                    <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Parent-Teacher Portal</h3>
                <p className="text-gray-600">Direct communication channel between parents and teachers. Share progress updates instantly.</p>
            </div>

            {/* Feature 4: Real-time */}
            <div className="rounded-3xl bg-linear-to-br from-orange-500 to-red-600 p-8 text-white shadow-lg md:col-span-2 lg:col-span-1">
                <Zap className="h-8 w-8 mb-6 text-orange-200" />
                <h3 className="text-xl font-bold mb-3">Real-time Notifications</h3>
                <p className="text-orange-100">Instant alerts for attendance, grades, and announcements. Never miss an important update.</p>
            </div>

            {/* Feature 5: Secure */}
            <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-lg">
                <ShieldCheck className="h-8 w-8 mb-6 text-orange-400" />
                <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-gray-400">Role-based access control, encrypted data, and compliance with education data privacy standards.</p>
            </div>

            {/* Feature 6: Analytics */}
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                    <Monitor className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600">Comprehensive insights into student performance, attendance trends, and institutional metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section className="bg-white py-24 sm:py-32 overflow-hidden relative">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="rounded-[3rem] bg-gray-50 px-10 py-20 sm:p-24 lg:flex lg:items-center lg:gap-20 border border-gray-100 shadow-inner relative overflow-hidden">
               <div className="relative z-10 lg:w-1/2">
                  <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                     Ready to Transform <br/>
                     <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Your Campus?</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600 leading-relaxed italic">
                    "Join hundreds of schools already using U-Cademic to deliver better education experiences."
                  </p>
                  <div className="mt-10 flex flex-wrap gap-4">
                      <Link href="/contact" className="rounded-2xl bg-orange-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95">
                         Schedule a Demo
                      </Link>
                  </div>
               </div>
               <div className="lg:w-1/2 mt-16 lg:mt-0 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-orange-100/50 border border-orange-50">
                         <h4 className="font-bold text-orange-600 text-lg mb-1">500+</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Schools Partnered</p>
                      </div>
                      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-red-100/50 border border-red-50">
                         <h4 className="font-bold text-red-600 text-lg mb-1">100K+</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Students</p>
                      </div>
                      <div className="col-span-2 rounded-2xl bg-white p-6 shadow-xl shadow-gray-100/50 border border-gray-50">
                         <h4 className="font-bold text-gray-900 text-lg mb-1">99.9% Uptime</h4>
                         <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Reliable cloud infrastructure.</p>
                      </div>
                  </div>
               </div>
               
               <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500 opacity-[0.03] skew-x-12 translate-x-20"></div>
            </div>
         </div>
      </section>
    </div>
  );
}
