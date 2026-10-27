import { FoodItemHierarchy, MealRecord, PendingMeal, WheelSession, FatigueOverrideRecord, AppSettings } from '../types/food';
import { INITIAL_FOOD_LIST } from '../data/initialFoodList';

const STORAGE_KEYS = {
  FOOD_LIST: 'food_roulette_list_v5',
  CONFIRMED_MEALS: 'food_roulette_meals_v5',
  PENDING_MEALS: 'food_roulette_pending_v5',
  WHEEL_SESSIONS: 'food_roulette_sessions_v5',
  OVERRIDES: 'food_roulette_overrides_v5',
  SETTINGS: 'food_roulette_settings_v5',
};

export const DEFAULT_SETTINGS: AppSettings = {
  fatigueWarningThreshold: 4, // 1-3 allowed without warning; 4th triggers warning
  maxExclusionDays: 5, // Excluded for 5 days max
  wheelSoundEnabled: true,
  allowFatiguedInWheel: false,
};

export function loadFoodList(): FoodItemHierarchy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_LIST);
    if (!raw) return INITIAL_FOOD_LIST;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length === INITIAL_FOOD_LIST.length ? parsed : INITIAL_FOOD_LIST;
  } catch {
    return INITIAL_FOOD_LIST;
  }
}

export function saveFoodList(list: FoodItemHierarchy[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOOD_LIST, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save food list', err);
  }
}

export function loadConfirmedMeals(): MealRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIRMED_MEALS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConfirmedMeals(meals: MealRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIRMED_MEALS, JSON.stringify(meals));
  } catch (err) {
    console.error('Failed to save confirmed meals', err);
  }
}

export function loadPendingMeals(): PendingMeal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_MEALS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePendingMeals(pending: PendingMeal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_MEALS, JSON.stringify(pending));
  } catch (err) {
    console.error('Failed to save pending meals', err);
  }
}

export function loadWheelSessions(): WheelSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WHEEL_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveWheelSessions(sessions: WheelSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WHEEL_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save wheel sessions', err);
  }
}

export function loadOverrides(): FatigueOverrideRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OVERRIDES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOverrides(overrides: FatigueOverrideRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(overrides));
  } catch (err) {
    console.error('Failed to save overrides', err);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

/**
 * Seeds realistic 30-day eating history demonstrating all rules with the user's exact 23 entries:
 * - Tacos Los Cholos: 4 meals within 30 days -> Triggered Fatigue!
 * - McDonald's: 3 meals within 30 days -> Approaching Fatigue (at different locations)
 * - Wingstop Fries: 2 meals with specific item "Louisiana Voodoo Fries" -> contributes to Wingstop brand fatigue & item trends
 * - Buffalo Wild Wings Nuggets: 2 meals with specific item "Nuggets"
 * - Panera Bread Soup: 2 meals with specific item "Broccoli Cheddar Soup"
 * - Generic "Pho": 2 meals at different independent pho shops (does not merge into a chain brand)
 * - WaBa Grill: 1 meal
 * - Costco Food Court: 1 meal
 * - Older meals >30 days ago that don't count toward fatigue
 */
export function seedRealisticHistory(): MealRecord[] {
  const now = new Date();
  const d = (daysAgo: number, hours = 12, minutes = 30): string => {
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };

  const sampleMeals: MealRecord[] = [
    // Tacos Los Cholos: 4 meals within 30 days -> Triggered Fatigue!
    {
      id: 'meal-seed-1',
      date: d(2, 19, 0),
      choiceId: 'tacos-los-cholos',
      displayName: 'Tacos Los Cholos',
      restaurantBrand: 'Tacos Los Cholos',
      isGenericCategory: false,
      location: 'Anaheim Flagship',
      specificFoodItem: 'Prime Ribeye Taco',
      appetiteState: 'Hungry / Big Meal',
      source: 'main_wheel',
      notes: 'Charcoal grilled with salsa roja',
      createdAt: d(2, 19, 0),
      updatedAt: d(2, 19, 0),
    },
    {
      id: 'meal-seed-2',
      date: d(8, 13, 15),
      choiceId: 'tacos-los-cholos',
      displayName: 'Tacos Los Cholos',
      restaurantBrand: 'Tacos Los Cholos',
      isGenericCategory: false,
      location: 'Fullerton Store',
      specificFoodItem: 'Costilla (Rib) Taco',
      appetiteState: 'Moderate Appetite',
      source: 'top_three_wheel',
      notes: 'Quick lunch',
      createdAt: d(8, 13, 15),
      updatedAt: d(8, 13, 15),
    },
    {
      id: 'meal-seed-3',
      date: d(16, 12, 30),
      choiceId: 'tacos-los-cholos',
      displayName: 'Tacos Los Cholos',
      restaurantBrand: 'Tacos Los Cholos',
      isGenericCategory: false,
      location: 'Anaheim Flagship',
      specificFoodItem: 'Carne Asada Taco',
      appetiteState: 'Hungry / Big Meal',
      source: 'main_wheel',
      createdAt: d(16, 12, 30),
      updatedAt: d(16, 12, 30),
    },
    {
      id: 'meal-seed-4',
      date: d(24, 18, 45), // Will expire in ~6 days!
      choiceId: 'tacos-los-cholos',
      displayName: 'Tacos Los Cholos',
      restaurantBrand: 'Tacos Los Cholos',
      isGenericCategory: false,
      location: 'Huntington Beach',
      specificFoodItem: 'Papa Loca',
      appetiteState: 'Specific Craving',
      source: 'manual',
      createdAt: d(24, 18, 45),
      updatedAt: d(24, 18, 45),
    },

    // McDonald's: 3 meals within 30 days -> Approaching Fatigue (threshold 4)
    // 2 at Downtown, 1 at Airport -> brand grouping!
    {
      id: 'meal-seed-5',
      date: d(4, 13, 0),
      choiceId: 'mcdonalds',
      displayName: "McDonald's",
      restaurantBrand: "McDonald's",
      isGenericCategory: false,
      location: 'Downtown 4th St',
      specificFoodItem: 'Quarter Pounder with Cheese',
      appetiteState: 'Hungry / Big Meal',
      source: 'main_wheel',
      createdAt: d(4, 13, 0),
      updatedAt: d(4, 13, 0),
    },
    {
      id: 'meal-seed-6',
      date: d(11, 20, 10),
      choiceId: 'mcdonalds',
      displayName: "McDonald's",
      restaurantBrand: "McDonald's",
      isGenericCategory: false,
      location: 'Airport Terminal B',
      specificFoodItem: 'Big Mac',
      appetiteState: 'Comfort Food',
      source: 'manual',
      notes: 'Travel dinner waiting for delayed flight',
      createdAt: d(11, 20, 10),
      updatedAt: d(11, 20, 10),
    },
    {
      id: 'meal-seed-7',
      date: d(19, 12, 20),
      choiceId: 'mcdonalds',
      displayName: "McDonald's",
      restaurantBrand: "McDonald's",
      isGenericCategory: false,
      location: 'Downtown 4th St',
      specificFoodItem: 'Chicken McNuggets',
      appetiteState: 'Moderate Appetite',
      source: 'main_wheel',
      createdAt: d(19, 12, 20),
      updatedAt: d(19, 12, 20),
    },

    // Wingstop Fries: 2 meals with specific food item "Fries"
    // Contributes to parent brand "Wingstop" and specific item "Fries"
    {
      id: 'meal-seed-8',
      date: d(6, 18, 30),
      choiceId: 'wingstop-fries',
      displayName: 'Wingstop Fries',
      restaurantBrand: 'Wingstop',
      isGenericCategory: false,
      location: 'University Plaza',
      specificFoodItem: 'Louisiana Voodoo Fries',
      appetiteState: 'Specific Craving',
      source: 'main_wheel',
      notes: 'Extra ranch sauce dip',
      createdAt: d(6, 18, 30),
      updatedAt: d(6, 18, 30),
    },
    {
      id: 'meal-seed-9',
      date: d(14, 19, 0),
      choiceId: 'wingstop-fries',
      displayName: 'Wingstop Fries',
      restaurantBrand: 'Wingstop',
      isGenericCategory: false,
      location: 'South Blvd',
      specificFoodItem: 'Seasoned Fries with Ranch',
      appetiteState: 'Comfort Food',
      source: 'manual',
      createdAt: d(14, 19, 0),
      updatedAt: d(14, 19, 0),
    },

    // Buffalo Wild Wings Nuggets: 2 meals
    {
      id: 'meal-seed-10',
      date: d(7, 19, 15),
      choiceId: 'bww-nuggets',
      displayName: 'Buffalo Wild Wings Nuggets',
      restaurantBrand: 'Buffalo Wild Wings',
      isGenericCategory: false,
      location: 'Mall Promenade',
      specificFoodItem: 'Boneless Nuggets (Honey BBQ)',
      appetiteState: 'Comfort Food',
      source: 'main_wheel',
      createdAt: d(7, 19, 15),
      updatedAt: d(7, 19, 15),
    },
    {
      id: 'meal-seed-11',
      date: d(21, 18, 30),
      choiceId: 'bww-nuggets',
      displayName: 'Buffalo Wild Wings Nuggets',
      restaurantBrand: 'Buffalo Wild Wings',
      isGenericCategory: false,
      location: 'Arena District',
      specificFoodItem: 'Boneless Nuggets (Medium Garlic)',
      appetiteState: 'Hungry / Big Meal',
      source: 'manual',
      createdAt: d(21, 18, 30),
      updatedAt: d(21, 18, 30),
    },

    // Panera Bread Soup: 2 meals with specific food item "Soup"
    {
      id: 'meal-seed-12',
      date: d(9, 12, 10),
      choiceId: 'panera-bread-soup',
      displayName: 'Panera Bread Soup',
      restaurantBrand: 'Panera Bread',
      isGenericCategory: false,
      location: 'City Commons',
      specificFoodItem: 'Broccoli Cheddar Soup in Sourdough Bread Bowl',
      appetiteState: 'Comfort Food',
      source: 'top_three_wheel',
      notes: 'In bread bowl on rainy day',
      createdAt: d(9, 12, 10),
      updatedAt: d(9, 12, 10),
    },
    {
      id: 'meal-seed-13',
      date: d(22, 13, 0),
      choiceId: 'panera-bread-soup',
      displayName: 'Panera Bread Soup',
      restaurantBrand: 'Panera Bread',
      isGenericCategory: false,
      location: 'City Commons',
      specificFoodItem: 'Broccoli Cheddar Soup',
      appetiteState: 'Light / Snack',
      source: 'manual',
      createdAt: d(22, 13, 0),
      updatedAt: d(22, 13, 0),
    },

    // Generic "Pho": 2 meals without a single parent brand
    {
      id: 'meal-seed-14',
      date: d(5, 19, 30),
      choiceId: 'pho',
      displayName: 'Pho',
      restaurantBrand: null,
      isGenericCategory: true,
      location: 'Pho Pasteur',
      specificFoodItem: 'Pho Dac Biet (Special Beef)',
      appetiteState: 'Comfort Food',
      source: 'main_wheel',
      notes: 'Extra Thai basil and lime',
      createdAt: d(5, 19, 30),
      updatedAt: d(5, 19, 30),
    },
    {
      id: 'meal-seed-15',
      date: d(17, 18, 50),
      choiceId: 'pho',
      displayName: 'Pho',
      restaurantBrand: null,
      isGenericCategory: true,
      location: 'Pho 79 Noodle House',
      specificFoodItem: 'Pho Ga (Chicken)',
      appetiteState: 'Moderate Appetite',
      source: 'manual',
      createdAt: d(17, 18, 50),
      updatedAt: d(17, 18, 50),
    },

    // WaBa Grill: 1 meal
    {
      id: 'meal-seed-16',
      date: d(3, 12, 15),
      choiceId: 'waba-grill',
      displayName: 'WaBa Grill',
      restaurantBrand: 'WaBa Grill',
      isGenericCategory: false,
      location: 'Metro Plaza',
      specificFoodItem: 'WaBa Chicken Bowl (Half White/Brown Rice)',
      appetiteState: 'Moderate Appetite',
      source: 'top_three_wheel',
      createdAt: d(3, 12, 15),
      updatedAt: d(3, 12, 15),
    },

    // Costco Food Court: 1 meal
    {
      id: 'meal-seed-17',
      date: d(13, 13, 40),
      choiceId: 'costco',
      displayName: 'Costco Food Court',
      restaurantBrand: 'Costco',
      isGenericCategory: false,
      location: 'Costco Wholesale Main',
      specificFoodItem: 'Whole Pepperoni Pizza Slice',
      appetiteState: 'Hungry / Big Meal',
      source: 'main_wheel',
      createdAt: d(13, 13, 40),
      updatedAt: d(13, 13, 40),
    },

    // Flame Broiler: 1 meal
    {
      id: 'meal-seed-18',
      date: d(15, 18, 20),
      choiceId: 'flame-broiler',
      displayName: 'Flame Broiler',
      restaurantBrand: 'Flame Broiler',
      isGenericCategory: false,
      location: 'Business Park East',
      specificFoodItem: 'The Works Bowl (Beef & Chicken)',
      appetiteState: 'Hungry / Big Meal',
      source: 'manual',
      createdAt: d(15, 18, 20),
      updatedAt: d(15, 18, 20),
    },

    // Older meals >30 days ago (Historical records that should NOT count toward rolling 30-day fatigue)
    {
      id: 'meal-seed-old-1',
      date: d(38, 12, 0),
      choiceId: 'mcdonalds',
      displayName: "McDonald's",
      restaurantBrand: "McDonald's",
      isGenericCategory: false,
      location: 'Downtown 4th St',
      specificFoodItem: 'Big Mac',
      appetiteState: 'Moderate Appetite',
      source: 'manual',
      notes: 'Older meal >30 days ago',
      createdAt: d(38, 12, 0),
      updatedAt: d(38, 12, 0),
    },
    {
      id: 'meal-seed-old-2',
      date: d(45, 19, 0),
      choiceId: 'tacos-los-cholos',
      displayName: 'Tacos Los Cholos',
      restaurantBrand: 'Tacos Los Cholos',
      isGenericCategory: false,
      location: 'Anaheim Flagship',
      specificFoodItem: 'Prime Ribeye Taco',
      appetiteState: 'Hungry / Big Meal',
      source: 'manual',
      notes: 'Older meal >30 days ago',
      createdAt: d(45, 19, 0),
      updatedAt: d(45, 19, 0),
    },
  ];

  return sampleMeals;
}
