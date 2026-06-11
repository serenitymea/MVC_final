export interface Game {
  id: number;
  title: string;
  genre: string;
  rating: number;
  completed: boolean;
  owner: string;
}

export interface AuthUser {
  username: string;
  role: string;
  token: string;
}
