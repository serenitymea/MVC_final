import { useState } from "react";
import { createGame } from "../api";
import { Game } from "../types";

interface Props {
  token: string;
  onAdded: (game: Game) => void;
}

export default function GameForm({ token, onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState(5);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !genre.trim()) { setErr("Fill all fields"); return; }
    setErr("");
    try {
      const game = await createGame({ title, genre, rating }, token);
      onAdded(game);
      setTitle(""); setGenre(""); setRating(5);
    } catch {
      setErr("Failed to add game");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <div style={s.formLabel}>Add game</div>
      <div style={s.row}>
        <div style={s.field}>
          <label style={s.label}>Title</label>
          <input style={s.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div style={s.field}>
          <label style={s.label}>Genre</label>
          <input style={s.input} value={genre} onChange={(e) => setGenre(e.target.value)} required />
        </div>
        <div style={{ ...s.field, flex: "0 0 auto", minWidth: 140 }}>
          <label style={s.label}>
            Rating — <span style={{ fontFamily: "var(--mono)", fontWeight: 600 }}>{rating}</span>/10
          </label>
          <input
            type="range" min={1} max={10} value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ width: "100%", marginTop: 6 }}
          />
        </div>
        <button type="submit" style={s.btn}>Add</button>
      </div>
      {err && <p style={s.err}>{err}</p>}
    </form>
  );
}

const s: Record<string, React.CSSProperties> = {
  form: {
    border: "1px solid var(--border)",
    background: "var(--surface)",
    padding: "1.25rem 1.5rem",
    marginBottom: "1.5rem",
  },
  formLabel: {
    fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--muted)", marginBottom: "0.9rem", fontWeight: 600,
  },
  row: { display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-end" },
  field: { display: "flex", flexDirection: "column", flex: "1 1 140px" },
  label: {
    fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
    color: "var(--muted)", marginBottom: "0.3rem",
  },
  input: {
    padding: "0.5rem 0.65rem",
    border: "1px solid var(--border)", background: "var(--paper)",
    color: "var(--ink)", fontSize: "0.9rem", outline: "none",
  },
  btn: {
    padding: "0.5rem 1.4rem", alignSelf: "flex-end",
    background: "var(--ink)", border: "none",
    color: "var(--paper)", fontWeight: 600, fontSize: "0.85rem",
    cursor: "pointer", letterSpacing: "0.05em", whiteSpace: "nowrap",
    flexShrink: 0,
  },
  err: { color: "var(--error)", fontSize: "0.78rem", marginTop: "0.5rem" },
};
