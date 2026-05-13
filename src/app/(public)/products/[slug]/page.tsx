import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import * as LucideIcons from "lucide-react"

type Product = {
    id: string
    name: string
    slug: string
    tagline: string
    description: string
    iconName: string
    features: string[]
    heroTitle: string | null
    heroGradient: string | null
    ctaText: string
    ctaLink: string
    content: string | null
    imageUrl: string | null
    isActive: boolean
}

async function getProduct(slug: string): Promise<Product | null> {
    try {
        const product = await db.product.findUnique({ where: { slug } })
        return product as Product | null
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const product = await getProduct(slug)
    if (!product) return { title: "Product Not Found" }

    return {
        title: `${product.name} | Ucentric`,
        description: product.description,
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = await getProduct(slug)

    if (!product || !product.isActive) notFound()

    // If product has custom HTML content, render it directly
    if (product.content) {
        return (
            <div className="min-h-screen bg-white pt-20">
                <div dangerouslySetInnerHTML={{ __html: product.content }} />
            </div>
        )
    }

    // Default product template
    // @ts-ignore - dynamic icon loading
    const Icon = (LucideIcons as any)[product.iconName] || LucideIcons.Box
    const gradientClass = product.heroGradient || "from-primary to-primary/80"

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* HERO */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 pt-32 pb-24 sm:pt-48 sm:pb-32">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 lg:items-center">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20 mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-primary" />
                                {product.tagline}
                            </div>
                            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl leading-tight">
                                {product.heroTitle || product.name}
                            </h1>
                            <p className="mt-8 text-xl leading-8 text-gray-600 max-w-lg">
                                {product.description}
                            </p>
                            <div className="mt-12 flex flex-wrap items-center gap-6">
                                <Link
                                    href={product.ctaLink}
                                    className="rounded-2xl bg-primary px-10 py-4 text-base font-bold text-white shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                                >
                                    {product.ctaText}
                                </Link>
                                <Link href="#features" className="text-base font-bold leading-6 text-gray-900 hover:text-primary transition-colors flex items-center gap-2 group">
                                    Explore Features <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                        {/* Hero Visual */}
                        <div className="relative lg:mt-0 mt-12">
                            <div className="relative z-10 rounded-3xl bg-white/70 backdrop-blur-xl p-4 shadow-2xl border border-white/50 ring-1 ring-black/5">
                                <div className={`aspect-16/10 rounded-2xl bg-linear-to-br ${gradientClass} shadow-inner flex items-center justify-center overflow-hidden relative`}>
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-white z-10">
                                            <Icon size={100} strokeWidth={1} className="animate-pulse" />
                                            <span className="text-xs font-mono tracking-widest text-white/80 uppercase">{product.name} Platform</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            {product.features.length > 0 && (
                <section id="features" className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest">Key Features</h2>
                            <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                                What {product.name} Offers
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {product.features.map((feature, i) => (
                                <div key={i} className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-white py-24 sm:py-32 overflow-hidden relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="rounded-3xl bg-gray-50 px-10 py-20 sm:p-24 lg:flex lg:items-center lg:gap-20 border border-gray-100 shadow-inner relative overflow-hidden">
                        <div className="relative z-10 lg:w-1/2">
                            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                                Ready to Get Started <br/>
                                <span className={`bg-linear-to-r ${gradientClass} bg-clip-text text-transparent`}>with {product.name}?</span>
                            </h2>
                            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                Contact our team to learn how {product.name} can help your business grow.
                            </p>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link href={product.ctaLink} className="rounded-2xl bg-primary px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
                                    {product.ctaText}
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary opacity-[0.03] skew-x-12 translate-x-20" />
                    </div>
                </div>
            </section>
        </div>
    )
}
