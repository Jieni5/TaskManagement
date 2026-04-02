import { NextRequest, NextResponse } from "next/server"

export const middleware = async(request: NextRequest) => {
    const token = request.cookies.get('session')?.value
    const { pathname } = request.nextUrl

    const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/issues')
    const isAuthPage = pathname === '/signin' || pathname === '/signup'

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/issues/:path*', '/signin', '/signup'],
}