import React from 'react';
import { MealRecord, FatigueStatus, FoodItemHierarchy, AppSettings } from '../types/food';
import { THIRTY_DAYS_MS } from '../utils/fatigueEngine';
import { Building2, Utensils, Globe, AlertTriangle, ShieldX, Clock } from 'lucide-react';

interface DashboardViewProps {
  confirmedMeals: MealRecord[];
  fatigueStatuses: Map<string, FatigueStatus>;
  foodList: FoodItemHierarchy[];
  settings: AppSettings;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  confirmedMeals,
  fatigueStatuses,
  foodList,
  settings,
}) => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - THIRTY_DAYS_MS);

  // Filter 30-day window meals for rolling statistics
  const windowMeals = confirmedMeals.filter((m) => {
    const mealDate = new Date(m.date);
    return mealDate >= windowStart && mealDate <= now;
  });

  // 1. Most frequently visited restaurant brands
  const brandCounts = new Map<string, { count: number; totalCount: number; name: string }>();
  // 2. Most frequently eaten specific food items (when recorded)
  const itemCounts = new Map<string, { count: number; parentBrand: string | null; name: string }>();
  // 3. Fast Food vs Restaurant Category Breakdown & Cuisines
  const categoryCounts = { 'Fast Food': 0, 'Restaurant': 0 };
  const cuisineCounts = new Map<string, number>();

  for (const meal of windowMeals) {
    // Brand frequency
    if (meal.restaurantBrand && !meal.isGenericCategory) {
      const bKey = meal.restaurantBrand;
      const cur = brandCounts.get(bKey) || { count: 0, totalCount: 0, name: bKey };
      cur.count++;
      brandCounts.set(bKey, cur);
    }

    // Food item frequency
    if (meal.specificFoodItem && meal.specificFoodItem.trim().length > 0) {
      const itemKey = `${meal.specificFoodItem.trim()} (${meal.restaurantBrand || meal.displayName})`;
      const cur = itemCounts.get(itemKey) || {
        count: 0,
        parentBrand: meal.restaurantBrand || meal.displayName,
        name: meal.specificFoodItem.trim(),
      };
      cur.count++;
      itemCounts.set(itemKey, cur);
    }

    // Category and Cuisine frequency
    const matchedFood = foodList.find((f) => f.id === meal.choiceId);
    if (matchedFood?.category) {
      categoryCounts[matchedFood.category]++;
    }
    const cuisine = matchedFood?.cuisine || 'General';
    cuisineCounts.set(cuisine, (cuisineCounts.get(cuisine) || 0) + 1);
  }

  // Convert to sorted arrays
  const topBrands = Array.from(brandCounts.values()).sort((a, b) => b.count - a.count);
  const topItems = Array.from(itemCounts.values()).sort((a, b) => b.count - a.count);
  const topCuisines = Array.from(cuisineCounts.entries())
    .map(([cuisine, count]) => ({ cuisine, count }))
    .sort((a, b) => b.count - a.count);

  // 5. Restaurants approaching fatigue threshold (count === threshold - 1)
  const approachingFatigue = Array.from(fatigueStatuses.values())
    .filter((f) => f.isApproaching)
    .sort((a, b) => b.mealsLast30Days - a.mealsLast30Days);

  // 6. Restaurants currently excluded because of food fatigue (count >= threshold)
  const currentlyFatigued = Array.from(fatigueStatuses.values())
    .filter((f) => f.isFatigued)
    .sort((a, b) => (a.daysUntilNextRecovery || 99) - (b.daysUntilNextRecovery || 99));

  // 7. Restaurants becoming eligible again as older meals leave rolling window
  // Look for fatigued or near-fatigued items with meals expiring in next 7 days
  const becomingEligibleSoon = Array.from(fatigueStatuses.values())
    .filter((f) => {
      if (!f.oldestMealInWindowDate) return false;
      const oldestDate = new Date(f.oldestMealInWindowDate);
      const daysOld = (now.getTime() - oldestDate.getTime()) / (24 * 3600 * 1000);
      return daysOld >= 23 && daysOld <= 30; // Between 23 and 30 days old (aging out within 7 days)
    })
    .sort((a, b) => (a.daysUntilNextRecovery || 0) - (b.daysUntilNextRecovery || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            Rolling 30-Day Food Intelligence
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Eating Habits & Fatigue Monitoring
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Tracking {windowMeals.length} confirmed meals in the last 30 days ({confirmedMeals.length} all-time records).
            Fatigue threshold set at <span className="text-amber-400 font-mono font-medium">{settings.fatigueWarningThreshold}</span> meals.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl">
          <div>
            <div className="text-[10px] uppercase text-neutral-500 font-sans">Active Fatigued</div>
            <div className="text-lg font-bold text-red-400 tabular-nums">{currentlyFatigued.length}</div>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div>
            <div className="text-[10px] uppercase text-neutral-500 font-sans">Approaching</div>
            <div className="text-lg font-bold text-amber-400 tabular-nums">{approachingFatigue.length}</div>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div>
            <div className="text-[10px] uppercase text-neutral-500 font-sans">Eligible Items</div>
            <div className="text-lg font-bold text-emerald-400 tabular-nums">
              {foodList.length - currentlyFatigued.length}
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Fatigue Alerts & Threshold Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 6: Restaurants Currently Excluded Due to Fatigue (5 Days Max) */}
        <div className="bg-neutral-900/90 border border-red-500/30 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <ShieldX className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white">
                Restaurants Currently Excluded (5 Days Max Cooldown)
              </h3>
            </div>
            <span className="text-xs font-mono text-red-400 font-semibold">
              {currentlyFatigued.length} Excluded
            </span>
          </div>

          {currentlyFatigued.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 text-center">
              No restaurants currently excluded. All {foodList.length} options are eligible!
            </p>
          ) : (
            <div className="space-y-2.5">
              {currentlyFatigued.map((item) => {
                const maxDays = settings.maxExclusionDays || 5;
                const daysLeft = item.daysUntilNextRecovery ?? maxDays;
                const daysElapsed = Math.max(0, maxDays - daysLeft);

                return (
                  <div
                    key={item.targetKey}
                    className="p-3 bg-neutral-950 border border-red-500/20 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">
                        {item.displayName}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {item.mealsLast30Days} meals in 30d · Cooldown: <span className="text-amber-400 font-mono">Day {daysElapsed + 1} of {maxDays}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-emerald-400 font-mono">
                        {daysLeft} day{daysLeft === 1 ? '' : 's'} left
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        (5-day max cap)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 5: Restaurants Approaching Fatigue Threshold */}
        <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Approaching Fatigue Threshold ({settings.fatigueWarningThreshold - 1} of {settings.fatigueWarningThreshold} meals)
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {approachingFatigue.length} At Risk
            </span>
          </div>

          {approachingFatigue.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 text-center">
              No restaurants currently approaching the warning threshold.
            </p>
          ) : (
            <div className="space-y-2.5">
              {approachingFatigue.map((item) => (
                <div
                  key={item.targetKey}
                  className="p-3 bg-neutral-950 border border-amber-500/20 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.displayName}
                    </div>
                    <div className="text-xs text-amber-300/80 mt-0.5">
                      1 more meal triggers the 30-day fatigue warning!
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-amber-400">
                      {item.mealsLast30Days} meals
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      streak: {item.consecutiveDays} d
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 7: Restaurants Becoming Eligible Again as Older Meals Leave Window */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Restaurants Becoming Eligible Again (Meals Aging Out in Next 7 Days)
            </h3>
          </div>
          <span className="text-xs text-neutral-400">
            Rolling Window Expirations
          </span>
        </div>

        {becomingEligibleSoon.length === 0 ? (
          <p className="text-xs text-neutral-400 py-4 text-center">
            No meals currently near the 30-day cutoff boundary (between 23–30 days old).
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
            {becomingEligibleSoon.map((item) => {
              const oldestDate = item.oldestMealInWindowDate ? new Date(item.oldestMealInWindowDate) : null;
              const daysRemaining = oldestDate
                ? Math.max(1, Math.ceil((oldestDate.getTime() + THIRTY_DAYS_MS - now.getTime()) / (24 * 3600 * 1000)))
                : 7;

              return (
                <div
                  key={item.targetKey}
                  className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-white">
                      {item.displayName}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      Oldest meal date: {oldestDate ? oldestDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'N/A'}
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Aging out in:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      ~{daysRemaining} day{daysRemaining === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3 Distinct Frequency Breakdown Sections with Clear Labels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Restaurant Brand Frequency */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-neutral-200">
            <Building2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Most Visited Brands
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400">
            Combines all meals for each restaurant brand in the last 30 days.
          </p>

          {topBrands.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3">No brand meals in last 30d</p>
          ) : (
            <div className="space-y-2">
              {topBrands.slice(0, 6).map((b, idx) => (
                <div key={b.name} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-mono text-[11px]">{idx + 1}.</span>
                    <span className="text-white font-medium">{b.name}</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {b.count} visit{b.count === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Specific Food Items */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-neutral-200">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Top Specific Food Items
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400">
            Individual menu orders revealing exact food cravings.
          </p>

          {topItems.length === 0 ? (
            <p className="text-xs text-neutral-500 py-3">No specific food items logged</p>
          ) : (
            <div className="space-y-2">
              {topItems.slice(0, 6).map((item, idx) => (
                <div key={`${item.parentBrand}-${item.name}`} className="flex items-center justify-between text-xs py-1">
                  <div className="truncate pr-2">
                    <span className="text-neutral-500 font-mono text-[11px] mr-1.5">{idx + 1}.</span>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[11px] text-neutral-400 block truncate">{item.parentBrand}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold shrink-0 tabular-nums">
                    {item.count} order{item.count === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Fast Food vs Restaurant & Cuisines */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-neutral-200">
            <Globe className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Fast Food vs Restaurant Trends
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400">
            Confirmed meal breakdown between Fast Food and Sit-Down Restaurants.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">🍔 Fast Food</span>
              <span className="text-lg font-bold font-mono text-amber-400">{categoryCounts['Fast Food']}</span>
              <span className="text-[10px] text-neutral-500 block">meals</span>
            </div>
            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">🍽️ Restaurant</span>
              <span className="text-lg font-bold font-mono text-purple-400">{categoryCounts['Restaurant']}</span>
              <span className="text-[10px] text-neutral-500 block">meals</span>
            </div>
          </div>

          {topCuisines.length > 0 && (
            <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Top Cuisines
              </span>
              {topCuisines.slice(0, 4).map((c) => (
                <div key={c.cuisine} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-neutral-300">{c.cuisine}</span>
                  <span className="font-mono text-purple-300 font-bold tabular-nums">
                    {c.count} meal{c.count === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
