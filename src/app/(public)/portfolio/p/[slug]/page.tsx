"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Clock, Calendar, Globe, Share2, Facebook, Twitter, Linkedin, Bookmark, User } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Separator } from "@/components/ui/Separator"
import { useParams } from "next/navigation"

export default function PortfolioDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        // We might need to fetch by slug instead of ID if it's in the URL
        const res = await fetch(`/api/portfolio?slug=${slug}`)
        if (res.ok) {
           const data = await res.json()
           // For simplicity, assuming the first one is the winner if it returns an array
           setPost(Array.isArray(data) ? data[0] : data)
        }
      } catch (error) {
        console.error("Failed to fetch post:", error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchPost()
  }, [slug])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Heading variant="h2" className="mb-4">Project Not Found</Heading>
        <Link href="/portfolio">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Button>
        </Link>
      </div>
    )
  }

  // Parse content if it's JSON (block editor)
  let blocks = []
  try {
    const parsed = JSON.parse(post.content)
    blocks = parsed.blocks || []
  } catch (e) {
    // If not JSON, treat as plain text in a single block
    blocks = [{ id: "legacy", type: "text", content: post.content }]
  }

  return (
    <main className="min-h-screen bg-background pb-32 selection:bg-primary/20 selection:text-primary">
        
        {/* Progress Bar */}
        <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50 shadow-sm"
            style={{ scaleX }}
        />

        <article className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 max-w-4xl">
            
            {/* Navigation */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <Link href={`/portfolio/${post.User?.name}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all duration-300 border border-transparent hover:border-primary hover:text-primary hover:bg-primary/5 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Workspace
                </Link>
            </motion.div>

            {/* Header */}
            <motion.header 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-12"
            >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-wider px-3 py-1">
                        {post.category || "Project"}
                    </Badge>
                    <span className="text-muted-foreground text-sm flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-2" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.05]">
                    {post.title}
                </h1>
                
                {post.description && (
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light italic border-l-2 border-primary/20 pl-6 my-8">
                      {post.description}
                  </p>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border">
                    <Avatar className="w-12 h-12 border border-border shadow-sm">
                        <AvatarImage src={post.User?.image} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {post.User?.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-bold text-foreground text-lg">{post.User?.name}</div>
                        <div className="text-sm text-muted-foreground">Intern at Ucentric</div>
                    </div>
                </div>
            </motion.header>

            {/* Hero Image */}
            {post.imageUrl && (
              <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-2xl shadow-primary/5 relative border border-border/50"
              >
                  <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                  />
              </motion.div>
            )}

            {/* Block Content */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-10"
            >
                {blocks.map((block: any) => {
                  if (block.type === 'text') return (
                    <p key={block.id} className="text-lg md:text-xl leading-relaxed text-foreground/80 whitespace-pre-wrap font-serif">
                      {block.content}
                    </p>
                  )
                  if (block.type === 'image' && block.content) return (
                    <figure key={block.id} className="my-12">
                      <img src={block.content} alt="Project detail" className="w-full rounded-2xl shadow-xl border border-border/50" />
                    </figure>
                  )
                  if (block.type === 'divider') return (
                    <div key={block.id} className="flex justify-center py-12">
                      <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>
                  )
                  if (block.type === 'code' && block.content) return (
                    <pre key={block.id} className="bg-muted p-8 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-border/50 shadow-inner">
                      <code>{block.content}</code>
                    </pre>
                  )
                  return null
                })}
            </motion.div>

            {/* Project Link */}
            {post.projectUrl && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 text-center"
              >
                <div className="inline-flex flex-col items-center p-8 rounded-3xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                  <Text className="mb-4 font-bold text-muted-foreground uppercase tracking-widest text-xs">Want to see more?</Text>
                  <Button asChild className="rounded-full px-8 h-12 gap-2 shadow-lg shadow-primary/20">
                    <a href={post.projectUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5" /> Visit Live Project / Deck
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}

            <Separator className="my-20" />
            
        </article>

        {/* Footer Stats/Share */}
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="flex justify-between items-center">
              <div className="flex gap-4">
                 <Button variant="ghost" size="icon" className="rounded-full hover:text-primary"><Share2 className="w-5 h-5" /></Button>
                 <Button variant="ghost" size="icon" className="rounded-full hover:text-primary"><Bookmark className="w-5 h-5" /></Button>
              </div>
              <Link href="/portfolio">
                <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-primary">
                  Explore other projects <ArrowLeft className="w-4 h-4 rotate-180 ml-2" />
                </Button>
              </Link>
           </div>
        </div>
    </main>
  )
}
