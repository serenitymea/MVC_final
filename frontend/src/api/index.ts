const BASE = "/api";

function headers(token?: string, json = false): Record<string, string> {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: headers(undefined, true),
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function register(username: string, password: string) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: headers(undefined, true),
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Registration failed");
  }
  return res.json();
}

export async function fetchGames(token: string) {
  const res = await fetch(`${BASE}/games/`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error("Failed to load games");
  return res.json();
}

export async function createGame(
  data: { title: string; genre: string; rating: number },
  token: string
) {
  const res = await fetch(`${BASE}/games/`, {
    method: "POST",
    headers: headers(token, true),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

export async function updateGame(
  id: number,
  data: { rating: number; completed: boolean },
  token: string
) {
  const res = await fetch(`${BASE}/games/${id}`, {
    method: "PUT",
    headers: headers(token, true),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

export async function deleteGame(id: number, token: string) {
  const res = await fetch(`${BASE}/games/${id}`, {
    method: "DELETE",
    headers: headers(token),
  });
  if (!res.ok) throw new Error("Failed to delete");
}
