//==========================================================
// Testes básicos de componente
// Conceitos: render, queries, eventos, assertions
// =========================================================

import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../components/Button";

describe("<Button />", () => {
  it("renderiza o texto dos filhos", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("chama onClick ao ser clicado", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("não chama onClick quando está desabilitado", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Disabled" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("aplica a classe correta do variant", () => {
    render(<Button variant="danger">Danger</Button>);
    const btn = screen.getByRole("button", { name: "Danger" });
    expect(btn).toHaveClass("btn--danger");
  });

  it("usa variant primário por padrão", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button", { name: "Primary" });
    expect(btn).toHaveClass("btn--primary");
  });

  it("define aria-disabled quando desabilitado", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });
});
