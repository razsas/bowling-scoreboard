# Bowling Scoreboard Application

A modern bowling scoring application built with Angular 19, featuring real-time score calculation, strike and spare detection, and high score tracking.

## 🎯 Features

- ✅ Real-time bowling score calculation
- ✅ Automatic strike and spare detection
- ✅ 10th frame bonus roll handling
- ✅ High score leaderboard
- ✅ Form validation
- ✅ OnPush change detection strategy for optimal performance
- ✅ Signal-based state management
- ✅ Route guards for navigation protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- Angular CLI 19.2.18
- npm or yarn
- .NET backend API running on `https://localhost:7151`

## 🚀 Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure API endpoint**

   The API URL is configured in `src/environments/environments.ts`:
   ```typescript
   export const environment = {
     apiUrl: "https://localhost:7151/api/bowling",
   };
   ```

## 💻 Development

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes to source files.

## 🏗️ Architecture

### Component Structure

```
src/app/
├── components/
│   ├── start-screen/         # Player name input and game initialization
│   ├── game/                 # Main game container managing game state
│   ├── scoreboard-display/   # Visual scoreboard display
│   ├── roll-input/           # Roll input form
│   └── highscores/           # High score leaderboard
├── constants/
│   └── game.constants.ts     # Game constants and error messages
├── guards/
│   └── player.guard.ts       # Navigation guard for active player check
├── models/
│   └── game.models.ts        # TypeScript interfaces and types
├── services/
│   ├── game.service.ts       # Core game logic and API communication
│   └── highscore.service.ts  # High score management
└── utils/
    └── roll-display.util.ts  # Roll display formatting utility
```

### Key Components

#### **StartScreenComponent**
- Handles player name input
- Validates form before game creation
- Navigates to game board on successful initialization

#### **GameComponent**
- Main container managing game state
- Coordinates between scoreboard display and roll input
- Handles game completion and navigation to high scores

#### **ScoreboardDisplayComponent**
- Displays the 10-frame bowling scoreboard
- Shows cumulative scores per frame
- Displays strikes (X) and spares (/)
- Shows current frame rolls in progress

#### **RollInputComponent**
- Input form for entering pins knocked down
- Validates pin count (0-10)
- Handles game completion state
- Displays error messages

#### **HighscoresComponent**
- Displays top 5 high scores
- Formats dates for display
- Allows navigation back to start screen

### Services

#### **GameService**
- Manages current game state using Angular signals
- Processes roll inputs with validation
- Communicates with backend API
- Calculates frame completion logic
- Handles 10th frame special rules

#### **HighscoreService**
- Fetches high scores from API
- Manages high score state
- Handles loading errors

### Guards

#### **playerGuard**
- Prevents navigation to game without active player
- Redirects to start screen if no player is set

### Constants & Utilities

#### **game.constants.ts**
- Game rules constants (MAX_PINS, MAX_FRAMES, etc.)
- Centralized error messages
- Improves maintainability and consistency

#### **roll-display.util.ts**
- Formats roll values for display
- Handles strike and spare notation
- Supports 10th frame special cases

## 🎳 Bowling Rules Implemented

### Standard Frames (1-9)
- Two rolls per frame maximum
- Strike: All 10 pins knocked down on first roll
- Spare: All 10 pins knocked down in two rolls

### 10th Frame Special Rules
- Three rolls allowed if strike or spare
- Two rolls for open frame
- Bonus rolls for score calculation

### Scoring
- Strike: 10 + next two rolls
- Spare: 10 + next roll
- Open frame: Sum of pins knocked down
- Automatic cumulative score calculation

## 🔧 Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📝 Code Quality Features

- **TypeScript Strict Mode**: Enabled for type safety
- **OnPush Change Detection**: Optimized performance
- **Signal-based State**: Modern reactive state management
- **Lazy Loading**: Routes are lazily loaded
- **Clean Code Principles**: 
  - Single Responsibility Principle
  - DRY (Don't Repeat Yourself)
  - Centralized constants
  - Utility functions for reusable logic
  - Type-safe interfaces and types

## 🌐 API Endpoints Used

- `POST /api/bowling/start` - Start new game
- `POST /api/bowling/turn` - Submit a turn/frame
- `GET /api/bowling/{gameId}` - Get game state
- `GET /api/bowling/highscores` - Get top high scores

## 🎨 Styling

- Component-scoped SCSS stylesheets
- Responsive design
- Modern UI/UX practices

## 📦 Dependencies

- **@angular/core**: ^19.2.0
- **@angular/common**: ^19.2.0
- **@angular/router**: ^19.2.0
- **@angular/forms**: ^19.2.0
- **rxjs**: ~7.8.0

## 🔐 Environment Configuration

For production deployment, create `src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api/bowling',
};
```

## 📖 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev)

## 👨‍💻 Development Notes

This application showcases modern Angular development practices including:
- Standalone components
- Signal-based state management
- Functional route guards
- Clean architecture with separation of concerns
- Type-safe development with TypeScript
- Reactive programming with RxJS
