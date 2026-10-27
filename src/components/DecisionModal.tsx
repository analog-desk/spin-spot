import React, { useState } from 'react';
import { FoodItemHierarchy, AppetiteState, DecisionSource, MealRecord, PendingMeal } from '../types/food';
import { X, CheckCircle, Clock, ArrowLeftRight, Utensils, Heart } from 'lucide-react';

interface DecisionModalProps {
  item: FoodItemHierarchy;
  wheelSessionId: string;
  source: DecisionSource;
  foodList: FoodItemHierarchy[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmMeal: (meal: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onSavePending: (pending: Omit<PendingMeal, 'id'>) => void;
}

const APPETITE_OPTIONS: AppetiteState[] = [
  'Moderate Appetite',
  'Hungry / Big Meal',
  'Light / Snack',
  'Specific Craving',
  'Comfort Food',
];

export const DecisionModal: React.FC<DecisionModalProps> = ({
  item,
  wheelSessionId,
  source,
  foodList,
  isOpen,
  onClose,
  onConfirmMeal,
  onSavePending,
}) => {
  const [stage, setStage] = useState<'prompt' | 'confirm_details' | 'changed_mind'>('prompt');
  
  // Confirmed details state
  const [appetiteState, setAppetiteState] = useState<AppetiteState>('Moderate Appetite');
  const [specificFoodItem, setSpecificFoodItem] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [mealDateTime, setMealDateTime] = useState<string>(() => {
    // Current local datetime formatted for <input type="datetime-local">
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  });

  // Changed mind state
  const [actualSelectedItem, setActualSelectedItem] = useState<FoodItemHierarchy>(item);
  const [customActualName, setCustomActualName] = useState('');

  if (!isOpen) return null;

  const handleYesAteIt = () => {
    setStage('confirm_details');
  };

  const handleNotYet = () => {
    onSavePending({
      wheelSessionId,
      lockedAt: new Date(mealDateTime).toISOString(),
      choiceId: item.id,
      displayName: item.name,
      restaurantBrand: item.brand,
      isGenericCategory: item.isGenericCategory,
      cuisine: item.cuisine,
      location: null,
      specificFoodItem: specificFoodItem.trim() || null,
      appetiteState,
      source,
    });
    onClose();
  };

  const handleChangedMind = () => {
    setStage('changed_mind');
  };

  const handleSubmitConfirmedMeal = (e: React.FormEvent) => {
    e.preventDefault();

    const targetItem = stage === 'changed_mind' ? actualSelectedItem : item;
    const finalDisplayName = customActualName.trim() || targetItem.name;
    const finalBrand = customActualName.trim() ? null : targetItem.brand;
    const finalIsGeneric = customActualName.trim() ? false : targetItem.isGenericCategory;

    onConfirmMeal({
      date: new Date(mealDateTime).toISOString(),
      choiceId: targetItem.id,
      displayName: finalDisplayName,
      restaurantBrand: finalBrand,
      isGenericCategory: finalIsGeneric,
      location: null,
      specificFoodItem: specificFoodItem.trim() || null,
      appetiteState,
      source,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Lock It In Decision
            </span>
            <h3 className="text-lg font-bold text-white">
              {item.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage 1: The Prompt with 3 Options */}
        {stage === 'prompt' && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-neutral-300">
              Did you end up eating at <strong className="text-white">{item.name}</strong>?
            </p>

            <div className="space-y-2.5">
              <button
                onClick={handleYesAteIt}
                className="w-full p-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 rounded-xl transition-all text-left flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    Yes, I ate it.
                  </div>
                  <div className="text-xs text-neutral-400">
                    Confirm meal, specify optional dish/location, and update fatigue tracking.
                  </div>
                </div>
              </button>

              <button
                onClick={handleNotYet}
                className="w-full p-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 rounded-xl transition-all text-left flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    Not yet.
                  </div>
                  <div className="text-xs text-neutral-400">
                    Save as pending. It won't count toward fatigue stats until confirmed.
                  </div>
                </div>
              </button>

              <button
                onClick={handleChangedMind}
                className="w-full p-4 bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/50 rounded-xl transition-all text-left flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <ArrowLeftRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                    I changed my mind.
                  </div>
                  <div className="text-xs text-neutral-400">
                    Record the restaurant or food item you actually ended up eating instead.
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Stage 2 & 3: Details & Confirmation Form */}
        {(stage === 'confirm_details' || stage === 'changed_mind') && (
          <form onSubmit={handleSubmitConfirmedMeal} className="p-6 space-y-4">
            {stage === 'changed_mind' && (
              <div className="space-y-1.5 p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl">
                <label className="text-xs font-semibold text-amber-400 block">
                  What did you actually eat instead?
                </label>
                <select
                  value={actualSelectedItem.id}
                  onChange={(e) => {
                    const found = foodList.find(f => f.id === e.target.value);
                    if (found) {
                      setActualSelectedItem(found);
                      setSpecificFoodItem('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {foodList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.cuisine})
                    </option>
                  ))}
                </select>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or type unlisted restaurant/food name..."
                    value={customActualName}
                    onChange={(e) => setCustomActualName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500"
                  />
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 block">
                Meal Date & Time
              </label>
              <input
                type="datetime-local"
                value={mealDateTime}
                onChange={(e) => setMealDateTime(e.target.value)}
                required
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Appetite State */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Appetite State at Decision Time
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {APPETITE_OPTIONS.map((state) => (
                  <button
                    type="button"
                    key={state}
                    onClick={() => setAppetiteState(state)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                      appetiteState === state
                        ? 'bg-amber-400 text-neutral-950 font-semibold'
                        : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Specific Food Item */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-400" />
                  Specific Food Item (Optional)
                </label>
                <span className="text-[10px] text-neutral-500">e.g. Fries, Soup, Big Mac</span>
              </div>
              <input
                type="text"
                value={specificFoodItem}
                onChange={(e) => setSpecificFoodItem(e.target.value)}
                placeholder="Leave blank if unknown"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              {/* Quick suggestions from defaults */}
              {(stage === 'changed_mind' ? actualSelectedItem : item).defaultItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(stage === 'changed_mind' ? actualSelectedItem : item).defaultItems.slice(0, 3).map((dish) => (
                    <button
                      type="button"
                      key={dish}
                      onClick={() => setSpecificFoodItem(dish)}
                      className="px-2 py-0.5 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700"
                    >
                      + {dish}
                    </button>
                  ))}
                </div>
              )}
            </div>



            {/* Optional Notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 block">
                Optional Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Great quick lunch with team"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStage('prompt')}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm rounded-lg transition-colors shadow-sm"
              >
                Save Confirmed Meal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
