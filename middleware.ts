import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/question/:id',
  '/tags',
  '/tags/:id',
  '/profile/:id',
  '/community',
  '/api/webhook'
]);

const isIgnoredRoute = createRouteMatcher([
  '/api/chatgpt'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request) && !isIgnoredRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Protect all API routes except explicitly ignored ones
    '/api/(auth|user|protected-route|trpc/.*)'
  ],
};