# Spinta Mobile App

A React Native mobile application built with Expo and TypeScript for managing players and coaches.

## Brand Identity

- **Primary Color**: `#FF3000` (Vibrant Orange-Red)
- **Secondary Color**: `#000000` (Black)
- **Background**: `#FFFFFF` (White)
- **Typography**: Franklin Gothic (with system font fallback)

See [BRANDING.md](./BRANDING.md) for complete brand guidelines.

## Features

- **Dual User Types**: Separate experiences for Players and Coaches
- **Role-Based Navigation**: Different screens and features based on user role
- **Authentication**: Complete registration and login flow with role selection
- **Type-Safe**: Full TypeScript coverage
- **State Management**: Zustand for global state with persistence
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

## Tech Stack

- **Framework**: Expo (TypeScript)
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand with AsyncStorage persistence
- **Data Fetching**: TanStack Query
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod
- **Storage**: AsyncStorage

## Project Structure

```
src/
├── api/
│   ├── queries/           # TanStack Query queries
│   ├── mutations/         # TanStack Query mutations
│   ├── client.ts          # Axios instance with interceptors
│   └── endpoints.ts       # API endpoint constants
├── components/
│   ├── common/            # Shared components (Button, Input, Card, etc.)
│   ├── auth/              # Auth-specific components
│   ├── player/            # Player-specific components
│   └── coach/             # Coach-specific components
├── screens/
│   ├── auth/              # Authentication screens
│   ├── player/            # Player screens
│   ├── coach/             # Coach screens
│   └── shared/            # Shared screens (Settings, etc.)
├── navigation/
│   ├── RootNavigator.tsx  # Main navigator with role-based routing
│   ├── AuthNavigator.tsx  # Auth flow navigation
│   ├── PlayerNavigator.tsx # Player bottom tabs
│   └── CoachNavigator.tsx  # Coach bottom tabs
├── stores/
│   ├── authStore.ts       # Auth state (user, tokens, isAuthenticated)
│   ├── playerStore.ts     # Player-specific state
│   └── coachStore.ts      # Coach-specific state
├── hooks/
│   ├── useAuth.ts         # Access auth state
│   ├── useRole.ts         # Role-specific logic
│   ├── usePlayer.ts       # Player data and queries
│   └── useCoach.ts        # Coach data and queries
├── types/
│   ├── user.types.ts      # User, Player, Coach, UserRole enum
│   ├── auth.types.ts      # Login, Register, AuthTokens
│   └── api.types.ts       # API response types
├── utils/
│   ├── storage.ts         # AsyncStorage wrapper
│   ├── validators.ts      # Zod schemas for forms
│   └── formatters.ts      # Data formatting utilities
└── constants/
    ├── roles.ts           # Role configurations
    ├── routes.ts          # Route name constants
    ├── config.ts          # API URLs, env config
    └── colors.ts          # Color constants
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (optional, comes with npx)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the App

#### Development Mode

```bash
# Start Expo development server
npm start

# Or run on specific platform
npm run android   # Android emulator/device
npm run ios       # iOS simulator (Mac only)
npm run web       # Web browser
```

## Key Features

### Authentication Flow

1. **Welcome Screen**: Entry point with Login/Register options
2. **Login Screen**: Email/password authentication
3. **Registration Flow**:
   - Basic info collection
   - Role selection (Player or Coach)
   - Role-specific fields (position for players, certification for coaches)

### Role-Based Navigation

- **Players**: Access to Home, Training, Profile, and Settings
- **Coaches**: Access to Home, Teams, Profile, and Settings
- Navigation automatically switches based on authenticated user's role

### State Persistence

- Authentication state persists across app restarts using AsyncStorage
- Users remain logged in until they explicitly logout

## API Configuration

Update the API base URL in `src/constants/config.ts`:

```typescript
const ENV = {
  dev: {
    API_BASE_URL: 'http://localhost:3000/api',
  },
  prod: {
    API_BASE_URL: 'https://api.spinta.com/api',
  },
};
```

## Architecture Highlights

### 1. Type Safety
- Full TypeScript coverage with strict mode
- Discriminated unions for User types (Player | Coach)
- Type-safe navigation and form validation

### 2. Separation of Concerns
- Clear separation between UI, state, and API logic
- Feature-based organization for player/coach code
- Reusable common components

### 3. Security
- Navigator-level route protection
- Automatic auth token injection via Axios interceptors
- Token refresh handling (ready for implementation)

### 4. Performance
- TanStack Query caching and optimistic updates
- Lazy loading and code splitting ready
- Efficient re-renders with proper memoization

## Next Steps

To connect to your backend:

1. Update API endpoints in `src/api/endpoints.ts`
2. Implement actual API calls in queries and mutations
3. Add token refresh logic in `src/api/client.ts`
4. Configure environment variables for different environments

## Development Tips

### Adding a New Screen

1. Create screen component in appropriate directory (`screens/player/` or `screens/coach/`)
2. Add route constant in `src/constants/routes.ts`
3. Register route in appropriate navigator (`PlayerNavigator.tsx` or `CoachNavigator.tsx`)

### Adding a New API Endpoint

1. Add endpoint to `src/api/endpoints.ts`
2. Create query in `src/api/queries/` or mutation in `src/api/mutations/`
3. Use in components via hooks

### Adding New Types

1. Define types in appropriate file in `src/types/`
2. Export from `src/types/index.ts`
3. Use throughout the app

## Troubleshooting

### Metro Bundler Issues
```bash
npx expo start -c
```

### TypeScript Errors
```bash
npx tsc --noEmit
```

### Clear Cache
```bash
npm start -- --clear
```

## License

MIT
"# Spinta-mobile-app" 
