"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock, Search, TrendingUp, Sparkles } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import SafeImage from "@/components/ui/SafeImage"
import { cn } from "@/lib/utils"

// Types
interface Article {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string | null
    category: string
    imageUrl: string | null
    authorName: string
    authorImage: string | null
    authorRole: string | null
    readTime: string
    isFeatured: boolean
    isTrending: boolean
    status: string
    createdAt: string
    updatedAt: string
}

interface ArticlesPageClientProps {
    articles: Article[]
    categories: string[]
    featuredArticle: Article | null
    trendingArticles: Article[]
    latestArticles: Article[]
}

// Default placeholder image
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"

// Helper to validate and get image URL
const getValidImageUrl = (url: string | null): string => {
    if (!url) return DEFAULT_IMAGE
    // Check if URL starts with /, http://, or https://
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    return DEFAULT_IMAGE
}

export default function ArticlesPageClient({
    articles,
    categories,
    featuredArticle,
    trendingArticles,
    latestArticles
}: ArticlesPageClientProps) {
    const [activeCategory, setActiveCategory] = React.useState("All")
    const [searchQuery, setSearchQuery] = React.useState("")

    // Filter articles by category and search
    const filteredArticles = React.useMemo(() => {
        let filtered = latestArticles
        if (activeCategory !== "All") {
            filtered = filtered.filter(a => a.category === activeCategory)
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query) ||
                (a.excerpt && a.excerpt.toLowerCase().includes(query))
            )
        }
        return filtered
    }, [latestArticles, activeCategory, searchQuery])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <main className="min-h-screen pt-24 pb-20 bg-background relative selection:bg-primary/20 selection:text-primary">
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />

            <Section className="pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5">
                                <Sparkles className="w-3 h-3 mr-2" />
                                Our Thoughts & Insights
                            </Badge>
                        </motion.div>
                        <Heading variant="h1" className="text-5xl md:text-7xl mb-4">
                            The <span className="text-primary italic font-serif">Journal.</span>
                        </Heading>
                        <Text className="text-xl text-muted-foreground max-w-lg">
                            Deep dives into technology, design, and the future of digital products.
                        </Text>
                    </div>

                    <div className="w-full md:w-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 w-full md:w-80 h-12 rounded-full bg-muted/30 border-border/50 focus:bg-background transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Featured Article (Hero Card) */}
                {featuredArticle && (
                    <Link href={`/articles/${featuredArticle.slug}`} className="block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative group rounded-3xl overflow-hidden aspect-video md:aspect-21/9 mb-16 cursor-pointer border border-border/50 shadow-2xl shadow-primary/5"
                        >
                            <SafeImage
                                src={getValidImageUrl(featuredArticle.imageUrl)}
                                alt={featuredArticle.title}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 1200px"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge className="bg-primary hover:bg-primary text-white border-none">{featuredArticle.category}</Badge>
                                    <span className="flex items-center text-sm font-medium text-white/80">
                                        <Clock className="w-3.5 h-3.5 mr-1" /> {featuredArticle.readTime}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-lg text-white/80 line-clamp-2 mb-6 hidden md:block">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden relative bg-white/20">
                                        {featuredArticle.authorImage ? (
                                            <SafeImage src={featuredArticle.authorImage} alt={featuredArticle.authorName} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                                {featuredArticle.authorName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{featuredArticle.authorName}</p>
                                        <p className="text-xs text-white/60">{formatDate(featuredArticle.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                )}

                {/* Trending Row */}
                {trendingArticles.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-2 mb-6 text-muted-foreground uppercase tracking-widest text-xs font-bold">
                            <TrendingUp className="w-4 h-4 text-primary" /> Trending Now
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {trendingArticles.map((article, i) => (
                                <Link href={`/articles/${article.slug}`} key={article.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group cursor-pointer h-full"
                                    >
                                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 border border-border/50">
                                            <SafeImage
                                                src={getValidImageUrl(article.imageUrl)}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                            <Badge variant="secondary" className="absolute top-3 left-3 backdrop-blur-md bg-white/10 text-white border-white/20 hover:bg-white/20">
                                                {article.category}
                                            </Badge>
                                        </div>
                                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground">{article.readTime}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Feed */}
                <div className="space-y-8">
                    {/* Categories (Sticky Bar) */}
                    <div className="sticky top-20 z-20 bg-background/80 backdrop-blur-md py-4 mb-8 border-b border-border/50">
                        <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border shrink-0",
                                        activeCategory === cat
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                            : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-12">
                            <Text variant="muted">No articles found.</Text>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {filteredArticles.map((article, i) => (
                                <Link href={`/articles/${article.slug}`} key={article.id} className="block group">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        className="flex flex-col md:flex-row gap-6 items-start cursor-pointer hover:bg-muted/30 p-6 -m-6 rounded-3xl transition-colors border border-transparent hover:border-border/50"
                                    >
                                        <div className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0 relative border border-border/50">
                                            <SafeImage
                                                src={getValidImageUrl(article.imageUrl)}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 200px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wide">{article.category}</span>
                                                <span className="text-xs text-muted-foreground">• {formatDate(article.createdAt)}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center text-sm font-medium text-foreground group/link">
                                                Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="pt-12 text-center pointer-events-none opacity-50">
                        <p className="text-muted-foreground">End of the line (for now)</p>
                    </div>
                </div>
            </Section>
        </main>
    )
}
