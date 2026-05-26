// =============================================================
// Mock de componente filho
// Conceitos: vi.mock de módulo, mock de componente React com tipos
// =============================================================

// ── Mock do componente Button ────────────────────────────────
//
// Por que mockar um componente filho?
//  - Isolar o componente sendo testado (UserCard)
//  - Evitar que bugs no Button quebrem testes do UserCard
//  - Simplificar as assertions
//
// vi.mock() é elevado (hoisted) para o topo do arquivo pelo Vitest.
vi.mock("../../components/Button", () => ({
  Button: ({ children, onClick, variant }: { children: React.ReactNode; onClick?: () => void; variant?: string }) => (
    <button data-testid={`mock-btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  ),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { UserCard } from "../../components/UserCard";
import type { User } from "../../types";

// ── Dados de fixture ─────────────────────────────────────────
const mockUser: User = {
  id: "u1",
  name: "Ana Silva",
  bio: "Desenvolvedora frontend apaixonada por testes.",
  avatar: "https://example.com/avatar.jpg",
};

describe("<UserCard/>", () => {
  it("exibe as informações do usuário", () => {
    render(<UserCard user={mockUser} onFollow={vi.fn()} onMessage={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Ana Silva" })).toBeInTheDocument();
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /avatar de ana silva/i })).toHaveAttribute("src", mockUser.avatar);
  });

  it("exibe mensagem de fallback quando user é null", () => {
    render(<UserCard user={null} onFollow={vi.fn()} onMessage={vi.fn()} />);

    expect(screen.getByText("Usuário não encontrado.")).toBeInTheDocument();
  });

  it("chama onFollow com o ID correto ao clicar em Seguir", async () => {
    const onFollow = vi.fn();
    const user = userEvent.setup();

    render(<UserCard user={mockUser} onFollow={onFollow} onMessage={vi.fn()} />);

    await user.click(screen.getByTestId("mock-btn-primary"));

    expect(onFollow).toHaveBeenCalledWith("u1");
    expect(onFollow).toHaveBeenCalledTimes(1);
  });

  it("chama onMessage com o ID correto ao clicar em Mensagem", async () => {
    const onMessage = vi.fn();
    const user = userEvent.setup();

    render(<UserCard user={mockUser} onFollow={vi.fn()} onMessage={onMessage} />);

    await user.click(screen.getByTestId("mock-btn-secondary"));

    expect(onMessage).toHaveBeenCalledWith("u1");
  });
});
