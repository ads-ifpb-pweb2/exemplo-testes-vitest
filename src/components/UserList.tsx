import { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";
import type { User } from "../types";
import { UserCard } from "./UserCard";

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p role="status">Carregando usuários...</p>;
  if (error) return <p role="alert">Erro: {error}</p>;
  if (users.length === 0) return <p>Nenhum usuário encontrado.</p>;

  return (
    <section>
      <h1>Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <UserCard
              user={user}
              onFollow={(id) => console.log("Seguindo:", id)}
              onMessage={(id) => console.log("Mensagem para:", id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
