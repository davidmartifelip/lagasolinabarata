import { NextResponse } from 'next/server';

const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

// We mark this API route as dynamic to avoid static caching at build time
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour to prevent hammering the public API
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from MITECO: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos de las gasolineras' },
      { status: 500 }
    );
  }
}
