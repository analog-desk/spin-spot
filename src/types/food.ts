export type AppetiteState = 
  | 'Light / Snack'
  | 'Moderate Appetite'
  | 'Hungry / Big Meal'
  | 'Specific Craving'
  | 'Comfort Food';

export type DecisionSource = 'main_wheel' | 'top_three_wheel' | 'manual';

export interface FoodItemHierarchy {
  id: string;
  name: string; // e.g. "McDonald's", "Wingstop", "Pho"
  brand: string | null; // e.g. "McDonald's" or null for generic category like Pho
  isGenericCategory: boolean; // true for Pho, generic cuisines
  category: 'Fast Food' | 'Restaurant';
  cuisine: string; // "Fast Food" or "Restaurant"
  defaultItems: string[]; // e.g. ["Big Mac", "Quarter Pounder", "Fries"]
  knownLocations: string[]; // e.g. ["Downtown 4th St", "Airport Terminal"]
  color: string;
  description?: string;
}

export interface MealRecord {
  id: string;
  date: string; // ISO string
  choiceId: string;
  displayName: string;
  restaurantBrand: string | null; // Parent brand if known
  isGenericCategory: boolean;
  location: string | null; // Optional location
  specificFoodItem: string | null; // Optional specific item (e.g. "Fries", "Soup")
  appetiteState: AppetiteState;
  source: DecisionSource;
  notes?: string;
  overrideFatigue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WheelSession {
  id: string;
  timestamp: string;
  mode: 'main_wheel' | 'top_three_wheel';
  selectedChoiceId: string;
  selectedName: string;
  topThreeIds?: string[];
  status: 'spun' | 'locked_in' | 'rejected';
  rejectionReason?: string;
}

export interface PendingMeal {
  id: string;
  wheelSessionId?: string;
  lockedAt: string;
  choiceId: string;
  displayName: string;
  restaurantBrand: string | null;
  isGenericCategory: boolean;
  cuisine: string;
  location?: string | null;
  specificFoodItem?: string | null;
  appetiteState: AppetiteState;
  source: DecisionSource;
}

export interface FatigueStatus {
  targetKey: string; // Brand name OR generic choiceId
  displayName: string;
  isBrand: boolean;
  mealsLast30Days: number;
  isFatigued: boolean;
  isApproaching: boolean; // count === threshold - 1
  consecutiveDays: number;
  oldestMealInWindowDate: string | null;
  latestMealDate: string | null;
  daysSinceLatestMeal: number;
  daysUntilNextRecovery: number | null; // At most 5 days due to 5-day max exclusion policy
  maxExclusionDays: number; // e.g. 5 days
  recentMealDates: string[];
}

export interface FatigueOverrideRecord {
  id: string;
  timestamp: string;
  targetKey: string;
  displayName: string;
  mealsCountAtTime: number;
  reason?: string;
}

export interface AppSettings {
  fatigueWarningThreshold: number; // default: 4 (after 3 allowed meals, 4th triggers warning)
  maxExclusionDays: number; // default: 5 (excluded for 5 days max)
  wheelSoundEnabled: boolean;
  allowFatiguedInWheel: boolean; // if user wants to see them grayed out vs completely filtered
}
