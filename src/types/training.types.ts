// Training plan types matching backend API

export type TrainingPlanStatus = 'pending' | 'in_progress' | 'completed';

// ============================================
// TRAINING PLAN BASIC (List View)
// ============================================

export interface TrainingPlanBasic {
  plan_id: string;
  plan_name: string;
  created_at: string;
  status: TrainingPlanStatus;
}

// ============================================
// TRAINING EXERCISE
// ============================================

export interface TrainingExercise {
  exercise_id: string;
  exercise_name: string;
  description: string | null;
  sets: string | null;
  reps: string | null;
  duration_minutes: string | null;
  exercise_order: number;
  completed: boolean;
  completed_at?: string | null;
}

// ============================================
// TRAINING PLAN DETAIL
// ============================================

export interface TrainingPlanInfo {
  plan_id: string;
  plan_name: string;
  player_name: string;
  player_jersey: number;
  status: TrainingPlanStatus;
  created_at: string;
}

export interface TrainingPlanProgress {
  percentage: number;
  completed_exercises: number;
  total_exercises: number;
}

export interface TrainingPlanDetailResponse {
  plan: TrainingPlanInfo;
  progress: TrainingPlanProgress;
  exercises: TrainingExercise[];
  coach_notes: string | null;
}

// ============================================
// AI GENERATED PLAN
// ============================================

export interface AIGeneratedExercise {
  exercise_name: string;
  description: string;
  sets: string;
  reps: string;
  duration_minutes: string;
}

export interface AIGeneratedPlanResponse {
  player_name: string;
  jersey_number: number;
  plan_name: string;
  duration: string;
  exercises: AIGeneratedExercise[];
}

// ============================================
// CREATE/UPDATE TRAINING PLAN
// ============================================

export interface ExerciseInput {
  exercise_id?: string; // For updates
  exercise_name: string;
  description?: string;
  sets?: string;
  reps?: string;
  duration_minutes?: string;
  exercise_order: number;
}

export interface CreateTrainingPlanRequest {
  player_id: string;
  plan_name: string;
  duration?: string;
  coach_notes?: string;
  exercises: ExerciseInput[];
}

export interface CreateTrainingPlanResponse {
  plan_id: string;
  player_id: string;
  plan_name: string;
  duration: string | null;
  status: TrainingPlanStatus;
  coach_notes: string | null;
  exercise_count: number;
  created_at: string;
}

export interface UpdateTrainingPlanRequest {
  plan_name?: string;
  duration?: string;
  coach_notes?: string;
  exercises?: ExerciseInput[];
}

export interface UpdateTrainingPlanResponse {
  plan_id: string;
  player_id: string;
  plan_name: string;
  duration: string | null;
  status: TrainingPlanStatus;
  updated: boolean;
}

export interface DeleteTrainingPlanResponse {
  deleted: boolean;
  plan_id: string;
}

// ============================================
// TOGGLE EXERCISE
// ============================================

export interface ToggleExerciseRequest {
  completed: boolean;
}

export interface ToggleExerciseResponse {
  exercise_id: string;
  completed: boolean;
  completed_at: string | null;
  plan_progress: {
    plan_id: string;
    total_exercises: number;
    completed_exercises: number;
    progress_percentage: number;
    plan_status: TrainingPlanStatus;
  };
}
