import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

const SECRET_KEY = process.env.JWT_SECRET || '';  

if (!SECRET_KEY) {  
  console.error('JWT_SECRET is not defined in environment variables');  
} 

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('KOWEY-TOKEN-SWAP')?.value;
  const pathname = request.nextUrl.pathname;

  // Si no hay token y se quiere acceder a /home, redirige
  if (!token && pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si hay token, lo verificamos
  if (token) {
    try {
      // Verificar el token usando `jose`
      await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));

      // Si el token es válido, continúa
      return NextResponse.next();
    } catch (err) {
      // Si el token no es válido, redirige al login
      console.error('Token inválido', err);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Si el token es válido o no es necesario, deja pasar la petición
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}