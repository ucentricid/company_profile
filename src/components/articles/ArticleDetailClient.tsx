"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import SafeImage from "@/components/ui/SafeImage"
import { Section } from "@/components/ui/Section"
import { Heading } from "@/components/ui/Typography"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"

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

interface ArticleDetailClientProps {
    article: Article
    relatedArticles: Article[]
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

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

// Simple markdown-like content renderer (fallback for old content)
function renderContent(content: string | null) {
    if (!content) return null
    
    // Check if content is HTML (from rich text editor)
    if (content.includes('<') && content.includes('>')) {
        // Render as HTML with safety wrapper
        return (
            <div 
                dangerouslySetInnerHTML={{ __html: content }}
                className="tiptap-content"
            />
        )
    }
    
    // Fallback: render as markdown-like content
    // Split content by double newlines for paragraphs
    const paragraphs = content.split(/\n\n+/)
    
    return paragraphs.map((para, index) => {
        const trimmed = para.trim()
        if (!trimmed) return null
        
        // Check for headers (## or ###)
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-2xl font-bold mt-10 mb-4 wrap-break-word">{trimmed.slice(4)}</h3>
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-3xl font-bold mt-12 mb-6 wrap-break-word">{trimmed.slice(3)}</h2>
        }
        
        // Check for blockquotes
        if (trimmed.startsWith('> ')) {
            return (
                <blockquote key={index} className="border-l-4 border-orange-500 pl-6 py-2 my-10 italic text-xl font-serif text-foreground bg-orange-500/5 rounded-r-xl wrap-break-word">
                    {trimmed.slice(2)}
                </blockquote>
            )
        }
        
        // Check for lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').filter(line => line.trim().match(/^[-*] /))
            return (
                <ul key={index} className="list-disc pl-6 space-y-2 my-6 marker:text-orange-500">
                    {items.map((item, i) => (
                        <li key={i} className="wrap-break-word">{item.replace(/^[-*] /, '')}</li>
                    ))}
                </ul>
            )
        }
        
        // Regular paragraph
        return <p key={index} className="text-muted-foreground leading-8 mb-6 wrap-break-word overflow-wrap-anywhere">{trimmed}</p>
    })
}

export default function ArticleDetailClient({ article, relatedArticles }: ArticleDetailClientProps) {
    const { scrollYProgress } = useScroll()
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

    return (
        <main className="min-h-screen bg-background pb-32 selection:bg-orange-500/20 selection:text-orange-600">
            
            {/* Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-orange-500 origin-left z-50"
                style={{ scaleX }}
            />

            <article className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 max-w-4xl">
                
                {/* 1. Navigation / Back Button */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link href="/articles" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all duration-300 border border-transparent hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 group">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Articles
                    </Link>
                </motion.div>

                {/* 2. Header Area */}
                <motion.header 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
                            {article.category}
                        </span>
                        <span className="text-muted-foreground text-sm flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-2" /> {article.readTime}
                        </span>
                        <span className="text-muted-foreground text-sm flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-2" /> {formatDate(article.createdAt)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                        {article.title}
                    </h1>
                    
                    {article.excerpt && (
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Author Block */}
                    <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
                        <Avatar className="w-12 h-12 border border-border">
                            {article.authorImage ? (
                                <AvatarImage src={article.authorImage} alt={article.authorName} />
                            ) : null}
                            <AvatarFallback>{article.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="font-bold text-foreground">{article.authorName}</div>
                            {article.authorRole && (
                                <div className="text-sm text-muted-foreground">{article.authorRole}</div>
                            )}
                        </div>
                        {/* Share Buttons (Desktop) */}
                        <div className="hidden sm:flex gap-2">
                             <Button variant="ghost" size="icon" className="hover:text-[#1877F2] hover:bg-[#1877F2]/10"><Facebook className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"><Twitter className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"><Linkedin className="w-4 h-4" /></Button>
                             <Button variant="ghost" size="icon" className="hover:text-orange-500 hover:bg-orange-500/10"><Share2 className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </motion.header>

                {/* 3. Hero Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-black/5 relative"
                >
                    <SafeImage 
                        src={getValidImageUrl(article.imageUrl)} 
                        alt={article.title} 
                        fill
                        priority
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                </motion.div>

                {/* 4. Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-lg md:prose-xl dark:prose-invert mx-auto max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight 
                        prose-p:text-muted-foreground prose-p:leading-8
                        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg
                        wrap-break-word overflow-wrap-anywhere"
                >
                    {renderContent(article.content)}
                </motion.div>

                <Separator className="my-16" />
                
            </article>

            {/* 5. Footer / Read Next - Full Width Section */}
            {relatedArticles.length > 0 && (
                <div className="border-t border-border mt-16 bg-muted/20">
                    <div className="container mx-auto px-4 md:px-6 py-24 max-w-7xl">
                        <div className="flex items-center justify-between mb-12">
                             <Heading variant="h2" className="text-3xl md:text-4xl">More from <span className="text-orange-600">Ucentric</span></Heading>
                             <Link href="/articles">
                                <Button variant="ghost" className="hidden md:flex gap-2 rounded-full hover:bg-orange-500/10 hover:text-orange-600">View All Articles <ArrowLeft className="w-4 h-4 rotate-180" /></Button>
                             </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {relatedArticles.map((item, i) => (
                                <Link href={`/articles/${item.slug}`} key={item.id} className="group cursor-pointer">
                                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-5 bg-muted">
                                        <SafeImage 
                                            src={getValidImageUrl(item.imageUrl)} 
                                            alt={item.title} 
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                        <Badge className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-md shadow-sm hover:bg-white border-none text-xs font-bold px-3 py-1 z-20">
                                            {item.category}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                            <span>{formatDate(item.createdAt)}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span>{item.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors leading-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                </Link>
                             ))}
                        </div>
                        
                        <div className="mt-12 text-center md:hidden">
                            <Link href="/articles">
                                <Button variant="outline" className="w-full rounded-full">View All Articles</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
