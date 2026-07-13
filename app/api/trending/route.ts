import { NextResponse } from 'next/server';

const T4TSA_API_URL = 'https://t4tsa.cc/svc/api/partner/trending';
const T4TSA_API_KEY = process.env.T4TSA_API_KEY || '';

let cachedData: { updated_at: string; results: unknown[] } | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 15 * 60 * 1000;

export async function GET() {
  if (!T4TSA_API_KEY) {
    return NextResponse.json(
      { error: 'T4TSA API key not configured' },
      { status: 500 }
    );
  }

  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedData);
  }

  try {
    const res = await fetch(T4TSA_API_URL, {
      headers: { 'X-API-Key': T4TSA_API_KEY },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `T4TSA API returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trending data' },
      { status: 502 }
    );
  }
}
