'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { User } from '@/types/auth';

interface AuthListenerProps {
  initialUser: User | null;
}

export default function AuthListener({ initialUser }: AuthListenerProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Sync the server-side user with the client store
    setUser(initialUser);
  }, [initialUser, setUser]);

  // This component doesn't render anything visible
  return null;
}