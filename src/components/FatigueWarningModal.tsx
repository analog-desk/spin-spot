import React, { useState } from 'react';
import { FoodItemHierarchy, FatigueStatus } from '../types/food';
import { getRecommendedAlternatives } from '../utils/fatigueEngine';
import { ShieldAlert, Sparkles, Check, ArrowRight, Clock, Flame } from 'lucide-react';

interface FatigueWarningModalProps {
  fatiguedItem: FoodItemHierarchy;
  fatigueStatus: FatigueStatus | undefined;
  foodList: FoodItemHierarchy[];
  fatigueStatuses: Map<string, FatigueStatus>;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (item: FoodItemHierarchy) => void;
  onOverrideCraving: (item: FoodItemHierarchy, reason?: string) => void;
}

export const FatigueWarningModal: React.FC<FatigueWarningModalProps> = ({
  fatiguedItem,
  fatigueStatus,
  foodList,
  fatigueStatuses,
  isOpen,
  onClose,
  onSelectAlternative,
  onOverrideCraving,
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideInput, setShowOverrideInput] = useState(false);

  if (!isOpen) return null;

  const mealCount = fatigueStatus?.mealsLast30Days || 4;
  const maxExclusionDays = fatigueStatus?.maxExclusionDays ?? 5;
  const daysUntilNextRecovery = fatigueStatus?.daysUntilNextRecovery ?? maxExclusionDays;
  const daysCompleted = Math.max(0, maxExclusionDays - daysUntilNextRecovery);
  const alternatives = getRecommendedAlternatives(fatiguedItem, foodList, fatigueStatuses, 3);

  const handleConfirmOverride = () => {
    onOverrideCraving(fatiguedItem, overrideReason.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Warning Banner Header with 5-Day Max Cooldown Highlight */}
        <div className="px-6 py-5 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Food Fatigue Warning (5 Days Max Exclusion)
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              “You&apos;ve eaten at this place {mealCount} times in the last 30 days. Let&apos;s switch things up! Want to try something different?”
            </h3>
          </div>
        </div>

        {/* Content & 5-Day Visual Progress */}
        <div className="p-6 space-y-5">
          {/* 5-Day Cooldown Visual Bar */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Exclusion Cooldown Window:
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {daysUntilNextRecovery} day{daysUntilNextRecovery === 1 ? '' : 's'} remaining (5 days max)
              </span>
            </div>

            {/* Visual 5-Day Segment Bar */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {Array.from({ length: maxExclusionDays }).map((_, idx) => {
                const isPassed = idx < daysCompleted;
                const isCurrent = idx === daysCompleted;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`h-2.5 w-full rounded-sm transition-all ${
                        isPassed
                          ? 'bg-amber-500'
                          : isCurrent
                          ? 'bg-amber-400 animate-pulse'
                          : 'bg-neutral-800'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-neutral-500">
                      Day {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-neutral-400 pt-1">
              After a maximum of 5 days, <strong className="text-white">{fatiguedItem.name}</strong> automatically re-enters the wheel, keeping food rotation fresh without lengthy lockouts.
            </p>
          </div>

          {/* Section 1: Recommended Alternatives */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-white">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Recommended Alternatives From Your 23 Options:
            </div>
            <div className="space-y-2">
              {alternatives.map((alt) => {
                const altKey = alt.brand && !alt.isGenericCategory
                  ? `brand:${alt.brand.toLowerCase().trim()}`
                  : `generic:${alt.id.toLowerCase().trim()}`;
                const altStatus = fatigueStatuses.get(altKey);
                return (
                  <button
                    key={alt.id}
                    onClick={() => {
                      onSelectAlternative(alt);
                      onClose();
                    }}
                    className="w-full p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/50 rounded-xl transition-all flex items-center justify-between text-left group cursor-pointer"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                        {alt.name}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {alt.cuisine} · {altStatus?.mealsLast30Days || 0} meals in last 30d
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: "I'm Still Craving This" Override */}
          <div className="pt-2 border-t border-neutral-800">
            {!showOverrideInput ? (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Accept & Pick Someone Else
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverrideInput(true)}
                  className="px-4 py-2 text-xs font-bold text-amber-400 hover:text-neutral-950 hover:bg-amber-400 rounded-lg transition-all border border-amber-500/40 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5" />
                  I&apos;m Still Craving This (Override)
                </button>
              </div>
            ) : (
              <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Confirm Craving Override
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    This overrides the 5-day exclusion and records your craving in your meal history without any penalty.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Optional craving note..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowOverrideInput(false)}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmOverride}
                    className="px-4 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Confirm Craving Override
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
