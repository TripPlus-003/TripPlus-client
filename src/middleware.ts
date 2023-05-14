import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const paths = ['/login', '/signup'];
  const userToken = request.cookies.get('next-auth.session-token')?.value;
  if (!!userToken && paths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export { default } from 'next-auth/middleware';
export const config = {
  matcher: ['/login', '/signup']
};
