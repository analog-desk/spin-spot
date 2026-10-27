import React, { useState, useEffect } from 'react';
import { FoodItemHierarchy, MealRecord, AppetiteState, DecisionSource } from '../types/food';
import { X, Check } from 'lucide-react';

interface MealEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => void;
  foodList: FoodItemHierarchy[];
  editingMeal?: MealRecord | null;
}

const APPETITE_OPTIONS: AppetiteState[] = [
  'Moderate Appetite',
  'Hungry / Big Meal',
  'Light / Snack',
  'Specific Craving',
  'Comfort Food',
];

export const MealEditModal: React.FC<MealEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  foodList,
  editingMeal,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>(foodList[0]?.id || 'mcdonalds');
  const [customName, setCustomName] = useState<string>('');
  const [specificFoodItem, setSpecificFoodItem] = useState<string>('');
  const [appetiteState, setAppetiteState] = useState<AppetiteState>('Moderate Appetite');
  const [source, setSource] = useState<DecisionSource>('manual');
  const [notes, setNotes] = useState<string>('');
  const [mealDateTime, setMealDateTime] = useState<string>('');

  useEffect(() => {
    if (editingMeal) {
      setSelectedChoiceId(editingMeal.choiceId);
      setCustomName(editingMeal.displayName);
      setSpecificFoodItem(editingMeal.specificFoodItem || '');
      setAppetiteState(editingMeal.appetiteState);
      setSource(editingMeal.source);
      setNotes(editingMeal.notes || '');

      const d = new Date(editingMeal.date);
      const offset = d.getTimezoneOffset() * 60000;
      setMealDateTime(new Date(d.getTime() - offset).toISOString().slice(0, 16));
    } else {
      setSelectedChoiceId(foodList[0]?.id || 'mcdonalds');
      setCustomName('');
      setSpecificFoodItem('');
      setAppetiteState('Moderate Appetite');
      setSource('manual');
      setNotes('');

      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      setMealDateTime(new Date(now.getTime() - offset).toISOString().slice(0, 16));
    }
  }, [editingMeal, foodList, isOpen]);

  if (!isOpen) return null;

  const currentSelection = foodList.find((f) => f.id === selectedChoiceId) || foodList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCustom = customName.trim().length > 0 && customName.trim() !== currentSelection.name;
    const finalDisplayName = isCustom ? customName.trim() : currentSelection.name;
    const finalBrand = isCustom ? null : currentSelection.brand;
    const finalIsGeneric = isCustom ? false : currentSelection.isGenericCategory;

    onSave(
      {
        date: new Date(mealDateTime).toISOString(),
        choiceId: currentSelection.id,
        displayName: finalDisplayName,
        restaurantBrand: finalBrand,
        isGenericCategory: finalIsGeneric,
        location: null,
        specificFoodItem: specificFoodItem.trim() || null,
        appetiteState,
        source,
        notes: notes.trim() || undefined,
      },
      editingMeal ? editingMeal.id : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {editingMeal ? 'Edit Meal Record' : 'Manual Meal Log'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Restaurant / Food Selection */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 block">
              Restaurant / Food Item
            </label>
            <select
              value={selectedChoiceId}
              onChange={(e) => {
                setSelectedChoiceId(e.target.value);
                const found = foodList.find((f) => f.id === e.target.value);
                if (found) {
                  setCustomName(found.name);
                }
              }}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
            >
              {foodList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.cuisine}) {f.brand ? `· Brand: ${f.brand}` : '· Generic'}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
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

          {/* Specific Food Item */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-300 block">
                Specific Menu Item (Optional)
              </label>
              <span className="text-[10px] text-neutral-500">e.g. Fries, Soup, Big Mac</span>
            </div>
            <input
              type="text"
              value={specificFoodItem}
              onChange={(e) => setSpecificFoodItem(e.target.value)}
              placeholder="e.g. Seasoned Fries"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
            {currentSelection?.defaultItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentSelection.defaultItems.slice(0, 4).map((dish) => (
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



          {/* Appetite State */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 block">
              Appetite State
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

          {/* Decision Source */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 block">
              Decision Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as DecisionSource)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="manual">Manual Entry (Eaten without wheel)</option>
              <option value="main_wheel">Standard Wheel Result</option>
              <option value="top_three_wheel">Top Three Wheel Result</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 block">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Special combo discount"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              {editingMeal ? 'Update Meal' : 'Save Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
