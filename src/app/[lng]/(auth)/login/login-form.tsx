'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { login } from '@/lib/actions/session';
import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  lng: string;
}

export default function LoginForm({ lng }: LoginFormProps) {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || `/${lng}/dashboard`;
  const [state, formAction] = useActionState(login, { error: undefined });

  return (
    <div className="max-w-md mx-auto">
      <form action={formAction} className="bg-base-100 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-base-content">
          {t('auth.login')}
        </h1>

        {state?.error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
            {state.error}
          </div>
        )}

        {/* Hidden redirect URL */}
        <input type="hidden" name="redirect" value={redirectUrl} />

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
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={false} // useFormState handles pending state
          >
            {t('auth.login')}
          </button>
        </div>
      </form>
    </div>
  );
}