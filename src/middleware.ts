import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { protectedRoutes, authRoutes } from './lib/routes'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const path = request.nextUrl.pathname

  const isProtected = protectedRoutes.some(
    (route) =>
      route === path || (route === '/task/:path*' && path.startsWith('/task/')),
  )
  const isAuth = authRoutes.includes(path)

  if (!sessionCookie) {
    // If not signed in, allow access to auth routes, else redirect to signin for protected routes
    if (isAuth) {
      return NextResponse.next()
    } else if (isProtected) {
      return NextResponse.redirect(new URL('/signin', request.url))
    } else {
      return NextResponse.next()
    }
  } else {
    // If signed in, redirect auth pages to homepage
    if (isAuth) {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.next()
    }
  }
}

export const config = {
  matcher: ['/', '/task', '/task/:path*', '/signin', '/signup'], // Protect home, create, task pages; handle auth pages
}
