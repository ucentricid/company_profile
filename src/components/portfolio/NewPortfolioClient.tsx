"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Image as ImageIcon, 
  Code2, 
  Calendar, 
  Tag, 
  ChevronDown,
  Globe,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import Swal from "sweetalert2"

// --- Types ---
type EditorBlock = {
  id: string
  type: "text" | "image" | "video" | "code" | "divider"
  content: string 
}

const CATEGORIES = [
  "Web Development", 
  "Mobile App", 
  "UI/UX Design", 
  "Internet of Things", 
  "Cybersecurity", 
  "Data Science", 
  "Cloud Computing"
]

export default function NewPortfolioClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
  // Form State
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [projectUrl, setProjectUrl] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  
  // Editor State
  const [blocks, setBlocks] = useState<EditorBlock[]>([{ id: "1", type: "text", content: "" }])
  
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Auto-Save to LocalStorage ---
  useEffect(() => {
    const saveDraft = () => {
      setIsSaving(true)
      const draftData = {
        title,
        description,
        category,
        blocks,
        tags,
        imageUrl,
        projectUrl,
        lastModified: new Date().toISOString()
      }
      localStorage.setItem("portfolio_new_draft", JSON.stringify(draftData))
      
      setTimeout(() => {
        setIsSaving(false)
        setLastSaved(new Date())
      }, 800)
    }

    const timeoutId = setTimeout(saveDraft, 2000)
    return () => clearTimeout(timeoutId)
  }, [title, description, category, blocks, tags, imageUrl, projectUrl])

  // Load Draft
  useEffect(() => {
    const savedDraft = localStorage.getItem("portfolio_new_draft")
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setTitle(parsed.title || "")
        setDescription(parsed.description || "")
        setCategory(parsed.category || "")
        setBlocks(parsed.blocks || [{ id: "1", type: "text", content: "" }])
        setTags(parsed.tags || [])
        setImageUrl(parsed.imageUrl || "")
        setProjectUrl(parsed.projectUrl || "")
      } catch (e) {
        console.error("Failed to load draft", e)
      }
    }
  }, [])

  // Prevent rendering if not logged in
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // --- Handlers ---
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const addBlock = (index: number, type: EditorBlock['type']) => {
    const newBlock: EditorBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: ""
    }
    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    setBlocks(newBlocks)
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id))
    }
  }

  const handleSubmit = async (portfolioStatus: "DRAFT" | "PENDING") => {
    if (!title) {
      Swal.fire({ icon: "error", title: "Oops...", text: "Judul Portofolio wajib diisi!" })
      return
    }

    setLoading(true)
    try {
      // Serialize content
      const serializedContent = JSON.stringify({
        blocks,
        tags,
        metadata: {
          category,
          updatedAt: new Date().toISOString()
        }
      })

      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          content: serializedContent,
          imageUrl,
          projectUrl,
          status: portfolioStatus 
        })
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.removeItem("portfolio_new_draft")
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: portfolioStatus === "DRAFT" ? "Tersimpan sebagai Draft." : "Berhasil disubmit untuk direview Admin.",
        }).then(() => {
          router.push(`/portfolio/${session?.user?.name}`)
        })
      } else {
        Swal.fire({ icon: "error", title: "Gagal Menyimpan", text: result.message || "Terjadi kesalahan server" })
      }
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: "error", title: "Error", text: "Gagal terhubung ke server" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-32 bg-background relative selection:bg-primary/20 selection:text-primary">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />

      <div className="container mx-auto px-4 mb-8 flex items-center justify-between">
        <Link 
          href={`/portfolio/${session?.user?.name}`} 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workspace
        </Link>
        
        <div className="flex gap-2">
           <Button variant="ghost" onClick={() => setIsPreview(!isPreview)} className="rounded-full">
              {isPreview ? "Edit Draft" : "Preview"}
           </Button>
           <Button 
            onClick={() => handleSubmit("PENDING")} 
            disabled={loading}
            className="rounded-full px-6 font-bold bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20"
           >
              {loading ? "Submitting..." : "Submit for Review"}
           </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {isPreview ? (
          /* --- PREVIEW MODE --- */
          <div className="animate-in fade-in duration-500">
            <header className="mb-12">
               <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">{title || "Untitled Project"}</h1>
               <p className="text-xl text-muted-foreground mb-8 leading-relaxed italic">{description}</p>
               
               <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-8">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {session?.user?.name?.[0]?.toUpperCase()}
                     </div>
                     <span className="font-medium text-foreground">{session?.user?.name}</span>
                  </div>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {category && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">{category}</Badge>
                    </>
                  )}
               </div>
            </header>

            {imageUrl && (
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-primary/5 border border-border/50">
                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-8 mb-16">
              {blocks.map(block => {
                if (block.type === 'text') return <p key={block.id} className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">{block.content}</p>
                if (block.type === 'image' && block.content) return <img key={block.id} src={block.content} alt="Content" className="w-full rounded-2xl shadow-sm border border-border/50" />
                if (block.type === 'divider') return <hr key={block.id} className="border-border my-12" />
                if (block.type === 'code' && block.content) return <pre key={block.id} className="bg-muted p-6 rounded-2xl overflow-x-auto font-mono text-sm border border-border/50"><code>{block.content}</code></pre>
                return null
              })}
            </div>

            {projectUrl && (
              <div className="mb-12">
                <Button asChild variant="outline" className="rounded-full gap-2">
                  <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4" /> View Live Project
                  </a>
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-8 border-t border-border">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="rounded-full px-4 py-1">#{tag}</Badge>
              ))}
            </div>
          </div>
        ) : (
          /* --- EDITOR MODE --- */
          <div className="animate-in fade-in duration-500 space-y-8">
            {/* Title & Description */}
            <div className="space-y-4">
              <textarea 
                placeholder="Project Title"
                className="w-full text-4xl md:text-6xl font-extrabold bg-transparent border-none placeholder:text-muted-foreground/20 focus:ring-0 px-0 resize-none overflow-hidden min-h-[1.2em]"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                rows={1}
              />
              <textarea 
                placeholder="Short description or sub-headline..."
                className="w-full text-xl md:text-2xl text-muted-foreground bg-transparent border-none placeholder:text-muted-foreground/30 focus:ring-0 px-0 resize-none overflow-hidden min-h-[1.5em] italic"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                rows={1}
              />
            </div>

            {/* Metadata Controls */}
            <div className="flex flex-wrap items-center gap-4 text-sm relative z-30">
               <CategoryDropdown value={category} onChange={setCategory} />
               
               <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
               </div>

               <div className="flex items-center gap-2 flex-grow">
                 <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                 <Input 
                   placeholder="External Project Link (Figma, GitHub, etc.)" 
                   value={projectUrl} 
                   onChange={(e) => setProjectUrl(e.target.value)}
                   className="border-none bg-transparent focus:ring-0 h-8 text-sm p-0 w-full"
                 />
               </div>
            </div>

            {/* Cover Image Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Cover Image</label>
              <div className="group relative w-full h-48 md:h-64 rounded-3xl border-2 border-dashed border-border hover:border-primary/50 transition-all bg-muted/5 flex flex-col items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => setImageUrl("")} className="rounded-full gap-2">
                        <X className="w-4 h-4" /> Change Image
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Input 
                      placeholder="Paste Image URL here..." 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="max-w-xs bg-background/50 border-none rounded-xl text-center text-sm"
                    />
                    <p className="text-xs text-muted-foreground">Or provide a link to your cover photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Block Editor */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Content Story</label>
               <div className="relative min-h-[400px] pb-20">
                  {blocks.map((block, index) => (
                    <div key={block.id} className="group relative pl-0 transition-all mb-4">
                       {block.type === 'text' && (
                         <textarea 
                            className="w-full bg-transparent text-lg leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/20 font-serif overflow-hidden min-h-[1.5em]"
                            placeholder="Tell your story..."
                            value={block.content}
                            onChange={(e) => {
                               updateBlock(block.id, e.target.value)
                               e.target.style.height = 'auto'
                               e.target.style.height = e.target.scrollHeight + 'px'
                            }}
                            onKeyDown={(e) => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                                  addBlock(index, 'text')
                               }
                               if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
                                  e.preventDefault()
                                  deleteBlock(block.id)
                               }
                            }}
                            autoFocus={index === blocks.length - 1 && blocks.length > 1}
                         />
                       )}

                       {block.type === 'image' && (
                          <div className="relative rounded-2xl border border-border bg-muted/5 min-h-[100px] flex items-center justify-center p-4">
                             {block.content ? (
                                <div className="relative group/img w-full">
                                  <img src={block.content} alt="Content" className="max-w-full rounded-xl mx-auto" />
                                  <div className="absolute top-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <Button variant="destructive" size="icon" onClick={() => updateBlock(block.id, "")} className="h-8 w-8 rounded-full">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                             ) : (
                                <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                                   <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                   <Input 
                                      placeholder="Paste Image URL..." 
                                      className="h-10 rounded-xl bg-background"
                                      onChange={(e) => updateBlock(block.id, e.target.value)}
                                   />
                                </div>
                             )}
                          </div>
                       )}

                       {block.type === 'divider' && (
                          <div className="flex items-center justify-center py-6 opacity-40 group-hover:opacity-100 transition-opacity">
                             <div className="h-px bg-border w-24" />
                             <div className="h-1 w-1 rounded-full bg-border mx-4" />
                             <div className="h-px bg-border w-24" />
                          </div>
                       )}

                       {block.type === 'code' && (
                          <div className="relative">
                             <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
                                <Badge variant="secondary" className="opacity-50 text-[10px] font-mono">CODE</Badge>
                             </div>
                             <textarea 
                                className="w-full bg-muted/50 p-6 rounded-2xl font-mono text-sm leading-relaxed resize-none focus:outline-none border border-transparent focus:border-primary/30"
                                placeholder="// Write code or details..."
                                value={block.content}
                                onChange={(e) => {
                                  updateBlock(block.id, e.target.value)
                                  e.target.style.height = 'auto'
                                  e.target.style.height = e.target.scrollHeight + 'px'
                                }}
                             />
                          </div>
                       )}

                       {/* Block Utility Buttons */}
                       <div className="absolute -right-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5" 
                            onClick={() => deleteBlock(block.id)}
                          >
                             <X className="w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  ))}

                  {/* Add Block Toolbar */}
                  <div className="mt-12 p-6 rounded-3xl border border-dashed border-border flex flex-col items-center gap-4 text-center bg-muted/5">
                     <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Content Block</span>
                     <div className="flex flex-wrap justify-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => addBlock(blocks.length - 1, 'text')} className="rounded-full gap-2 hover:border-primary hover:text-primary transition-all">
                           <FileText className="w-4 h-4" /> Text
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addBlock(blocks.length - 1, 'image')} className="rounded-full gap-2 hover:border-primary hover:text-primary transition-all">
                           <ImageIcon className="w-4 h-4" /> Image
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addBlock(blocks.length - 1, 'code')} className="rounded-full gap-2 hover:border-primary hover:text-primary transition-all">
                           <Code2 className="w-4 h-4" /> Code
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addBlock(blocks.length - 1, 'divider')} className="rounded-full gap-2 hover:border-primary hover:text-primary transition-all">
                           <div className="w-4 h-px bg-current" /> Divider
                        </Button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tags Input */}
            <div className="space-y-3">
               <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tags</label>
               <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-border bg-muted/5">
                 {tags.map(tag => (
                   <Badge key={tag} className="gap-1 pl-3 bg-primary/10 text-primary hover:bg-primary/20 border-none transition-colors">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                   </Badge>
                 ))}
                 <input 
                   className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-sm h-8"
                   placeholder="Type and press Enter to add tags..."
                   value={currentTag}
                   onChange={(e) => setCurrentTag(e.target.value)}
                   onKeyDown={handleAddTag}
                 />
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-12 border-t border-border mt-12">
               <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleSubmit("DRAFT")}
                  disabled={loading}
                  className="w-full sm:w-auto rounded-full px-8"
               >
                  Save as Draft
               </Button>
               <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => {
                    if (confirm("Reset editor and clear draft?")) {
                      localStorage.removeItem("portfolio_new_draft")
                      window.location.reload()
                    }
                  }}
                  className="w-full sm:w-auto rounded-full text-muted-foreground hover:text-destructive"
               >
                  Clear Editor
               </Button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Status Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-md z-50 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-4">
             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Editor Active</span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">
             {isSaving ? (
               <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Saving draft...</span>
             ) : lastSaved ? (
               `Draft saved locally at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
             ) : (
               "Ready to share your story"
             )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// --- Subcomponents ---

const CategoryDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
     <div className="relative" ref={containerRef}>
        <button 
           onClick={() => setIsOpen(!isOpen)}
           className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-bold shadow-sm",
              value ? "border-primary/20 bg-primary/10 text-primary" : "border-border/50 bg-background text-muted-foreground hover:border-primary/50 hover:text-primary"
           )}
        >
           <Tag className="w-3.5 h-3.5" />
           <span>{value || "Select Category"}</span>
           <ChevronDown className={cn("w-3.5 h-3.5 transition-transform opacity-50", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
           {isOpen && (
              <motion.div 
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="absolute top-full left-0 mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[100] p-1.5"
              >
                 <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-2 mb-1">Categories</div>
                 {CATEGORIES.map(cat => (
                    <button
                       key={cat}
                       onClick={() => { onChange(cat); setIsOpen(false) }}
                       className={cn(
                          "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center justify-between group",
                          value === cat ? "text-primary bg-primary/10 font-bold" : "text-foreground hover:bg-muted"
                       )}
                    >
                       {cat}
                       {value === cat && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                 ))}
              </motion.div>
           )}
        </AnimatePresence>
     </div>
  )
}
