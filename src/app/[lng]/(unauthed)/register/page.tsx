// app/(unauthed)/register/page.tsx
'use client';

import { register } from "@/lib/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NameInput from "@/components/name-input";
import { AlertCircle } from 'lucide-react';

export default function Register() {
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setErrors([]);
    const result = await register(formData);
    
    if (result?.errors) {
      setErrors(result.errors);
    } else if (result?.redirect) {
      router.push(result.redirect);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form action={handleSubmit} className="bg-base-100 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-base-content">Register</h1>
        
        {errors.length > 0 && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Registration failed:</span>
            </div>
            <ul className="list-disc ml-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <NameInput />
          
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