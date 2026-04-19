"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { Save, Loader2 } from "lucide-react"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState<Record<string, string>>({
        hero_title: "",
        hero_subtitle: "",
        about_title: "",
        about_description: "",
        career_title: "",
        career_description: ""
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/settings")
            const data = await res.json()
            if (data) {
                setSettings(prev => ({ ...prev, ...data }))
            }
        } catch (error) {
            console.error("Failed to load settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings })
            })

            if (!res.ok) throw new Error("Failed to save")
            
            // show success toast or handle it
            alert("Settings saved successfully!")
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Failed to save settings")
        } finally {
            setIsSaving(false)
        }
    }

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Site Settings</h1>
                <p className="text-slate-400 mt-2">Manage the static text content of your landing page.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                    <CardHeader>
                        <CardTitle className="text-xl">Hero Section</CardTitle>
                        <CardDescription className="text-slate-400">The main section at the top of the landing page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Title (Use &lt;br/&gt; for line breaks)</label>
                            <Input 
                                value={settings.hero_title || ""} 
                                onChange={(e) => handleChange("hero_title", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155]"
                                placeholder="Transforming Ideas into Digital Reality"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hero Subtitle</label>
                            <Textarea 
                                value={settings.hero_subtitle || ""} 
                                onChange={(e) => handleChange("hero_subtitle", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155] min-h-[100px]"
                                placeholder="We craft high-performance websites..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                    <CardHeader>
                        <CardTitle className="text-xl">About Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">About Title</label>
                            <Input 
                                value={settings.about_title || ""} 
                                onChange={(e) => handleChange("about_title", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155]"
                                placeholder="Who We Are"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">About Description</label>
                            <Textarea 
                                value={settings.about_description || ""} 
                                onChange={(e) => handleChange("about_description", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155] min-h-[120px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#1E293B] border-[#334155] text-slate-100">
                    <CardHeader>
                        <CardTitle className="text-xl">Career CTA Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Career Title</label>
                            <Input 
                                value={settings.career_title || ""} 
                                onChange={(e) => handleChange("career_title", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Career Description</label>
                            <Textarea 
                                value={settings.career_description || ""} 
                                onChange={(e) => handleChange("career_description", e.target.value)} 
                                className="bg-[#0F172A] border-[#334155]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white">
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    )
}
