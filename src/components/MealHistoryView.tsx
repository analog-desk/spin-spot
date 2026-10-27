import React, { useState } from 'react';
import { MealRecord } from '../types/food';
import { Search, Edit3, Trash2, Plus, Calendar, Filter } from 'lucide-react';

interface MealHistoryViewProps {
  confirmedMeals: MealRecord[];
  onEditMeal: (meal: MealRecord) => void;
  onDeleteMeal: (mealId: string) => void;
  onOpenAddModal: () => void;
}

export const MealHistoryView: React.FC<MealHistoryViewProps> = ({
  confirmedMeals,
  onEditMeal,
  onDeleteMeal,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'main_wheel' | 'top_three_wheel' | 'manual'>('all');

  const filteredMeals = confirmedMeals.filter((meal) => {
    const matchesSearch =
      meal.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.location && meal.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meal.specificFoodItem && meal.specificFoodItem.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meal.restaurantBrand && meal.restaurantBrand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (meal.notes && meal.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSource = sourceFilter === 'all' || meal.source === sourceFilter;

    return matchesSearch && matchesSource;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            Single Source of Truth
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Confirmed Meal Records
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Only confirmed meals count toward food fatigue, frequency statistics, and eating trends.
            Editing or deleting a meal automatically recalculates all fatigue states.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Log Manual Meal
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by restaurant, dish, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-neutral-500" />
          <div className="flex items-center gap-1 p-0.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'all'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => setSourceFilter('main_wheel')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'main_wheel'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Main Wheel
            </button>
            <button
              onClick={() => setSourceFilter('top_three_wheel')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'top_three_wheel'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Top 3
            </button>
            <button
              onClick={() => setSourceFilter('manual')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                sourceFilter === 'manual'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      {/* Confirmed Meals Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        {filteredMeals.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <Calendar className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-neutral-300">
              No confirmed meals found
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Confirm a wheel spin or click &ldquo;Log Manual Meal&rdquo; to add your first record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Restaurant / Brand</th>
                  <th className="py-3 px-4">Specific Dish</th>
                  <th className="py-3 px-4">Appetite State</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredMeals.map((meal) => {
                  const d = new Date(meal.date);
                  const dateStr = d.toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });
                  const timeStr = d.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={meal.id}
                      className="hover:bg-neutral-800/40 transition-colors group"
                    >
                      {/* Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-neutral-300">
                        <div>{dateStr}</div>
                        <div className="text-[11px] text-neutral-500">{timeStr}</div>
                      </td>

                      {/* Restaurant & Brand */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">
                          {meal.displayName}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {meal.restaurantBrand && !meal.isGenericCategory
                            ? `Brand: ${meal.restaurantBrand}`
                            : 'Generic Food Category'}
                        </div>
                      </td>

                      {/* Specific Dish */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {meal.specificFoodItem ? (
                          <span className="text-emerald-400 font-medium">
                            {meal.specificFoodItem}
                          </span>
                        ) : (
                          <span className="text-neutral-500 italic">Unspecified</span>
                        )}
                      </td>



                      {/* Appetite State */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-300">
                        {meal.appetiteState}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 whitespace-nowrap text-neutral-400">
                        {meal.source === 'main_wheel' && 'Standard Wheel'}
                        {meal.source === 'top_three_wheel' && 'Top 3 Wheel'}
                        {meal.source === 'manual' && 'Manual Entry'}
                        {meal.notes && (
                          <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                            {meal.notes}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditMeal(meal)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                            title="Edit meal"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete meal for ${meal.displayName}? Fatigue statistics will be recalculated immediately.`)) {
                                onDeleteMeal(meal.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                            title="Delete meal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
