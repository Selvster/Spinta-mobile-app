// Authentication types matching backend API

import { ApiUser, CoachUser, PlayerUser, ClubBasic } from './user.types';

// ============================================
// LOGIN
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: ApiUser;
  token: string;
}

// ============================================
// COACH REGISTRATION
// ============================================

export interface CoachClubRegistration {
  club_name: string;
  country?: string;
  age_group?: string;
  stadium?: string;
  logo_url?: string;
}

export interface CoachRegistrationRequest {
  email: string;
  password: string;
  full_name: string;
  birth_date?: string;
  gender?: string;
  club: CoachClubRegistration;
}

export interface CoachRegistrationResponse {
  user: CoachUser;
  token: string;
}

// ============================================
// PLAYER REGISTRATION
// ============================================

// Step 1: Verify invite code
export interface VerifyInviteRequest {
  invite_code: string;
}

export interface VerifyInviteResponse {
  valid: boolean;
  player_data: {
    player_id: string;
    player_name: string;
    jersey_number: number;
    position: string;
    club_name: string;
    club_logo_url: string | null;
  };
}

// Step 2: Complete player registration
export interface PlayerRegistrationRequest {
  invite_code: string;
  player_name: string;
  email: string;
  password: string;
  birth_date: string;
  height: number;
  profile_image_url?: string;
}

export interface PlayerRegistrationResponse {
  user: PlayerUser;
  token: string;
}

// ============================================
// AUTH STATE
// ============================================

export interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
