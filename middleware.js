import { NextResponse } from 'next/server';

export function middleware(request) {
  const origin = request.headers.get('origin') || '';
  
  // Daftar origin yang diizinkan
  const allowedOrigins = [
    'https://snap.nzr.web.id',
    'http://localhost:3000',
    'http://localhost:1420'
  ];

  const isOriginAllowed = allowedOrigins.includes(origin);

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (isOriginAllowed) {
      preflightHeaders['Access-Control-Allow-Origin'] = origin;
    }
    return new NextResponse(null, { status: 204, headers: preflightHeaders });
  }

  // Handle actual requests
  const response = NextResponse.next();
  
  if (isOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  return response;
}

// Jalankan middleware hanya untuk route /api/*
export const config = {
  matcher: '/api/:path*',
};
