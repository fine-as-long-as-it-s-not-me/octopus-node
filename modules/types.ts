export type GameStateType = "pending" | "keyword" | "drawing" | "discussion" | "voting" | "vote-result" | "guessing" | "result"

export interface Room {
  id: string;
  settings: Record<string, any>;
  players: Set<Player>;
  keywords: Map<string, number>;
}

export interface Game {
  id: string;
  roomId: string;
  state: GameStateType
  round: number;
  totalRounds: number;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}