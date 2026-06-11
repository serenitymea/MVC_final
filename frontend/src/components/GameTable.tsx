import { Game, AuthUser } from "../types";
import GameRow from "./GameRow";

interface Props {
  games: Game[];
  user: AuthUser | null;
  onUpdate: (g: Game) => void;
  onDelete: (id: number) => void;
}

export default function GameTable({ games, user, onUpdate, onDelete }: Props) {
  if (games.length === 0)
    return (
      <div style={s.empty}>
        No games recorded yet. Add the first one.
      </div>
    );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={s.table}>
        <thead>
          <tr style={s.headRow}>
            <th style={s.th}>Title</th>
            <th style={s.th}>Genre</th>
            <th style={{ ...s.th, width: 160 }}>Rating</th>
            <th style={{ ...s.th, width: 80 }}>Done</th>
            <th style={{ ...s.th, width: 48 }} />
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <GameRow key={g.id} game={g} user={user} onChange={onUpdate} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  empty: {
    padding: "3rem", textAlign: "center", color: "var(--muted)",
    fontSize: "0.88rem", letterSpacing: "0.04em",
    border: "1px dashed var(--border)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  headRow: { borderBottom: "2px solid var(--ink)" },
  th: {
    padding: "0.55rem 1rem", textAlign: "left",
    fontSize: "0.67rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "var(--muted)", fontWeight: 600,
  },
};
