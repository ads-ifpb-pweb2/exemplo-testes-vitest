// =============================================================
// Mock do fetch global + formulário com interação
// Conceitos: vi.spyOn(global, 'fetch'), tipos de Response,
//            mockImplementation, estados de submissão
// =============================================================
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "../../components/LoginForm";
import type { AuthUser } from "../../types";

// Helper tipado que cria uma resposta fetch falsa
function mockFetchResponse<T>(
  body: T,
  { ok = true, status = 200 }: { ok?: boolean; status?: number } = {},
): Promise<Response> {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("<LoginForm/>", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza os campos e o botão de submit", () => {
    render(<LoginForm onSuccess={vi.fn()} />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("chama onSuccess com os dados do usuário após login bem-sucedido", async () => {
    const fakeUser: AuthUser = { id: "1", name: "Ana", token: "abc123" };
    fetchSpy.mockReturnValue(mockFetchResponse(fakeUser));

    const onSuccess = vi.fn();
    const user = userEvent.setup();

    render(<LoginForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("E-mail"), "ana@email.com");
    await user.type(screen.getByLabelText("Senha"), "senha123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(fakeUser);
    });
  });

  it("verifica que o fetch foi chamado com os dados corretos", async () => {
    fetchSpy.mockReturnValue(mockFetchResponse<AuthUser>({ id: "1", name: "x", token: "xyz" }));

    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("E-mail"), "test@email.com");
    await user.type(screen.getByLabelText("Senha"), "pass123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    // Verifica URL e corpo da requisição com tipagem
    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.exemplo.com/auth/login");
    expect(JSON.parse(options.body as string)).toEqual({
      email: "test@email.com",
      password: "pass123",
    });
  });

  // ── Estado de submissão ───────────────────────────────────────

  it("desabilita o botão e mostra 'Entrando...' durante o submit", async () => {
    fetchSpy.mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("E-mail"), "a@a.com");
    await user.type(screen.getByLabelText("Senha"), "123456");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    const btn = screen.getByRole("button", { name: "Entrando..." });
    expect(btn).toBeDisabled();
  });

  // ── Erro de autenticação ──────────────────────────────────────

  it("exibe mensagem de erro quando as credenciais são inválidas", async () => {
    fetchSpy.mockReturnValue(mockFetchResponse({ message: "Credenciais inválidas" }, { ok: false, status: 401 }));

    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("E-mail"), "errado@email.com");
    await user.type(screen.getByLabelText("Senha"), "errada");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Credenciais inválidas");
    });
  });

  it("reabilita o botão após um erro", async () => {
    fetchSpy.mockReturnValue(mockFetchResponse({ message: "Erro" }, { ok: false, status: 500 }));

    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    await user.type(screen.getByLabelText("E-mail"), "a@a.com");
    await user.type(screen.getByLabelText("Senha"), "123");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Entrar" })).toBeEnabled();
    });
  });
});
