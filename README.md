# Exemplo de Testes com Vitest

Projeto de exemplo para a disciplina **Programação Web 2 (IFPB)**, demonstrando testes de componentes React com [Vitest](https://vitest.dev/) e [Testing Library](https://testing-library.com/).

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como bundler
- [Vitest](https://vitest.dev/) como test runner
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) para renderização e queries
- [jsdom](https://github.com/jsdom/jsdom) como ambiente de testes

## Estrutura do projeto

```
src/
├── components/
│   ├── Button.tsx        # Botão reutilizável com variantes (primary, secondary, danger)
│   ├── LoginForm.tsx     # Formulário de login com chamada à API
│   ├── UserCard.tsx      # Card de exibição de usuário
│   └── UserList.tsx      # Lista de usuários com fetch assíncrono
├── services/
│   ├── authService.ts    # Serviço de autenticação (login)
│   └── userService.ts    # Serviço de usuários (fetchUsers, fetchUserById)
├── types/
│   └── index.ts          # Tipos: User, AuthUser, LoginCredentials
└── __tests__/
    ├── basic/
    │   └── Button.test.tsx          # Testes básicos: render, queries, eventos
    └── mock-spy/
        ├── LoginForm.test.tsx       # Mock do fetch global com vi.spyOn
        ├── UserCard.test.tsx        # Mock de componente filho com vi.mock
        └── UserList.test.tsx        # Mock de módulo de serviço com vi.mock
```

## Instalação

```bash
npm install
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm test` | Executa os testes em modo watch |
| `npm run build` | Compila o projeto para produção |
| `npm run lint` | Executa o ESLint |
| `npm run preview` | Pré-visualiza o build de produção |

## Executando os testes

```bash
# Modo watch (reexecuta ao salvar arquivos)
npm test

# Execução única (sem watch)
npx vitest run

# Com relatório de cobertura
npx vitest run --coverage
```

## Conceitos demonstrados nos testes

### `basic/Button.test.tsx` — Testes básicos de componente
- Renderização com `render()` e queries (`getByRole`, `getByText`)
- Simulação de eventos com `fireEvent`
- Verificação de atributos, classes CSS e acessibilidade (`aria-disabled`)

### `mock-spy/LoginForm.test.tsx` — Mock do `fetch` global
- Interceptação do `fetch` com `vi.spyOn(globalThis, 'fetch')`
- Simulação de respostas de sucesso e erro (`mockReturnValue`, `mockImplementation`)
- Interação assíncrona com `userEvent` e `waitFor`
- Verificação dos dados enviados na requisição (URL e corpo)

### `mock-spy/UserCard.test.tsx` — Mock de componente filho
- Substituição de dependências com `vi.mock()`
- Isolamento do componente testado em relação aos seus filhos
- Uso de `data-testid` em mocks para facilitar as assertions

### `mock-spy/UserList.test.tsx` — Mock de módulo de serviço
- Mock de módulo inteiro com `vi.mock()` + `vi.mocked()`
- Simulação de estados: carregando, sucesso, lista vazia e erro
- Queries assíncronas com `findBy*` e `waitFor`
- Garantia de número de chamadas com `toHaveBeenCalledTimes`
