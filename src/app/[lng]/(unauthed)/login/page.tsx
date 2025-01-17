'use client';

import { login } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from 'react-i18next';

interface AuthResponse {
  error?: string;
  redirect?: string;
}

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  
  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await login(formData) as AuthResponse;
    
    if (result?.error) {
      setError(t('auth.loginError'));
    } else if (result?.redirect) {
      // Add language prefix to the redirect path
      const lng = params.lng as string;
      router.push(`/${lng}${result.redirect}`);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form action={handleSubmit} className="bg-base-100 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-base-content">
          {t('auth.login')}
        </h1>
        
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-base-content/80 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder={t('auth.email')}
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-base-content/80 mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder={t('auth.password')}
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {t('auth.login')}
          </button>
        </div>
      </form>
    </div>
  )
}