import { useState } from "react";
import { login, register } from "../api";
import { AuthUser } from "../types";

interface Props {
  onAuth: (user: AuthUser) => void;
  onClose: () => void;
}

type Tab = "login" | "register";

export default function AuthModal({ onAuth, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = tab === "login"
        ? await login(username, password)
        : await register(username, password);
      onAuth({ username: data.username, role: data.role, token: data.access_token });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t: Tab) {
    setTab(t); setError(""); setUsername(""); setPassword("");
  }

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHeader}>
          <div style={s.modalRule} />
          <span style={s.modalTitle}>
            {tab === "login" ? "Sign in" : "Create account"}
          </span>
        </div>

        <div style={s.tabs}>
          <button style={tab === "login" ? s.tabOn : s.tabOff} onClick={() => switchTab("login")}>
            Sign in
          </button>
          <button style={tab === "register" ? s.tabOn : s.tabOff} onClick={() => switchTab("register")}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Username</label>
          <input
            style={s.input} value={username}
            minLength={tab === "register" ? 3 : 1}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus required
          />
          <label style={s.label}>Password</label>
          <input
            style={s.input} type="password" value={password}
            minLength={tab === "register" ? 4 : 1}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {tab === "register" && (
            <p style={s.hint}>Username min 3 chars, password min 4.</p>
          )}
          {error && <p style={s.error}>{error}</p>}

          <div style={s.actions}>
            <button type="submit" style={s.btnPrimary} disabled={loading}>
              {loading ? "..." : tab === "login" ? "Sign in" : "Create account"}
            </button>
            <button type="button" style={s.btnGhost} onClick={onClose}>
              Continue as guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(24,24,26,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  },
  modal: {
    background: "var(--paper)", border: "2px solid var(--ink)",
    padding: "2rem", width: 380,
    boxShadow: "6px 6px 0 var(--ink)",
  },
  modalHeader: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" },
  modalRule: { width: 4, height: 28, background: "var(--accent)", flexShrink: 0 },
  modalTitle: { fontSize: "1rem", fontWeight: 700, color: "var(--ink)" },
  tabs: {
    display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem",
  },
  tabOn: {
    flex: 1, padding: "0.5rem", background: "none", border: "none",
    borderBottom: "2px solid var(--accent)", marginBottom: -1,
    color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem",
    cursor: "pointer", letterSpacing: "0.04em",
  },
  tabOff: {
    flex: 1, padding: "0.5rem", background: "none", border: "none",
    borderBottom: "2px solid transparent", marginBottom: -1,
    color: "var(--muted)", fontWeight: 500, fontSize: "0.85rem",
    cursor: "pointer", letterSpacing: "0.04em",
  },
  label: { display: "block", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.3rem" },
  input: {
    display: "block", width: "100%", marginBottom: "1rem",
    padding: "0.6rem 0.75rem",
    border: "1px solid var(--border)", background: "var(--surface)",
    color: "var(--ink)", fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  hint: { fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.75rem" },
  error: { fontSize: "0.82rem", color: "var(--error)", marginBottom: "0.75rem" },
  actions: { display: "flex", gap: "0.5rem", marginTop: "0.5rem" },
  btnPrimary: {
    flex: 1, padding: "0.6rem",
    background: "var(--ink)", border: "none",
    color: "var(--paper)", fontWeight: 600, fontSize: "0.88rem",
    cursor: "pointer", letterSpacing: "0.04em",
  },
  btnGhost: {
    flex: 1, padding: "0.6rem",
    background: "none", border: "1px solid var(--border)",
    color: "var(--muted)", fontSize: "0.82rem",
    cursor: "pointer",
  },
};
