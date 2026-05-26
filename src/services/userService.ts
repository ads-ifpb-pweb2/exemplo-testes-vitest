import type { User } from "../types";

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://api.exemplo.com/users");
  if (!response.ok) {
    throw new Error("Falha ao buscar usuários");
  }
  return response.json() as Promise<User[]>;
}

export async function fetchUserById(id: string): Promise<User> {
  const response = await fetch(`https://api.exemplo.com/users/${id}`);
  if (!response.ok) {
    throw new Error("Usuário não encontrado");
  }
  return response.json() as Promise<User>;
}
