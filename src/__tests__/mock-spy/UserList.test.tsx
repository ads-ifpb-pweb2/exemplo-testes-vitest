// =============================================================
// Mock de módulo de serviço (chamada de API)
// Conceitos: vi.mock de serviço, mockResolvedValue, mockRejectedValue,
//            waitFor, findBy* (queries assíncronas)
// =============================================================

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserList } from "../../components/UserList";
import type { User } from "../../types";

// Mockamos o módulo inteiro. O Vitest infere os tipos automaticamente.
vi.mock("../../services/userService", () => ({
  fetchUsers: vi.fn(),
}));

vi.mock("../../components/UserCard", () => ({
  UserCard: ({ user }: { user: User }) => <div data-testid="user-card">{user.name}</div>,
}));

import { fetchUsers } from "../../services/userService";

// Cast para o tipo de mock do Vitest — dá acesso a mockResolvedValue etc.
const mockFetchUsers = vi.mocked(fetchUsers);

const fakeUsers: User[] = [
  { id: "1", name: "Carlos Lima", bio: "Dev", avatar: "" },
  { id: "2", name: "Beatriz Melo", bio: "Designer", avatar: "" },
];

describe("UserList", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Estado de carregamento ────────────────────────────────────

  it("exibe indicador de carregamento enquanto busca", () => {
    mockFetchUsers.mockReturnValue(new Promise(() => {}));

    render(<UserList />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando usuários...");
  });

  // ── Sucesso ──────────────────────────────────────────────────

  it("exibe lista de usuários após carregar com sucesso", async () => {
    mockFetchUsers.mockResolvedValue(fakeUsers);

    render(<UserList />);

    // findBy* espera o elemento aparecer (query assíncrona com retry)
    const cards = await screen.findAllByTestId("user-card");

    expect(cards).toHaveLength(2);
    expect(screen.getByText("Carlos Lima")).toBeInTheDocument();
    expect(screen.getByText("Beatriz Melo")).toBeInTheDocument();
  });

  it("exibe mensagem quando a lista vem vazia", async () => {
    mockFetchUsers.mockResolvedValue([]);

    render(<UserList />);

    await screen.findByText("Nenhum usuário encontrado.");
  });

  // ── Erro ─────────────────────────────────────────────────────

  it("exibe mensagem de erro quando a API falha", async () => {
    mockFetchUsers.mockRejectedValue(new Error("Falha ao buscar usuários"));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Erro: Falha ao buscar usuários");
    });
  });

  // ── Garantia de chamada ───────────────────────────────────────

  it("chama fetchUsers exatamente uma vez na montagem", async () => {
    mockFetchUsers.mockResolvedValue(fakeUsers);

    render(<UserList />);
    await screen.findAllByTestId("user-card");

    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
  });
});
