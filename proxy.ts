import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  eagerAuth: true,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/sign-in', '/sign-up', '/usecase', '/share', '/privacy', '/policy', '/api/og', '/trending', '/api/trending', '/onboarding', '/api/auth/workos-url'],
  },
  redirectUri:
    process.env.VERCEL_ENV === 'preview'
      ? `https://${process.env.VERCEL_BRANCH_URL}/callback`
      : process.env.VERCEL_ENV === 'production'
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callback`
        : undefined,
});

export const config = {
  matcher: [
    '/((?!_next|api/og|api/trending|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};
