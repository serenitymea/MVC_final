import { useState } from "react";
import { fetchGames } from "./api";
import { Game, AuthUser } from "./types";
import GameTable from "./components/GameTable";
import GameForm from "./components/GameForm";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  async function handleAuth(u: AuthUser) {
    setUser(u);
    setShowAuth(false);
    setGames(await fetchGames(u.token));
  }

  function handleSignOut() {
    setUser(null);
    setGames([]);
  }

  const avgRating = games.length
    ? (games.reduce((a, g) => a + g.rating, 0) / games.length).toFixed(1)
    : "—";

  return (
    <div style={s.page}>
      {showAuth && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      <header style={s.header}>
        <div style={s.logoBlock}>
          <div style={s.logoRule} />
          <div>
            <div style={s.logoTitle}>Game Tracker</div>
            <div style={s.logoSub}>personal collection log</div>
          </div>
        </div>
        <nav style={s.nav}>
          {user ? (
            <>
              <span style={s.navUser}>{user.username}</span>
              <button style={s.navBtn} onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <button style={s.navBtnPrimary} onClick={() => setShowAuth(true)}>
              Sign in
            </button>
          )}
        </nav>
      </header>

      <main style={s.main}>
        {!user && (
          <div style={s.notice}>
            Viewing as guest.{" "}
            <button style={s.noticeLink} onClick={() => setShowAuth(true)}>
              Sign in or register
            </button>{" "}
            to add and edit games.
          </div>
        )}

        <div style={s.statsRow}>
          <Stat value={games.length} label="games" />
          <div style={s.statDivider} />
          <Stat value={games.filter((g) => g.completed).length} label="completed" />
          <div style={s.statDivider} />
          <Stat value={avgRating} label="avg rating" mono />
        </div>

        {user && (
          <GameForm
            token={user.token}
            onAdded={(g) => setGames((prev) => [g, ...prev])}
          />
        )}

        <GameTable
          games={games}
          user={user}
          onUpdate={(updated) =>
            setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
          }
          onDelete={(id) => setGames((prev) => prev.filter((g) => g.id !== id))}
        />
      </main>

      <footer style={s.footer}>
        Game Tracker: MVC project
      </footer>
    </div>
  );
}

function Stat({ value, label, mono }: { value: number | string; label: string; mono?: boolean }) {
  return (
    <div style={{ textAlign: "center" as const, padding: "0 1.5rem" }}>
      <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: mono ? "var(--mono)" : "var(--sans)", color: "var(--ink)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--muted)", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "var(--paper)", display: "flex", flexDirection: "column" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.25rem 2.5rem",
    borderBottom: "2px solid var(--ink)",
    background: "var(--paper)",
    position: "sticky", top: 0, zIndex: 10,
  },
  logoBlock: { display: "flex", alignItems: "center", gap: "1rem" },
  logoRule: { width: 4, height: 40, background: "var(--accent)", flexShrink: 0 },
  logoTitle: { fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.01em" },
  logoSub: { fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 },
  nav: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { fontSize: "0.88rem", color: "var(--ink)", fontFamily: "var(--mono)" },
  navBtn: {
    background: "none", border: "1px solid var(--border)",
    color: "var(--muted)", cursor: "pointer", padding: "0.35rem 0.9rem",
    fontSize: "0.82rem", letterSpacing: "0.03em",
  },
  navBtnPrimary: {
    background: "var(--ink)", border: "none",
    color: "var(--paper)", cursor: "pointer", padding: "0.4rem 1.1rem",
    fontSize: "0.82rem", letterSpacing: "0.05em", fontWeight: 600,
  },
  main: { flex: 1, maxWidth: 1000, width: "100%", margin: "0 auto", padding: "2rem 2rem" },
  notice: {
    fontSize: "0.82rem", color: "var(--muted)",
    borderLeft: "3px solid var(--border)", paddingLeft: "0.75rem",
    marginBottom: "2rem",
  },
  noticeLink: {
    background: "none", border: "none", color: "var(--accent)",
    cursor: "pointer", padding: 0, fontWeight: 600, fontSize: "inherit",
    textDecoration: "underline",
  },
  statsRow: {
    display: "flex", alignItems: "center",
    borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
    padding: "1.25rem 0", marginBottom: "2rem",
  },
  statDivider: { width: 1, height: 36, background: "var(--border)" },
  footer: {
    borderTop: "1px solid var(--border)", padding: "1rem 2.5rem",
    fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
};
