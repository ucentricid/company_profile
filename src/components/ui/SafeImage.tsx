"use client"

import Image from "next/image"
import { useState } from "react"

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"

interface SafeImageProps {
    src: string | null
    alt: string
    fill?: boolean
    priority?: boolean
    className?: string
    sizes?: string
    width?: number
    height?: number
}

// Validate URL before passing to Next/Image
function isValidUrl(url: string | null): url is string {
    if (!url) return false
    return url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')
}

export default function SafeImage({ 
    src, 
    alt, 
    fill, 
    priority, 
    className, 
    sizes,
    width,
    height 
}: SafeImageProps) {
    const [error, setError] = useState(false)

    // Use default if URL is invalid or error occurred
    const imageSrc: string = (!isValidUrl(src) || error) ? DEFAULT_IMAGE : src

    const handleError = () => {
        setError(true)
    }

    return (
        <Image
            src={imageSrc}
            alt={alt}
            className={className}
            onError={handleError}
            fill={fill}
            priority={priority}
            sizes={sizes}
            width={width}
            height={height}
        />
    )
}
