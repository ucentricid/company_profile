"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Bookmark } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Section } from "../../../components/ui/Section"
import { Heading } from "../../../components/ui/Typography"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/Avatar"
import { Separator } from "../../../components/ui/Separator"

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const article = {
    title: "The Future of Digital Transformation",
    subtitle: "How AI, automation, and edge computing are reshaping the enterprise landscape in 2025.",
    category: "Technology",
    readTime: "8 min read",
    date: "Feb 15, 2025",
    author: {
        name: "Alex Morgan",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    content: (
        <>
            <p className="lead text-2xl/relaxed text-muted-foreground font-light mb-10">
                In the rapidly evolving landscape of digital technology, businesses face a critical juncture. The convergence of Artificial Intelligence, cloud computing, and ubiquitous connectivity is not just changing how we work—it's redefining what's possible.
            </p>

            <h3>The Rise of Autonomous Enterprise</h3>
            <p>
                By 2025, we predict that over 60% of enterprise applications will utilize some form of autonomous operation. This isn't just about simple automation scripts; we're talking about self-healing systems, predictive maintenance, and AI-driven decision engines that operate in real-time.
            </p>

            <blockquote className="border-l-4 border-orange-500 pl-6 py-2 my-10 italic text-2xl font-serif text-foreground">
                "The real power of digital transformation lies not in the technology itself, but in the new business models it enables."
            </blockquote>

            <h3>Edge Computing: The New Frontier</h3>
            <p>
                As data volumes explode, processing everything in centralized clouds is becoming untenable due to latency and bandwidth constraints. Enter Edge Computing.
            </p>
             <ul className="list-disc pl-6 space-y-2 my-6 marker:text-orange-500">
                <li><strong>Reduced Latency:</strong> Critical for autonomous vehicles and real-time analytics.</li>
                <li><strong>Enhanced Privacy:</strong> Sensitive data stays local, reducing exposure risks.</li>
                <li><strong>Bandwidth Efficiency:</strong> Only processed insights are sent to the cloud, saving costs.</li>
            </ul>

            <div className="relative w-full aspect-video rounded-2xl my-10 shadow-lg overflow-hidden">
                <Image 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop" 
                    alt="Circuit Board" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                />
            </div>

            <h3>Human-Centric Design</h3>
            <p>
                Amidst this technological upheaval, the human element remains paramount. The most successful digital products will be those that use AI to enhance human capability, not replace it. User Experience (UX) design is pivoting from "easy to use" to "predictive and helpful."
            </p>

            <h3>Conclusion</h3>
            <p>
                The journey of digital transformation is continuous. It requires a culture of agility, a willingness to experiment, and a strategic partnership with technology.
            </p>
        </>
    )
  }

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
                        <Calendar className="w-3.5 h-3.5 mr-2" /> {article.date}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.1]">
                    {article.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    {article.subtitle}
                </p>

                {/* Author Block */}
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
                    <Avatar className="w-12 h-12 border border-border">
                        <AvatarImage src={article.author.image} />
                        <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-bold text-foreground">{article.author.name}</div>
                        <div className="text-sm text-muted-foreground">{article.author.role}</div>
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
                className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-black/5 relative"
            >
                <Image 
                    src={article.heroImage} 
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
                className="prose prose-lg md:prose-xl dark:prose-invert mx-auto 
                    prose-headings:font-bold prose-headings:tracking-tight 
                    prose-p:text-muted-foreground prose-p:leading-8
                    prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-2xl prose-img:shadow-lg
                    prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic"
            >
                {article.content}
            </motion.div>

            <Separator className="my-16" />
            
        </article>

        {/* 5. Footer / Read Next - Full Width Section */}
        <div className="border-t border-border mt-16 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6 py-24 max-w-7xl">
                <div className="flex items-center justify-between mb-12">
                     <Heading variant="h2" className="text-3xl md:text-4xl">More from <span className="text-orange-600">Ucentric</span></Heading>
                     <Link href="/articles">
                        <Button variant="ghost" className="hidden md:flex gap-2 rounded-full hover:bg-orange-500/10 hover:text-orange-600">View All Articles <ArrowLeft className="w-4 h-4 rotate-180" /></Button>
                     </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                        { title: "Scaling Node.js Applications", cat: "Engineering", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop" },
                        { title: "The State of UI Design 2025", cat: "Design", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" },
                        { title: "Building Resilient Teams", cat: "Culture", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop" }
                     ].map((item, i) => (
                        <Link href={`/articles`} key={i} className="group cursor-pointer">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-muted">
                                <Image 
                                    src={item.img} 
                                    alt={item.title} 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
                                <Badge className="absolute top-4 left-4 bg-white/90 text-foreground backdrop-blur-md shadow-sm hover:bg-white border-none text-xs font-bold px-3 py-1 z-20">
                                    {item.cat}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                    <span>Feb 10, 2025</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>5 min read</span>
                                </div>
                                <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors leading-tight">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                     ))}
                </div>
                
                <div className="mt-12 text-center md:hidden">
                    <Button variant="outline" className="w-full rounded-full">View All Articles</Button>
                </div>
            </div>
        </div>
    </main>
  )
}
