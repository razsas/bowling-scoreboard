export const GAME_CONSTANTS = {
  MAX_PINS: 10,
  MAX_FRAMES: 10,
  LAST_FRAME_INDEX: 9,
  MIN_PINS: 0,
  ROLLS_PER_REGULAR_FRAME: 2,
  MAX_ROLLS_LAST_FRAME: 3,
} as const;

export const ERROR_MESSAGES = {
  NO_ACTIVE_GAME: 'No active game. Please start a new game first.',
  GAME_COMPLETE: 'Game is already complete.',
  INVALID_PIN_COUNT: (min: number, max: number) => `Pins must be between ${min} and ${max}.`,
  INVALID_FRAME_SUM: (roll1: number, roll2: number, sum: number, max: number) => 
    `Invalid frame: ${roll1} + ${roll2} = ${sum} > ${max}`,
  FAILED_TO_START: 'Failed to start game. Please try again.',
  FAILED_TO_ROLL: 'Failed to add throw. Please try again.',
  FAILED_BOWLING_SERVICE: 'Failed to communicate with bowling service.',
  FAILED_LOAD_HIGHSCORES: 'Failed to load highscores',
} as const;

