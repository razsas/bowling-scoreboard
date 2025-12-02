export type RollNumber = 'roll1' | 'roll2' | 'roll3';

export interface Frame {
  id: number;
  gameId: number;
  frameIndex: number;
  roll1: number | null;
  roll2: number | null;
  roll3: number | null;
  score: number;
  isStrike: boolean;
  isSpare: boolean;
}

export interface HighscoreEntry {
  name: string;
  score: number;
  dateAchieved: string;
}

export interface Game {
  id: number;
  name: string;
  frames: Frame[];
  currentFrameNumber: number;
  isGameOver: boolean;
}

export interface RollInput {
  gameId: number;
  roll1?: number | null;
  roll2?: number | null;
  roll3?: number | null;
}

export interface RollResult {
  isSuccess: boolean;
  errorMessage?: string;
  state?: Game;
}

