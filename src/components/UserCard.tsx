import type { User } from "../types";
import { Button } from "./Button";

interface UserCardProps {
  user: User | null;
  onFollow: (id: string) => void;
  onMessage: (id: string) => void;
}

export function UserCard({ user, onFollow, onMessage }: Readonly<UserCardProps>) {
  if (!user) return <p>Usuário não encontrado.</p>;

  return (
    <article className="user-card">
      <img src={user.avatar} alt={`Avatar de ${user.name}`} />
      <h2>{user.name}</h2>
      <p className="user-bio">{user.bio}</p>
      <div className="user-actions">
        <Button onClick={() => onFollow(user.id)} variant="primary">
          Seguir
        </Button>
        <Button onClick={() => onMessage(user.id)} variant="secondary">
          Mensagem
        </Button>
      </div>
    </article>
  );
}
