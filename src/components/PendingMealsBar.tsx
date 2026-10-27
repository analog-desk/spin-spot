import React from 'react';
import { PendingMeal } from '../types/food';
import { Clock, Check, X, ArrowLeftRight } from 'lucide-react';

interface PendingMealsBarProps {
  pendingMeals: PendingMeal[];
  onConfirmPending: (pending: PendingMeal) => void;
  onChangedMindPending: (pending: PendingMeal) => void;
  onDiscardPending: (pendingId: string) => void;
}

export const PendingMealsBar: React.FC<PendingMealsBarProps> = ({
  pendingMeals,
  onConfirmPending,
  onChangedMindPending,
  onDiscardPending,
}) => {
  if (pendingMeals.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-4">
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">
              Pending Decisions ({pendingMeals.length})
            </span>
          </div>
          <span className="text-[11px] text-neutral-400">
            Pending meals do not count toward food fatigue until confirmed.
          </span>
        </div>

        <div className="space-y-2">
          {pendingMeals.map((pending) => {
            const timeStr = new Date(pending.lockedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dateStr = new Date(pending.lockedAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={pending.id}
                className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {pending.displayName}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {dateStr} at {timeStr}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {pending.cuisine} · Appetite: {pending.appetiteState}
                    {pending.source === 'top_three_wheel' ? ' (Top 3 Wheel)' : ' (Standard Wheel)'}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onConfirmPending(pending)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Confirm
                  </button>
                  <button
                    onClick={() => onChangedMindPending(pending)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    Changed Mind
                  </button>
                  <button
                    onClick={() => onDiscardPending(pending.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                    title="Discard (Rejected result)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
