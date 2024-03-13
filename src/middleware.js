import { NextRequest, NextResponse } from 'next/server'
export function middleware(request) {
    const path = request.nextUrl.pathname

    const publicPath = path === '/login' || path === '/signup'

    const token = request.cookies.get('token')?.value || ""


    if (publicPath && token) {
        return NextResponse.redirect(new URL('/profile', request.nextUrl))
    }
    if (!publicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/login', '/profile', '/signup'],
}