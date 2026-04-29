import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from "next-auth/middleware"

export default async function middleware(req: NextRequest) {
    const host = req.headers.get('host') || ''
    const url = req.nextUrl.clone()

    // 1. Identify if it's Ukasir request
    // const isUkasir = host.includes('ukasir.id') || url.searchParams.get('site') === 'ukasir' || url.pathname.startsWith('/ukasir') || url.pathname.startsWith('/u-kasir')

    // if (isUkasir) {
    //     return NextResponse.redirect('http://localhost:3001/u-kasir')
    // }

    // 2. Handle Authentication for Dashboard
    if (url.pathname.startsWith('/dashboard')) {
        // next-auth/middleware handles the authorized check
        // but we need to call it as a function since we are in a custom middleware export
        const authResponse = await (withAuth as any)(req)
        if (authResponse) return authResponse
    }

    return NextResponse.next()
}

export const config = { 
    matcher: [
        "/dashboard/:path*",
        "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
    ] 
}
