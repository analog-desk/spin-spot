import React, { useState, useEffect } from 'react';
import { FoodItemHierarchy } from '../types/food';
import { getFunFactForRestaurant } from '../data/funFacts';
import { Sparkles, Check, RotateCw, Lightbulb, Heart, X, Shuffle } from 'lucide-react';

interface FunFactCelebrationModalProps {
  item: FoodItemHierarchy;
  isOpen: boolean;
  onClose: () => void;
  onLockIn: () => void;
  onPassSpinAgain: () => void;
}

export const FunFactCelebrationModal: React.FC<FunFactCelebrationModalProps> = ({
  item,
  isOpen,
  onClose,
  onLockIn,
  onPassSpinAgain,
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  const [currentFact, setCurrentFact] = useState<string>('');
  const [totalFacts, setTotalFacts] = useState<number>(7);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  useEffect(() => {
    if (item && isOpen) {
      const initial = getFunFactForRestaurant(item.id);
      setCurrentFact(initial.fact);
      setCurrentFactIndex(initial.nextIndex);
      setTotalFacts(initial.totalFacts);
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleNextFact = () => {
    setIsFlipping(true);
    setTimeout(() => {
      const next = getFunFactForRestaurant(item.id, currentFactIndex);
      setCurrentFact(next.fact);
      setCurrentFactIndex(next.nextIndex);
      setIsFlipping(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-neutral-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Playful Header with Hearts & Branding */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Heart className="w-4 h-4 fill-rose-500" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                Brianna&apos;s Choice Picked ❤️
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                {item.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fun Facts Trivia Card */}
        <div className="p-6 space-y-5">
          <div className="relative p-5 bg-neutral-950 border border-amber-500/30 rounded-2xl space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold tracking-wide">
                <Lightbulb className="w-4 h-4 stroke-[2.5]" />
                <span>FUN TRIVIA BITE</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
                Fact {currentFactIndex + 1} of {totalFacts}
              </span>
            </div>

            {/* Fact content with smooth flip animation */}
            <p
              className={`text-sm text-neutral-100 font-medium leading-relaxed transition-opacity duration-150 ${
                isFlipping ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
              }`}
            >
              {currentFact}
            </p>

            {/* Next Fact Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={handleNextFact}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/40 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Another Fun Fact
              </button>
            </div>
          </div>

          {/* Popular Menu Items Preview */}
          {item.defaultItems.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fan-Favorite Items at {item.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.defaultItems.slice(0, 4).map((dish) => (
                  <span
                    key={dish}
                    className="px-2.5 py-1 text-xs bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onLockIn}
              className="w-full sm:flex-1 py-3 px-5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Lock It In
            </button>
            <button
              onClick={onPassSpinAgain}
              className="w-full sm:w-auto py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-xl text-xs border border-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Spin Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
