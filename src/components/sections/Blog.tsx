"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"

const articles = [
  {
    title: "The Future of EdTech in Indonesia",
    excerpt: "How digital transformation is reshaping classrooms and administrative efficiency across the archipelago.",
    category: "Education",
    date: "Oct 12, 2025",
    readTime: "5 min read",
    image: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Optimizing Retail Operations with AI",
    excerpt: "Leveraging predictive analytics to reduce waste and improve inventory turnover in modern retail.",
    category: "Technology",
    date: "Sep 28, 2025",
    readTime: "4 min read",
    image: "bg-gradient-to-br from-orange-500/20 to-red-500/20"
  },
  {
    title: "Building Scalable Microservices",
    excerpt: "A deep dive into our architectural approach for handling millions of concurrent transactions.",
    category: "Engineering",
    date: "Sep 15, 2025",
    readTime: "7 min read",
    image: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
  }
]

export function Blog() {
  return (
    <Section id="blog" className="bg-background py-24 relative overflow-hidden">
       {/* Decorative Elements - Subtle and Clean */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
       
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center space-y-4">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
          >
             <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 text-primary px-3 py-1 text-sm font-medium mb-4 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                Latest Insights
             </div>
             <Heading variant="h2" className="mb-4">
                News & <span className="text-primary">Articles</span>
             </Heading>
             <Text variant="muted" className="max-w-2xl mx-auto text-lg">
                Stay ahead of the curve with our latest thoughts on technology and business.
             </Text>
          </motion.div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
                {/* Image Area */}
                <div className={`h-48 w-full ${article.image} relative overflow-hidden`}>
                   <div className="absolute top-4 left-4">
                      {/* Explicit Text Color for Badge */}
                      <Badge variant="secondary" className="bg-card/90 text-foreground backdrop-blur-sm shadow-sm font-medium">
                         {article.category}
                      </Badge>
                   </div>
                   {/* Overlay on hover */}
                   <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-6 flex-grow flex flex-col">
                   <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                         <Calendar className="w-3.5 h-3.5" />
                         {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                         <Clock className="w-3.5 h-3.5" />
                         {article.readTime}
                      </div>
                   </div>
                   
                   <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                   </h3>
                   <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {article.excerpt}
                   </p>
                </CardContent>

                <CardFooter className="p-6 pt-0 mt-auto">
                   <Button variant="link" className="p-0 h-auto text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 font-semibold group-hover:translate-x-1 transition-transform">
                      Read Article <ArrowRight className="w-4 h-4 ml-1" />
                   </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
           <Link href="/articles">
             <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                View All Articles
             </Button>
           </Link>
        </div>
      </div>
    </Section>
  )
}
