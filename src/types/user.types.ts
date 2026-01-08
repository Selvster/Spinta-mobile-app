// User types matching backend API responses

export enum UserRole {
  PLAYER = 'player',
  COACH = 'coach',
}

// Base user from login/registration responses
export interface ApiUser {
  user_id: string;
  email: string;
  user_type: UserRole;
  full_name: string;
}

// Extended user for coach registration response
export interface CoachUser extends ApiUser {
  user_type: UserRole.COACH;
  club: ClubBasic;
}

// Extended user for player registration response
export interface PlayerUser extends ApiUser {
  user_type: UserRole.PLAYER;
  jersey_number: number;
  position: string;
  birth_date: string;
  profile_image_url: string | null;
  club: ClubBasic;
}

// Basic club info returned in auth responses
export interface ClubBasic {
  club_id: string;
  club_name: string;
  logo_url: string | null;
  age_group?: string;
  stadium?: string;
}

// For local storage / auth store
export interface StoredUser {
  user_id: string;
  email: string;
  user_type: UserRole;
  full_name: string;
}

export type User = ApiUser | CoachUser | PlayerUser;
