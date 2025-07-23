import { NextResponse } from 'next/server';

export function middleware(request) {
  // Hanya proses permintaan yang menuju path /api/
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Buat respons baru dari respons yang masuk agar kita bisa memodifikasi header
    const response = NextResponse.next();

    // Set header CORS
    // Izinkan secara spesifik domain frontend Anda
    response.headers.set('Access-Control-Allow-Origin', 'https://snap.nzr.web.id'); 
    
    // Izinkan metode HTTP yang umum
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    // Izinkan header yang umum digunakan, termasuk 'Content-Type' dan 'Authorization'
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle Preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://snap.nzr.web.id',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return response;
  }

  // Lanjutkan ke permintaan lainnya jika bukan path /api/
  return NextResponse.next();
}

// Konfigurasi agar middleware hanya berjalan pada path API
export const config = {
  matcher: '/api/:path*',
}; 