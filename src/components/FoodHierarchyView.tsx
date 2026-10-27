import React, { useState } from 'react';
import { FoodItemHierarchy, FatigueStatus } from '../types/food';
import { Building2, MapPin, Utensils, Info, ShieldAlert, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

interface FoodHierarchyViewProps {
  foodList: FoodItemHierarchy[];
  fatigueStatuses: Map<string, FatigueStatus>;
  onUpdateFoodItem: (item: FoodItemHierarchy) => void;
}

export const FoodHierarchyView: React.FC<FoodHierarchyViewProps> = ({
  foodList,
  fatigueStatuses,
  onUpdateFoodItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<FoodItemHierarchy>(foodList[0] || {} as FoodItemHierarchy);
  const [newLocationInput, setNewLocationInput] = useState('');
  const [newDishInput, setNewDishInput] = useState('');

  const currentKey = selectedItem.brand && !selectedItem.isGenericCategory 
    ? `brand:${selectedItem.brand.toLowerCase().trim()}`
    : `generic:${selectedItem.id.toLowerCase().trim()}`;
  const status = fatigueStatuses.get(currentKey);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationInput.trim()) return;
    const updated = {
      ...selectedItem,
      knownLocations: [...selectedItem.knownLocations, newLocationInput.trim()],
    };
    onUpdateFoodItem(updated);
    setSelectedItem(updated);
    setNewLocationInput('');
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishInput.trim()) return;
    const updated = {
      ...selectedItem,
      defaultItems: [...selectedItem.defaultItems, newDishInput.trim()],
    };
    onUpdateFoodItem(updated);
    setSelectedItem(updated);
    setNewDishInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
          Hierarchical Food Architecture
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
          Restaurant Brand → Location → Food Item
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
          Browse the 23 original entries. Fatigue applies at the <strong>Restaurant Brand</strong> level across all locations.
          Generic entries (e.g. Pho, Thai Street Food) track individually and are never combined into a single fictitious chain brand.
        </p>
      </div>

      {/* 2-Column Split: Item Selector List & Hierarchy Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of 23 original entries */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-3.5 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <span>Original 23 Food Entries</span>
            <span className="font-mono text-amber-400 font-normal">23 Total</span>
          </div>

          <div className="max-h-[640px] overflow-y-auto divide-y divide-neutral-800/80">
            {foodList.map((item) => {
              const itemKey = item.brand && !item.isGenericCategory 
                ? `brand:${item.brand.toLowerCase().trim()}`
                : `generic:${item.id.toLowerCase().trim()}`;
              const s = fatigueStatuses.get(itemKey);
              const isSelected = selectedItem.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-3.5 text-left transition-colors flex items-center justify-between group cursor-pointer ${
                    isSelected ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 bg-neutral-400"
                      />
                      <span className={`text-sm font-bold truncate ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5 truncate pl-4.5">
                      {item.cuisine} · {item.isGenericCategory ? 'Generic Category' : `Brand: ${item.brand}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {s?.isFatigued ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-red-950 text-red-400 border border-red-800/60 rounded">
                        Fatigued ({s.mealsLast30Days})
                      </span>
                    ) : s?.isApproaching ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-amber-950 text-amber-400 border border-amber-800/60 rounded">
                        Near Cap ({s.mealsLast30Days})
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-neutral-500">
                        {s?.mealsLast30Days || 0} in 30d
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 text-neutral-600 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed 3-Level Hierarchy Card */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          {/* Header of selected item */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full bg-neutral-400"
                />
                <h3 className="text-xl font-bold text-white">
                  {selectedItem.name}
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                {selectedItem.description}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-mono block">
                Fatigue Level
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {status?.isFatigued ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Fatigued ({status.mealsLast30Days}/4)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Eligible ({status?.mealsLast30Days || 0}/4)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Level 1: Brand / Category Identity */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Level 1: Brand / Category Identity
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-neutral-500">Parent Restaurant Brand:</span>
                <div className="font-semibold text-white mt-0.5">
                  {selectedItem.brand || <span className="text-neutral-500 italic">None (Generic Food Choice)</span>}
                </div>
              </div>
              <div>
                <span className="text-neutral-500">Category:</span>
                <div className="font-semibold text-white mt-0.5">
                  {selectedItem.category || selectedItem.cuisine}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
              <span>
                {selectedItem.isGenericCategory
                  ? 'Generic food rule: Tracks at the category level unless you record a specific brand. Unrelated pho or ramen restaurants do not share a single brand cap.'
                  : `Brand fatigue rule: All visits across all locations of ${selectedItem.brand} combine toward the 30-day threshold.`}
              </span>
            </div>
          </div>

          {/* Level 2: Known Locations (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                Level 2: Known Locations (Optional)
              </div>
              <span className="text-[11px] text-neutral-500">
                {selectedItem.knownLocations.length} locations on record
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedItem.knownLocations.map((loc) => (
                <div
                  key={loc}
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs"
                >
                  {loc}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddLocation} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add another location (e.g. Airport, Northside)..."
                value={newLocationInput}
                onChange={(e) => setNewLocationInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>
          </div>

          {/* Level 3: Specific Food Items / Menu Dishes (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Utensils className="w-4 h-4" />
                Level 3: Specific Menu Items (Optional)
              </div>
              <span className="text-[11px] text-neutral-500">
                {selectedItem.defaultItems.length} menu items
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedItem.defaultItems.map((dish) => (
                <div
                  key={dish}
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg text-xs"
                >
                  {dish}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddDish} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add custom menu item (e.g. Seasoned Fries, Soup)..."
                value={newDishInput}
                onChange={(e) => setNewDishInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
