import { FoodItemHierarchy, MealRecord, FatigueStatus, AppSettings } from '../types/food';

export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Normalizes date to midnight YYYY-MM-DD for accurate consecutive calendar day calculations
 */
export function getCalendarDayKey(dateInput: string | Date): string {
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates consecutive days eating at a restaurant ending at referenceDate or most recent meal.
 * Multiple meals on the same calendar day count only once toward consecutive day streaks!
 */
export function calculateConsecutiveDays(meals: MealRecord[], referenceDate = new Date()): number {
  if (meals.length === 0) return 0;

  // Extract unique calendar days sorted descending
  const uniqueDayKeys = Array.from(
    new Set(meals.map(m => getCalendarDayKey(m.date)))
  ).sort().reverse();

  if (uniqueDayKeys.length === 0) return 0;

  const todayKey = getCalendarDayKey(referenceDate);
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getCalendarDayKey(yesterday);

  // Check if streak is active (either eaten today or yesterday)
  const mostRecentDay = uniqueDayKeys[0];
  if (mostRecentDay !== todayKey && mostRecentDay !== yesterdayKey) {
    return 0; // Streak broken
  }

  let streak = 0;
  let expectedDate = new Date(mostRecentDay);

  for (const dayKey of uniqueDayKeys) {
    const currentDayExpectedKey = getCalendarDayKey(expectedDate);
    if (dayKey === currentDayExpectedKey) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Maps a food item or meal to its fatigue tracking key.
 * Branded restaurants share the parent brand key (e.g. "McDonald's").
 * Generic options (e.g. "Pho", "Thai Street Food") track by their individual ID
 * unless an explicit restaurant brand was recorded on the meal.
 */
export function getFatigueTargetKey(
  foodItem: {
    brand?: string | null;
    restaurantBrand?: string | null;
    isGenericCategory: boolean;
    id?: string;
    choiceId?: string;
    displayName?: string;
    name?: string;
  }
): { key: string; displayName: string; isBrand: boolean } {
  const brand = ('restaurantBrand' in foodItem ? foodItem.restaurantBrand : foodItem.brand) || null;
  const isGeneric = foodItem.isGenericCategory;
  const name = ('name' in foodItem ? foodItem.name : foodItem.displayName) || 'Unknown Food';
  const id = ('id' in foodItem ? foodItem.id : ('choiceId' in foodItem ? foodItem.choiceId : name)) || name;

  if (brand && !isGeneric) {
    return {
      key: `brand:${brand.toLowerCase().trim()}`,
      displayName: brand,
      isBrand: true,
    };
  }

  // Generic food entry or unbranded restaurant
  return {
    key: `generic:${id.toLowerCase().trim()}`,
    displayName: name,
    isBrand: false,
  };
}

/**
 * Evaluates the rolling 30-day fatigue status for all items in the food list based on confirmed meals.
 */
export function evaluateAllFatigueStatuses(
  foodList: FoodItemHierarchy[],
  confirmedMeals: MealRecord[],
  settings: AppSettings,
  referenceDate = new Date()
): Map<string, FatigueStatus> {
  const windowStart = new Date(referenceDate.getTime() - THIRTY_DAYS_MS);
  const statusMap = new Map<string, FatigueStatus>();

  // Filter confirmed meals to the 30-day window
  const windowMeals = confirmedMeals.filter(meal => {
    const mealDate = new Date(meal.date);
    return mealDate >= windowStart && mealDate <= referenceDate;
  });

  // Group meals by fatigue key
  const mealsByKey = new Map<string, MealRecord[]>();
  for (const meal of confirmedMeals) {
    const target = getFatigueTargetKey(meal);
    const existing = mealsByKey.get(target.key) || [];
    existing.push(meal);
    mealsByKey.set(target.key, existing);
  }

  const windowMealsByKey = new Map<string, MealRecord[]>();
  for (const meal of windowMeals) {
    const target = getFatigueTargetKey(meal);
    const existing = windowMealsByKey.get(target.key) || [];
    existing.push(meal);
    windowMealsByKey.set(target.key, existing);
  }

  const threshold = settings.fatigueWarningThreshold; // default 4
  const maxExclusionDays = settings.maxExclusionDays || 5; // default 5 days max

  // Populate statuses for every food option in list
  for (const item of foodList) {
    const target = getFatigueTargetKey(item);
    const key = target.key;
    if (statusMap.has(key)) continue;

    const inWindowMeals = (windowMealsByKey.get(key) || []).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const allMeals = mealsByKey.get(key) || [];
    const count = inWindowMeals.length;

    const consecutiveDays = calculateConsecutiveDays(allMeals, referenceDate);

    let oldestMealInWindowDate: string | null = null;
    let latestMealDate: string | null = null;
    let daysSinceLatestMeal = 0;
    let daysUntilNextRecovery: number | null = null;
    let isFatigued = false;
    let isApproaching = false;

    if (count > 0) {
      oldestMealInWindowDate = inWindowMeals[0].date;
      latestMealDate = inWindowMeals[inWindowMeals.length - 1].date;
      
      const latestTime = new Date(latestMealDate).getTime();
      daysSinceLatestMeal = Math.max(0, (referenceDate.getTime() - latestTime) / (24 * 3600 * 1000));

      if (count >= threshold) {
        // Enforce 5 days max exclusion cap:
        // Cooldown is active for at most maxExclusionDays (5) from the latest meal!
        if (daysSinceLatestMeal < maxExclusionDays) {
          isFatigued = true;
          const daysRemainingBy5DayCap = Math.max(1, Math.ceil(maxExclusionDays - daysSinceLatestMeal));
          
          // Also check when oldest meal leaves 30d window
          const indexToDrop = count - threshold;
          const requiredDropMeal = inWindowMeals[indexToDrop] || inWindowMeals[0];
          const recoveryTime = new Date(requiredDropMeal.date).getTime() + THIRTY_DAYS_MS;
          const diffDays30d = Math.max(1, Math.ceil((recoveryTime - referenceDate.getTime()) / (24 * 3600 * 1000)));

          // Cooldown expires at whichever comes first: 5-day max cap OR 30-day window drop
          daysUntilNextRecovery = Math.min(daysRemainingBy5DayCap, diffDays30d);
        } else {
          // 5-day exclusion has elapsed -> restaurant is restored to eligible!
          isFatigued = false;
          daysUntilNextRecovery = null;
        }
      } else if (count === threshold - 1) {
        isApproaching = true;
      }
    }

    statusMap.set(key, {
      targetKey: key,
      displayName: target.displayName,
      isBrand: target.isBrand,
      mealsLast30Days: count,
      isFatigued,
      isApproaching,
      consecutiveDays,
      oldestMealInWindowDate,
      latestMealDate,
      daysSinceLatestMeal: Math.round(daysSinceLatestMeal * 10) / 10,
      daysUntilNextRecovery,
      maxExclusionDays,
      recentMealDates: inWindowMeals.map(m => m.date),
    });
  }

  return statusMap;
}

/**
 * Returns intelligent alternatives for a fatigued food choice.
 */
export function getRecommendedAlternatives(
  fatiguedItem: FoodItemHierarchy,
  foodList: FoodItemHierarchy[],
  fatigueStatuses: Map<string, FatigueStatus>,
  limit = 4
): FoodItemHierarchy[] {
  const fatiguedKey = getFatigueTargetKey(fatiguedItem).key;

  // Find non-fatigued items
  const eligible = foodList.filter(item => {
    const target = getFatigueTargetKey(item);
    if (target.key === fatiguedKey) return false;
    const status = fatigueStatuses.get(target.key);
    return !status?.isFatigued;
  });

  // Prioritize same/similar cuisine, then lowest recent consumption
  const sorted = [...eligible].sort((a, b) => {
    const sameCuisineA = a.cuisine.toLowerCase().includes(fatiguedItem.cuisine.toLowerCase().split(' ')[0]) ? 1 : 0;
    const sameCuisineB = b.cuisine.toLowerCase().includes(fatiguedItem.cuisine.toLowerCase().split(' ')[0]) ? 1 : 0;

    if (sameCuisineA !== sameCuisineB) return sameCuisineB - sameCuisineA;

    const countA = fatigueStatuses.get(getFatigueTargetKey(a).key)?.mealsLast30Days || 0;
    const countB = fatigueStatuses.get(getFatigueTargetKey(b).key)?.mealsLast30Days || 0;
    return countA - countB;
  });

  return sorted.slice(0, limit);
}
