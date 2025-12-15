import { logout } from '@/lib/actions/session';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await logout();
}