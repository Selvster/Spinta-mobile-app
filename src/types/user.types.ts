export enum UserRole {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
}

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Player extends BaseUser {
  role: UserRole.PLAYER;
  position?: string;
  teamId?: string;
  coachId?: string;
}

export interface Coach extends BaseUser {
  role: UserRole.COACH;
  teamIds: string[];
  certification?: string;
}

export type User = Player | Coach;
