// lib/actions/auth.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "../pocketbase/server";
import { ClientResponseError } from "pocketbase";

export async function login(formData: FormData) {
  const client = await createServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const authData = await client.collection("users").authWithPassword(email, password);
    console.log("Login successful:", authData); // Debug log
    
    // Force redirect instead of using Next.js redirect
    return { redirect: "/dashboard" };
  } catch (e) {
    console.error('Login error:', e);
    if (e instanceof ClientResponseError) {
      return { error: "Invalid email or password" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function register(formData: FormData) {
  const client = await createServerClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  try {
    const user = await client.collection("users").create({ 
      name, 
      email, 
      password, 
      passwordConfirm 
    });
    
    console.log("User created:", user); // Debug log
    
    // Login after registration
    const authData = await client.collection("users").authWithPassword(email, password);
    console.log("Auto-login successful:", authData); // Debug log

    // Force redirect instead of using Next.js redirect
    return { redirect: "/dashboard" };
  } catch (e) {
    console.error('Registration error:', e);
    if (e instanceof ClientResponseError) {
      const firstError = Object.values(e.data.data)[0];
      return { error: Array.isArray(firstError) ? firstError[0] : "Registration failed" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function logout() {
  const client = await createServerClient();
  await client.authStore.clear();
  await revalidatePath("/", "layout");
  redirect("/login");
}