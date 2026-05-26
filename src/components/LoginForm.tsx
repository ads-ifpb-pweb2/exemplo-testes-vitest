import { useState } from "react";
import { login } from "../services/authService";
import type { AuthUser } from "../types";

interface LoginFormProps {
  onSuccess: (user: AuthUser) => void;
}

export function LoginForm({ onSuccess }: Readonly<LoginFormProps>) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const user = await login({ email, password });
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de login">
      <div>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="password">Senha</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
