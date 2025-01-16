'use client';

import { register } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await register(formData);
    
    if (result?.error) {
      setError(result.error);
    } else if (result?.redirect) {
      // Use router.push for client-side navigation
      router.push(result.redirect);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form action={handleSubmit} className="bg-base-100 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-base-content">Register</h1>
        
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-base-content/80 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-base-content/80 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-base-content/80 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-base-content/80 mb-1">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              placeholder="Confirm your password"
              required
              className="input input-bordered w-full bg-base-200 focus:bg-base-100 transition-colors"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}