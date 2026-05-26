import type { AuthUser, LoginCredentials } from "../types";

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await fetch("https://api.exemplo.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = (await response.json()) as { message?: string };
    throw new Error(data.message ?? "Erro ao fazer login");
  }

  return response.json() as Promise<AuthUser>;
}
