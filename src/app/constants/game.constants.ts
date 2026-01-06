export const GameConstants = {
  MaxPins: 10,
  MaxFrames: 10,
  LastFrameIndex: 9,
  MinPins: 0,
  RollsPerRegularFrame: 2,
  MaxRollsLastFrame: 3,
} as const;

export const ErrorMessages = {
  NoActiveGame: 'No active game. Please start a new game first.',
  GameComplete: 'Game is already complete.',
  InvalidPinCount: (min: number, max: number) =>
    `Pins must be between ${min} and ${max}.`,
  InvalidFrameSum: (roll1: number, roll2: number, sum: number, max: number) =>
    `Invalid frame: ${roll1} + ${roll2} = ${sum} > ${max}`,
  FailedToStart: 'Failed to start game. Please try again.',
  FailedToRoll: 'Failed to add throw. Please try again.',
  FailedBowlingService: 'Failed to communicate with bowling service.',
  FailedLoadHighscores: 'Failed to load highscores',
} as const;

export const EndPoints = {
  StartNewGame: '/bowling/start/',
  GetGame: '/bowling/',
  Turn: '/bowling/turn',
  Highscores: '/bowling/highscores',
  Login: '/auth/login',
  Register: '/auth/register',
  Logout: '/auth/logout',
} as const;
