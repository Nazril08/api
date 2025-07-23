import { NextResponse } from 'next/server';

export function middleware(request) {
  const allowedOrigins = [
    'https://snap.nzr.web.id',
    'http://localhost:3000',
  ];

  const origin = request.headers.get('origin');
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Cek apakah origin termasuk dalam daftar yang diizinkan
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle Preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return response;
  }

  return NextResponse.next();
}

// Jalankan middleware hanya untuk route /api/*
export const config = {
  matcher: '/api/:path*',
};
