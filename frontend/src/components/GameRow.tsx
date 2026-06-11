import { useState } from "react";
import { updateGame, deleteGame } from "../api";
import { Game, AuthUser } from "../types";

interface Props {
  game: Game;
  user: AuthUser | null;
  onChange: (g: Game) => void;
  onDelete: (id: number) => void;
}

export default function GameRow({ game, user, onChange, onDelete }: Props) {
  const [rating, setRating] = useState(game.rating);
  const [saving, setSaving] = useState(false);

  const canEdit = user && (user.role === "admin" || user.username === game.owner);

  async function save(patch: { rating: number; completed: boolean }) {
    if (!canEdit) return;
    setSaving(true);
    try {
      const updated = await updateGame(game.id, patch, user!.token);
      onChange(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!canEdit) return;
    await deleteGame(game.id, user!.token);
    onDelete(game.id);
  }

  const rowStyle: React.CSSProperties = {
    borderBottom: "1px solid var(--border)",
    opacity: game.completed ? 0.5 : 1,
    transition: "opacity 0.15s",
    background: saving ? "var(--surface)" : "transparent",
  };

  return (
    <tr style={rowStyle}>
      <td style={s.td}>
        <span style={s.title}>{game.title}</span>
        <span style={s.owner}>{game.owner}</span>
      </td>
      <td style={s.td}>
        <span style={s.genreTag}>{game.genre}</span>
      </td>
      <td style={s.td}>
        {canEdit ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range" min={1} max={10} value={rating}
              disabled={saving}
              onChange={(e) => setRating(Number(e.target.value))}
              onMouseUp={() => save({ rating, completed: game.completed })}
              onTouchEnd={() => save({ rating, completed: game.completed })}
              style={{ flex: 1 }}
            />
            <span style={s.ratingVal}>{rating}</span>
          </div>
        ) : (
          <span style={s.ratingVal}>{game.rating}<span style={{ color: "var(--muted)", fontWeight: 400 }}>/10</span></span>
        )}
      </td>
      <td style={s.td}>
        {canEdit ? (
          <input
            type="checkbox" checked={game.completed} disabled={saving}
            onChange={(e) => save({ rating: game.rating, completed: e.target.checked })}
            style={{ width: 16, height: 16, cursor: "pointer" }}
          />
        ) : (
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
            {game.completed ? "yes" : "no"}
          </span>
        )}
      </td>
      <td style={s.td}>
        {canEdit && (
          <button onClick={handleDelete} style={s.delBtn} title="Remove">
            &times;
          </button>
        )}
      </td>
    </tr>
  );
}

const s: Record<string, React.CSSProperties> = {
  td: { padding: "0.8rem 1rem", verticalAlign: "middle" },
  title: { display: "block", fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" },
  owner: {
    display: "block", fontSize: "0.7rem", color: "var(--muted)",
    fontFamily: "var(--mono)", marginTop: 2,
  },
  genreTag: {
    fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase",
    color: "var(--accent)", borderBottom: "1px solid var(--accent)",
    paddingBottom: 1,
  },
  ratingVal: {
    fontFamily: "var(--mono)", fontWeight: 600, fontSize: "0.9rem",
    color: "var(--ink)", minWidth: 24,
  },
  delBtn: {
    background: "none", border: "1px solid transparent",
    color: "var(--muted)", cursor: "pointer",
    fontSize: "1.1rem", lineHeight: 1, padding: "2px 6px",
    transition: "color 0.1s, border-color 0.1s",
  },
};
