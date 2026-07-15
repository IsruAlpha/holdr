import { NextRequest, NextResponse } from 'next/server';
import { getSignInUrl, getSignUpUrl } from '@workos-inc/authkit-nextjs';

const NATIVE_REDIRECT_URI = 'space.linkroot.holdr://auth-callback';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'sign-in';
  const isNative = request.nextUrl.searchParams.get('native') === 'true';

  const redirectUri = isNative ? NATIVE_REDIRECT_URI : undefined;

  try {
    let url: string;
    if (type === 'sign-up') {
      url = await getSignUpUrl({ returnTo: '/dashboard', redirectUri });
    } else {
      url = await getSignInUrl({ returnTo: '/dashboard', redirectUri });
    }
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to generate WorkOS URL:', error);
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 });
  }
}
