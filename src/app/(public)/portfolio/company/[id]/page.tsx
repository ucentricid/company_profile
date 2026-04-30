import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { db } from "@/lib/db"
import { ArrowLeft, Globe, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Heading, Text } from "@/components/ui/Typography"
import { Badge } from "@/components/ui/Badge"
import { Separator } from "@/components/ui/Separator"

interface CompanyProjectPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CompanyProjectPageProps): Promise<Metadata> {
    const { id } = await params
    const project = await db.companyProject.findUnique({
        where: { id }
    })

    if (!project) {
        return { title: "Project Not Found" }
    }

    return {
        title: `${project.title} | Ucentric Portfolio`,
        description: project.description.slice(0, 160)
    }
}

export default async function CompanyProjectPage({ params }: CompanyProjectPageProps) {
    const { id } = await params

    const project = await db.companyProject.findUnique({
        where: { id, isActive: true }
    })

    if (!project) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background pb-32">
            <article className="container mx-auto px-4 md:px-6 pt-32 md:pt-40 max-w-4xl">
                {/* Navigation */}
                <div className="mb-8">
                    <Link href="/portfolio">
                        <Button variant="outline" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-wider px-3 py-1">
                            Company Project
                        </Badge>
                        <span className="text-muted-foreground text-sm flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-2" />
                            {project.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>

                    <Heading variant="h1" className="mb-4">
                        {project.title}
                    </Heading>

                    <div className="flex items-center gap-2 text-muted-foreground mb-8">
                        <span className="font-medium">Client:</span>
                        <span>{project.client}</span>
                    </div>

                    {project.stats && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary font-bold text-sm">
                            {project.stats}
                        </div>
                    )}
                </header>

                {/* Cover Image */}
                {project.image ? (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-12 bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">{project.title.charAt(0)}</span>
                    </div>
                )}

                {/* Description */}
                <div className="prose prose-lg max-w-none mb-12">
                    <Text className="text-lg leading-relaxed whitespace-pre-wrap">
                        {project.description}
                    </Text>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Technologies</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="px-3 py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Separator className="my-12" />

                {/* Project Link */}
                {project.projectUrl && (
                    <div className="text-center">
                        <Button asChild size="lg" className="rounded-full px-8 gap-2">
                            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                <Globe className="w-5 h-5" /> Visit Live Project
                            </a>
                        </Button>
                    </div>
                )}
            </article>
        </main>
    )
}
