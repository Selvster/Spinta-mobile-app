# Spinta Mobile App - Backend Integration Plan

## Overview
Connect the React Native mobile app to the backend API at `https://spinta-backend.vercel.app/api` using Axios and TanStack React Query. Replace all mock data with real API calls.

**Backend URL:** `https://spinta-backend.vercel.app/api`
**Documentation:** `docs/04_AUTHENTICATION.md`, `docs/05_COACH_ENDPOINTS.md`, `docs/06_PLAYER_ENDPOINTS.md`

## Key Decisions
- **Loading States:** Use skeleton loaders for better UX
- **Token Expiry:** Redirect to login (no refresh token implementation)
- **API Prefix:** All endpoints use `/api` prefix

---

## Current State Analysis

### What Already Exists:
- Axios client with interceptors (`src/api/client.ts`)
- React Query setup in `App.tsx`
- Zustand auth store (`src/stores/authStore.ts`)
- Basic API endpoint constants (`src/api/endpoints.ts`)
- Some placeholder query/mutation hooks

### What Needs to Change:
- Update API base URL to Vercel backend
- Create TypeScript types matching API responses
- Update endpoints to match documentation
- Create React Query hooks for all endpoints
- Replace mock data in all screens with API calls

---

## Implementation Phases

### Phase 1: API Foundation (Configuration & Types)

#### 1.1 Update API Configuration
**File:** `src/constants/config.ts`
```typescript
// Change API_BASE_URL to:
production: 'https://spinta-backend.vercel.app/api'
```

#### 1.2 Create API Response Types
**File:** `src/types/api.types.ts` (expand existing)

**Auth Response Types:**
- `LoginResponse` - user data + JWT token
- `CoachRegistrationResponse` - coach + club data + token
- `PlayerRegistrationResponse` - player + club data + token
- `VerifyInviteResponse` - player_data with prefilled info

**Coach Response Types:**
- `CoachDashboardResponse` - coach, club, season_record, team_form, matches, statistics
- `MatchDetailResponse` - match, teams, summary, statistics, lineup
- `PlayersListResponse` - summary counts + players array
- `PlayerDetailResponse` - player, invite_code, attributes, season_statistics, matches, training_plans
- `PlayerMatchDetailResponse` - match, teams, player_summary, statistics
- `CoachProfileResponse` - coach, club, club_stats
- `TrainingPlanDetailResponse` - plan, progress, exercises, coach_notes
- `AIGeneratedPlanResponse` - player info + generated exercises

**Player Response Types:**
- `PlayerDashboardResponse` - player, attributes, season_statistics
- `PlayerMatchesResponse` - matches array with pagination
- `PlayerMatchDetailResponse` - same as coach view
- `PlayerTrainingListResponse` - training_plans array
- `PlayerTrainingDetailResponse` - plan, progress, exercises, coach_notes
- `PlayerProfileResponse` - player, club, season_summary

#### 1.3 Update API Endpoints
**File:** `src/api/endpoints.ts`

```typescript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_COACH: '/auth/register/coach',
    VERIFY_INVITE: '/auth/verify-invite',
    REGISTER_PLAYER: '/auth/register/player',
  },
  COACH: {
    DASHBOARD: '/coach/dashboard',
    MATCH_DETAIL: (matchId: string) => `/coach/matches/${matchId}`,
    PLAYERS: '/coach/players',
    PLAYER_DETAIL: (playerId: string) => `/coach/players/${playerId}`,
    PLAYER_MATCH_DETAIL: (playerId: string, matchId: string) =>
      `/coach/players/${playerId}/matches/${matchId}`,
    PROFILE: '/coach/profile',
    TRAINING_PLAN_GENERATE: '/coach/training-plans/generate-ai',
    TRAINING_PLAN_CREATE: '/coach/training-plans',
    TRAINING_PLAN_DETAIL: (planId: string) => `/coach/training-plans/${planId}`,
    TRAINING_PLAN_UPDATE: (planId: string) => `/coach/training-plans/${planId}`,
    TRAINING_PLAN_DELETE: (planId: string) => `/coach/training-plans/${planId}`,
  },
  PLAYER: {
    DASHBOARD: '/player/dashboard',
    MATCHES: '/player/matches',
    MATCH_DETAIL: (matchId: string) => `/player/matches/${matchId}`,
    TRAINING: '/player/training',
    TRAINING_DETAIL: (planId: string) => `/player/training/${planId}`,
    TOGGLE_EXERCISE: (exerciseId: string) =>
      `/player/training/exercises/${exerciseId}/toggle`,
    PROFILE: '/player/profile',
  },
};
```

---

### Phase 2: Authentication Integration

#### 2.1 Update Auth Store
**File:** `src/stores/authStore.ts`
- Store JWT token (already exists)
- Add `user_type` field to user state
- Update user interface to match API response

#### 2.2 Create Auth Mutations
**File:** `src/api/mutations/auth.mutations.ts`

| Hook | Endpoint | Purpose |
|------|----------|---------|
| `useLogin` | POST `/auth/login` | Login with email/password |
| `useRegisterCoach` | POST `/auth/register/coach` | Coach registration |
| `useVerifyInvite` | POST `/auth/verify-invite` | Validate player invite code |
| `useRegisterPlayer` | POST `/auth/register/player` | Player registration |

#### 2.3 Update Auth Components
**Files to update:**
- `src/components/auth/LoginForm.tsx` - Use `useLogin` mutation
- `src/components/auth/CoachRegistrationForm.tsx` - Use `useRegisterCoach` mutation
- `src/components/auth/PlayerRegistrationForm.tsx` - Use `useVerifyInvite` + `useRegisterPlayer`

---

### Phase 3: Coach API Integration

#### 3.1 Create Coach Query Hooks
**File:** `src/api/queries/coach.queries.ts`

| Hook | Endpoint | Used By |
|------|----------|---------|
| `useCoachDashboard` | GET `/coach/dashboard` | DashboardScreen |
| `useCoachMatchDetail` | GET `/coach/matches/{id}` | MatchDetailScreen |
| `useCoachPlayers` | GET `/coach/players` | PlayersScreen |
| `useCoachPlayerDetail` | GET `/coach/players/{id}` | PlayerDetailScreen |
| `useCoachPlayerMatchDetail` | GET `/coach/players/{pid}/matches/{mid}` | PlayerMatchDetailScreen |
| `useCoachProfile` | GET `/coach/profile` | ProfileScreen |
| `useCoachTrainingPlanDetail` | GET `/coach/training-plans/{id}` | TrainingPlanDetailScreen |

#### 3.2 Create Coach Mutation Hooks
**File:** `src/api/mutations/coach.mutations.ts`

| Hook | Endpoint | Used By |
|------|----------|---------|
| `useGenerateAIPlan` | POST `/coach/training-plans/generate-ai` | PlayerDetailScreen |
| `useCreateTrainingPlan` | POST `/coach/training-plans` | CreateTrainingPlanScreen |
| `useUpdateTrainingPlan` | PUT `/coach/training-plans/{id}` | CreateTrainingPlanScreen |
| `useDeleteTrainingPlan` | DELETE `/coach/training-plans/{id}` | TrainingPlanDetailScreen |

#### 3.3 Update Coach Screens
| Screen | File | Changes |
|--------|------|---------|
| DashboardScreen | `src/screens/coach/DashboardScreen.tsx` | Replace mock with `useCoachDashboard` |
| MatchDetailScreen | `src/screens/coach/MatchDetailScreen.tsx` | Replace mock with `useCoachMatchDetail` |
| PlayersScreen | `src/screens/coach/PlayersScreen.tsx` | Replace mock with `useCoachPlayers` |
| PlayerDetailScreen | `src/screens/coach/PlayerDetailScreen.tsx` | Replace mock with `useCoachPlayerDetail` |
| TrainingPlanDetailScreen | `src/screens/coach/TrainingPlanDetailScreen.tsx` | Replace mock with `useCoachTrainingPlanDetail` |
| CreateTrainingPlanScreen | `src/screens/coach/CreateTrainingPlanScreen.tsx` | Use mutations for create/update |
| ProfileScreen | `src/screens/coach/ProfileScreen.tsx` | Replace mock with `useCoachProfile` |

---

### Phase 4: Player API Integration

#### 4.1 Create Player Query Hooks
**File:** `src/api/queries/player.queries.ts`

| Hook | Endpoint | Used By |
|------|----------|---------|
| `usePlayerDashboard` | GET `/player/dashboard` | PlayerHomeScreen |
| `usePlayerMatches` | GET `/player/matches` | PlayerMatchesScreen |
| `usePlayerMatchDetail` | GET `/player/matches/{id}` | PlayerMatchDetailScreen |
| `usePlayerTraining` | GET `/player/training` | PlayerTrainingScreen |
| `usePlayerTrainingDetail` | GET `/player/training/{id}` | PlayerTrainingPlanDetailScreen |
| `usePlayerProfile` | GET `/player/profile` | PlayerProfileScreen |

#### 4.2 Create Player Mutation Hooks
**File:** `src/api/mutations/player.mutations.ts`

| Hook | Endpoint | Used By |
|------|----------|---------|
| `useToggleExercise` | PUT `/player/training/exercises/{id}/toggle` | PlayerTrainingPlanDetailScreen |

#### 4.3 Update Player Screens
| Screen | File | Changes |
|--------|------|---------|
| PlayerHomeScreen | `src/screens/player/PlayerHomeScreen.tsx` | Replace mock with `usePlayerDashboard` |
| PlayerMatchesScreen | `src/screens/player/PlayerMatchesScreen.tsx` | Replace mock with `usePlayerMatches` |
| PlayerTrainingScreen | `src/screens/player/PlayerTrainingScreen.tsx` | Replace mock with `usePlayerTraining` |
| PlayerTrainingPlanDetailScreen | `src/screens/player/PlayerTrainingPlanDetailScreen.tsx` | Use query + mutation |
| PlayerProfileScreen | `src/screens/player/PlayerProfileScreen.tsx` | Replace mock with `usePlayerProfile` |

---

### Phase 5: Shared Components & Error Handling

#### 5.1 Create Skeleton Loaders
**File:** `src/components/common/skeletons/`
- `DashboardSkeleton.tsx` - Skeleton for dashboard cards and stats
- `PlayerListSkeleton.tsx` - Skeleton for player list items
- `MatchDetailSkeleton.tsx` - Skeleton for match detail tabs
- `TrainingPlanSkeleton.tsx` - Skeleton for training plan view
- `ProfileSkeleton.tsx` - Skeleton for profile screen

#### 5.2 Create Error/Empty Components
**File:** `src/components/common/`
- `ErrorScreen.tsx` - Error display with retry button
- `EmptyState.tsx` - No data state

#### 5.3 Update Shared Screens
**File:** `src/screens/shared/PlayerMatchDetailScreen.tsx`
- Support both coach and player contexts
- Use appropriate query based on user role

#### 5.4 Add Query Error Handling
- Handle 401 errors → clear auth state → redirect to login
- Handle network errors with retry UI
- No token refresh (user re-authenticates on expiry)

---

## Files to Create/Modify

### New Files:
| File | Purpose |
|------|---------|
| `src/types/coach.types.ts` | Coach API response types |
| `src/types/player.types.ts` | Player API response types |
| `src/types/training.types.ts` | Training plan types |
| `src/types/match.types.ts` | Match-related types |

### Files to Modify:
| File | Changes |
|------|---------|
| `src/constants/config.ts` | Update API base URL |
| `src/api/endpoints.ts` | Add all documented endpoints |
| `src/api/client.ts` | Verify interceptors work with new backend |
| `src/stores/authStore.ts` | Update user type to match API |
| `src/api/queries/coach.queries.ts` | Add all coach query hooks |
| `src/api/queries/player.queries.ts` | Add all player query hooks |
| `src/api/mutations/auth.mutations.ts` | Update auth mutations |
| `src/api/mutations/coach.mutations.ts` | Add coach mutations |
| `src/api/mutations/player.mutations.ts` | Add player mutations |
| All coach screens | Replace mock data with queries |
| All player screens | Replace mock data with queries |
| Auth components | Connect to real auth endpoints |

---

## Implementation Order (Step by Step)

### Step 1: Foundation
1. Update `src/constants/config.ts` with Vercel URL
2. Create all TypeScript types in `src/types/`
3. Update `src/api/endpoints.ts` with all endpoints

### Step 2: Authentication
4. Update `src/stores/authStore.ts` user interface
5. Update `src/api/mutations/auth.mutations.ts`
6. Update `LoginForm.tsx` to use real login
7. Update `CoachRegistrationForm.tsx`
8. Update `PlayerRegistrationForm.tsx`

### Step 3: Coach Integration
9. Create `src/api/queries/coach.queries.ts` with all hooks
10. Create `src/api/mutations/coach.mutations.ts` with all hooks
11. Update `DashboardScreen.tsx`
12. Update `PlayersScreen.tsx`
13. Update `PlayerDetailScreen.tsx`
14. Update `MatchDetailScreen.tsx`
15. Update `TrainingPlanDetailScreen.tsx`
16. Update `CreateTrainingPlanScreen.tsx`
17. Update `ProfileScreen.tsx` (coach)

### Step 4: Player Integration
18. Create `src/api/queries/player.queries.ts` with all hooks
19. Create `src/api/mutations/player.mutations.ts` with all hooks
20. Update `PlayerHomeScreen.tsx`
21. Update `PlayerMatchesScreen.tsx`
22. Update `PlayerTrainingScreen.tsx`
23. Update `PlayerTrainingPlanDetailScreen.tsx`
24. Update `PlayerProfileScreen.tsx`

### Step 5: Polish
25. Add loading states to all screens
26. Add error handling and retry logic
27. Test all flows end-to-end
28. Handle edge cases (empty states, network errors)

---

## Testing Checklist

### Authentication
- [ ] Coach can register with all fields
- [ ] Player can verify invite code
- [ ] Player can complete registration
- [ ] Login works for both coach and player
- [ ] Token is stored and sent with requests
- [ ] Logout clears state and redirects

### Coach Screens
- [ ] Dashboard loads real data
- [ ] Match list displays correctly
- [ ] Match detail shows all tabs
- [ ] Players list with correct counts
- [ ] Player detail with all tabs working
- [ ] Can generate AI training plan
- [ ] Can create/edit training plans
- [ ] Profile shows correct data

### Player Screens
- [ ] Home shows attributes and stats
- [ ] Matches list loads correctly
- [ ] Match detail shows player stats
- [ ] Training plans list loads
- [ ] Can toggle exercise completion
- [ ] Profile shows correct data
- [ ] Logout works

### Error Handling
- [ ] Loading states display correctly
- [ ] Network errors show retry option
- [ ] 401 errors redirect to login
- [ ] Empty states display correctly

---

## API Endpoint Summary

### Auth (4 endpoints)
- POST `/auth/login`
- POST `/auth/register/coach`
- POST `/auth/verify-invite`
- POST `/auth/register/player`

### Coach (11 endpoints)
- GET `/coach/dashboard`
- GET `/coach/matches/{match_id}`
- GET `/coach/players`
- GET `/coach/players/{player_id}`
- GET `/coach/players/{player_id}/matches/{match_id}`
- GET `/coach/profile`
- POST `/coach/training-plans/generate-ai`
- POST `/coach/training-plans`
- GET `/coach/training-plans/{plan_id}`
- PUT `/coach/training-plans/{plan_id}`
- DELETE `/coach/training-plans/{plan_id}`

### Player (7 endpoints)
- GET `/player/dashboard`
- GET `/player/matches`
- GET `/player/matches/{match_id}`
- GET `/player/training`
- GET `/player/training/{plan_id}`
- PUT `/player/training/exercises/{exercise_id}/toggle`
- GET `/player/profile`

**Total: 22 endpoints**
