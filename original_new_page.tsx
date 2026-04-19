"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Upload, Plus, X, Image as ImageIcon, Code2, GripVertical, Trash2, Tag, Calendar, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Section } from "@/components/ui/Section"
import { Heading, Text } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
// import { label } from "framer-motion/client" // Removed unused import

// --- Types ---
type EditorBlock = {
  id: string
  type: "text" | "image" | "video" | "code" | "divider"
  content: string // Text content or Image URL (preview)
}

export default function NewProjectPage() {
  const [tags, setTags] = React.useState<string[]>([])
  const [currentTag, setCurrentTag] = React.useState("")
  const [isPreview, setIsPreview] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState("")
  
  // Editor State
  const [blocks, setBlocks] = React.useState<EditorBlock[]>([{ id: "1", type: "text", content: "" }])
  const [coverImage, setCoverImage] = React.useState<string | null>(null)
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // --- Auto-Save Logic ---
  React.useEffect(() => {
     const saveDraft = () => {
        setIsSaving(true)
        const draftData = {
           title,
           category,
           blocks,
           tags,
           coverImage,
           lastModified: new Date().toISOString()
        }
        localStorage.setItem("portfolio_draft", JSON.stringify(draftData))
        
        // Optimize: verify image blobs? For now storing base64/blob URLs might be temporary if session ends, 
        // but for a true persist we'd need base64. 
        // NOTE: Blob URLs (createObjectURL) expire on close. Real implementation needs Base64 or upload.
        // For this demo, we'll assume text persistence is key.
        
        setTimeout(() => {
           setIsSaving(false)
           setLastSaved(new Date())
        }, 800)
     }

     const timeoutId = setTimeout(saveDraft, 1000) // Debounce 1s
     return () => clearTimeout(timeoutId)
  }, [title, category, blocks, tags, coverImage])

  React.useEffect(() => {
     const savedCallback = localStorage.getItem("portfolio_draft")
     if (savedCallback) {
        try {
           const parsed = JSON.parse(savedCallback)
           setTitle(parsed.title || "")
           setCategory(parsed.category || "")
           setBlocks(parsed.blocks || [{ id: "1", type: "text", content: "" }])
           setTags(parsed.tags || [])
           // Cover image blob URLs usually won't persist across sessions properly unless base64. 
           // We'll skip restoring coverImage if it's a blob url from a closed session, 
           // but if user just refreshed it might work or we accept the limitation for now.
           // Ideally convert to base64.
        } catch (e) {
           console.error("Failed to load draft", e)
        }
     }
  }, [])

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

  // Cover Image
  const handleCoverClick = () => {
    fileInputRef.current?.click()
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCoverImage(url)
    }
  }

  // Block Actions
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

  const handleBlockImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (file) {
        const url = URL.createObjectURL(file)
        updateBlock(id, url)
     }
  }


  return (
    <main className="min-h-screen pt-24 pb-12 bg-background relative selection:bg-primary/20 selection:text-primary">
       
       <div className="container mx-auto px-4 mb-8 flex items-center justify-between">
        <Link 
          href="/portfolio" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="flex gap-2">
           <Button variant="ghost" onClick={() => setIsPreview(!isPreview)}>
              {isPreview ? "Edit Draft" : "Preview"}
           </Button>
           <Button className="rounded-full px-6 font-bold">
              Publish
           </Button>
        </div>
      </div>

      <div className="py-0 relative z-10 max-w-4xl mx-auto">
         {isPreview ? (
            // --- PREVIEW MODE (Visitor View) ---
            <div className="prose prose-lg dark:prose-invert mx-auto mt-10">
               <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{title || "Untitled Story"}</h1>
               <div className="flex items-center gap-4 text-muted-foreground text-sm mb-8 border-b border-border pb-8">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-primary/20" />
                     <span className="font-medium text-foreground">You (Intern)</span>
                  </div>
                  <span>·</span>
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  {category && (
                     <>
                        <span>·</span>
                        <Badge variant="secondary" className="rounded-md font-normal">{category}</Badge>
                     </>
                  )}
               </div>
               
               {/* Cover Image Preview */}
               {coverImage && <img src={coverImage} alt="Cover" className="w-full h-[400px] object-cover rounded-xl mb-8" />}

               {/* Render Blocks */}
               <div className="space-y-6">
                  {blocks.map(block => {
                     if (block.type === 'text') return <p key={block.id} className="whitespace-pre-wrap leading-relaxed text-foreground/90">{block.content}</p>
                     if (block.type === 'image' && block.content) return <img key={block.id} src={block.content} alt="Content" className="w-full rounded-xl shadow-sm" />
                     if (block.type === 'divider') return <hr key={block.id} className="border-border my-8" />
                     if (block.type === 'code') return <pre key={block.id} className="bg-muted p-4 rounded-lg overflow-x-auto"><code>{block.content}</code></pre>
                     return null
                  })}
               </div>

               <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                     {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                     ))}
                  </div>
               </div>
            </div>
         ) : (
            // --- EDITOR MODE (Writer View) ---
            <div className="space-y-4 animate-in fade-in duration-500 pb-32">
                {/* 1. Large Title Input */}
                <input 
                  type="text" 
                  placeholder="Title"
                  className="w-full text-5xl md:text-6xl font-extrabold bg-transparent border-none placeholder:text-muted-foreground/30 focus:ring-0 px-0"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                {/* Category & Date Metadata */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground relative z-30">
                   <CategoryDropdown value={category} onChange={setCategory} />

                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                   </div>
                </div>

                {/* 2. Clickable Cover Area */}
                <div 
                  onClick={handleCoverClick}
                  className="group relative w-full h-[300px] border-2 border-dashed border-border hover:border-primary/50 rounded-2xl flex flex-col items-center justify-center text-center transition-all bg-muted/5 hover:bg-muted/10 cursor-pointer overflow-hidden"
                >
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCoverChange} />
                   
                   {coverImage ? (
                      <>
                         <img src={coverImage} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">Click to Change Cover</div>
                      </>
                   ) : (
                      <>
                         <div className="p-4 rounded-full bg-background shadow-sm border border-border group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                         </div>
                         <p className="mt-4 text-sm font-medium text-muted-foreground">Add a cover image</p>
                      </>
                   )}
                </div>

                {/* 3. Block Editor Area */}
                <div className="relative min-h-[400px]">
                   {blocks.map((block, index) => (
                      <div key={block.id} className="group relative pl-4 pr-10 transition-all my-4">
                         
                         {/* Content Renderer */}
                         {block.type === 'text' && (
                            <textarea 
                              className="w-full bg-transparent text-lg leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/40 font-serif overflow-hidden min-h-[1.5em]"
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
                              autoFocus
                            />
                         )}
                         
                         {block.type === 'image' && (
                            <div className="relative rounded-xl border-2 border-dashed border-border bg-muted/5 min-h-[300px] flex items-center justify-center">
                               {block.content ? (
                                  <img src={block.content} alt="Uploaded" className="max-w-full rounded-lg" />
                               ) : (
                                  <div className="text-center p-8">
                                     <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                     <Input type="file" accept="image/*" className="max-w-xs mx-auto" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBlockImageUpload(block.id, e)} />
                                  </div>
                               )}
                            </div>
                         )}

                         {block.type === 'divider' && (
                            <div className="flex items-center justify-center py-8 group-hover:opacity-100 opacity-50">
                               <div className="h-px bg-border w-16" />
                               <div className="h-1 w-1 rounded-full bg-border mx-4" />
                               <div className="h-px bg-border w-16" />
                            </div>
                         )}

                         {block.type === 'code' && (
                            <div className="relative">
                               <textarea 
                                 className="w-full bg-muted/50 p-4 rounded-lg font-mono text-sm leading-relaxed resize-none focus:outline-none border border-transparent focus:border-primary/50"
                                 placeholder="// Write some code..."
                                 value={block.content}
                                 onChange={(e) => updateBlock(block.id, e.target.value)}
                               />
                            </div>
                         )}

                         {/* Delete Button (Right) */}
                         <div className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => deleteBlock(block.id)}>
                               <X className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>
                   ))}

                   {/* Add Block Toolbar (Bottom) */}
                   <div className="mt-8 pt-8 border-t border-dashed border-border flex flex-col items-center justify-center gap-4 text-center">
                      <span className="text-sm text-muted-foreground font-medium">Add a new block</span>
                      <div className="flex items-center gap-2">
                         <Button variant="outline" onClick={() => addBlock(blocks.length - 1, 'text')} className="gap-2 hover:bg-transparent hover:border-primary hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" /> Text
                         </Button>
                         <Button variant="outline" onClick={() => addBlock(blocks.length - 1, 'image')} className="gap-2 hover:bg-transparent hover:border-primary hover:text-primary transition-colors">
                            <ImageIcon className="w-4 h-4" /> Image
                         </Button>
                         <Button variant="outline" onClick={() => addBlock(blocks.length - 1, 'code')} className="gap-2 hover:bg-transparent hover:border-primary hover:text-primary transition-colors">
                            <Code2 className="w-4 h-4" /> Code
                         </Button>
                         <Button variant="outline" onClick={() => addBlock(blocks.length - 1, 'divider')} className="gap-2 hover:bg-transparent hover:border-primary hover:text-primary transition-colors">
                            <div className="w-4 h-px bg-current" /> Divider
                         </Button>
                      </div>
                   </div>
                </div>
                
                {/* Tags Footer */}
                <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur flex items-center justify-between z-50">
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">Tags:</span>
                      <Input 
                         className="h-8 w-40 bg-transparent border-none focus:ring-0"
                         placeholder="Add a tag..."
                         value={currentTag}
                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTag(e.target.value)}
                         onKeyDown={handleAddTag}
                       />
                       <div className="flex gap-2">
                        {tags.map(tag => (
                           <Badge key={tag} variant="outline" className="gap-1 pl-2">
                              {tag}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                           </Badge>
                        ))}
                       </div>
                   </div>
                   <span className="text-xs text-muted-foreground transition-colors duration-500">
                      {isSaving ? "Saving..." : lastSaved ? `Draft saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Local Storage Active"}
                   </span>
                </div>
            </div>
         )}
      </div>
    </main>
   )
}

const CATEGORIES = [
   "Web Development", "Mobile App", "UI/UX Design", "Internet of Things", "Cybersecurity", "Data Science", "Cloud Computing"
]

const CategoryDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
   const [isOpen, setIsOpen] = React.useState(false)

   return (
      <div className="relative">
         <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
               "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm font-medium",
               value ? "border-primary/20 bg-primary/5 text-primary" : "border-border/50 bg-muted/5 text-muted-foreground hover:bg-muted/10"
            )}
         >
            <Tag className="w-3.5 h-3.5" />
            <span>{value || "Select Category"}</span>
            <ChevronDown className={cn("w-3 h-3 transition-transform opacity-50", isOpen && "rotate-180")} />
         </button>

         <AnimatePresence>
            {isOpen && (
               <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50 py-1"
               >
                  {CATEGORIES.map(cat => (
                     <button
                        key={cat}
                        onClick={() => { onChange(cat); setIsOpen(false) }}
                        className={cn(
                           "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between group",
                           value === cat && "text-primary bg-primary/5 font-medium"
                        )}
                     >
                        {cat}
                        {value === cat && <motion.div layoutId="check" className="w-1.5 h-1.5 rounded-full bg-primary" />}
                     </button>
                  ))}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

function FormGroup({ label, type = "text", placeholder }: { label: string, type?: string, placeholder?: string }) {
   return (
      <div className="space-y-2">
         <label className="text-sm font-medium text-foreground ml-1">{label}</label>
         <Input 
            type={type} 
            placeholder={placeholder}
            className="h-12 rounded-xl bg-background/50 border-input focus:ring-primary/50"
         />
      </div>
   )
}
