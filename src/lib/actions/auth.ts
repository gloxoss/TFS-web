"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "../pocketbase/server";
import { ClientResponseError } from "pocketbase";

export async function register(formData: FormData) {
  const client = await createServerClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("passwordConfirm") as string;

  try {
    // Check if user with the same name exists
    const nameExists = await client.collection('users').getList(1, 1, {
      filter: `name = "${name}"`,
    });

    if (nameExists.totalItems > 0) {
      return { error: "This name is already taken" };
    }

    // Check if user with the same email exists
    const emailExists = await client.collection('users').getList(1, 1, {
      filter: `email = "${email}"`,
    });

    if (emailExists.totalItems > 0) {
      return { error: "This email is already registered" };
    }

    // Create new user
    await client
      .collection("users")
      .create({ name, email, password, passwordConfirm });
    
    // Log in the user after successful registration
    await client.collection("users").authWithPassword(email, password);
    
    revalidatePath("/");
    redirect("/dashboard");
  } catch (e) {
    console.error('Registration error:', e);
    if (e instanceof ClientResponseError) {
      const firstError = Object.values(e.data.data)[0];
      return { error: Array.isArray(firstError) ? firstError[0] : "Registration failed" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function login(formData: FormData) {
  const client = await createServerClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await client.collection("users").authWithPassword(email, password);
    revalidatePath("/");
    redirect("/dashboard");
  } catch (e) {
    console.error('Login error:', e);
    if (e instanceof ClientResponseError) {
      return { error: "Invalid email or password" };
    }
    return { error: "An unexpected error occurred" };
  }
}

export async function logout() {
  const client = await createServerClient();
  await client.authStore.clear();
  revalidatePath("/");
  redirect("/login");
}