import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FoodItemHierarchy, FatigueStatus, WheelSession, DecisionSource } from '../types/food';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  RotateCw,
  Sparkles,
  ShieldAlert,
  Check,
  RefreshCw,
  Unlock,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';

interface RouletteWheelProps {
  foodList: FoodItemHierarchy[];
  fatigueStatuses: Map<string, FatigueStatus>;
  onLockIn: (item: FoodItemHierarchy, source: DecisionSource, wheelSessionId: string) => void;
  onRejectResult: (item: FoodItemHierarchy, session: WheelSession) => void;
  onTriggerFatigueWarning: (item: FoodItemHierarchy) => void;
  onOverrideCraving: (item: FoodItemHierarchy, reason?: string) => void;
  onWheelLandChoice: (item: FoodItemHierarchy, sessionId: string) => void;
  soundEnabled: boolean;
  fatigueThreshold: number;
  maxExclusionDays: number;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  foodList,
  fatigueStatuses,
  onLockIn,
  onRejectResult,
  onTriggerFatigueWarning,
  onOverrideCraving,
  onWheelLandChoice,
  soundEnabled,
  fatigueThreshold,
  maxExclusionDays,
}) => {
  const [wheelMode, setWheelMode] = useState<'main_wheel' | 'top_three_wheel'>('main_wheel');
  const [cuisineFilter, setCuisineFilter] = useState<string>('all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0); // in radians
  const [selectedResult, setSelectedResult] = useState<FoodItemHierarchy | null>(null);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [includeFatiguedOverride, setIncludeFatiguedOverride] = useState(false);

  // Top-three selected IDs
  const [topThreeList, setTopThreeList] = useState<FoodItemHierarchy[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSoundTickAngleRef = useRef(0);

  // 2 categories requested: Fast Food (15) and Restaurant (8)
  const availableCategories: ('all' | 'Fast Food' | 'Restaurant')[] = ['all', 'Fast Food', 'Restaurant'];

  // Identify all fatigued items subject to 5-day max cooldown
  const fatiguedItems = useMemo(() => {
    return foodList.filter((item) => {
      const key = item.brand && !item.isGenericCategory
        ? `brand:${item.brand.toLowerCase().trim()}`
        : `generic:${item.id.toLowerCase().trim()}`;
      return fatigueStatuses.get(key)?.isFatigued;
    });
  }, [foodList, fatigueStatuses]);

  // Filter items by fatigue + cuisine
  const activeWheelItems: FoodItemHierarchy[] = useMemo(() => {
    let list = foodList;

    // Apply 5-day max fatigue exclusions
    if (!includeFatiguedOverride) {
      list = list.filter((item) => {
        const key = item.brand && !item.isGenericCategory
          ? `brand:${item.brand.toLowerCase().trim()}`
          : `generic:${item.id.toLowerCase().trim()}`;
        return !fatigueStatuses.get(key)?.isFatigued;
      });
    }

    // Apply 2-category filter: Fast Food vs Restaurant
    if (cuisineFilter !== 'all') {
      list = list.filter((item) => item.category === cuisineFilter);
    }

    if (wheelMode === 'top_three_wheel') {
      if (topThreeList.length === 3 && topThreeList.every(t => list.some(l => l.id === t.id))) {
        return topThreeList;
      }
      const shuffled = [...list].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(3, shuffled.length));
    }

    return list;
  }, [foodList, fatigueStatuses, includeFatiguedOverride, cuisineFilter, wheelMode, topThreeList]);

  // Refresh Top-Three selection
  const refreshTopThree = useCallback(() => {
    let eligible = foodList;
    if (!includeFatiguedOverride) {
      eligible = foodList.filter((item) => {
        const key = item.brand && !item.isGenericCategory
          ? `brand:${item.brand.toLowerCase().trim()}`
          : `generic:${item.id.toLowerCase().trim()}`;
        return !fatigueStatuses.get(key)?.isFatigued;
      });
    }
    if (cuisineFilter !== 'all') {
      eligible = eligible.filter(item => item.category === cuisineFilter);
    }
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    setTopThreeList(shuffled.slice(0, Math.min(3, shuffled.length)));
    setSelectedResult(null);
  }, [foodList, fatigueStatuses, includeFatiguedOverride, cuisineFilter]);

  useEffect(() => {
    if (wheelMode === 'top_three_wheel' && topThreeList.length < 3) {
      refreshTopThree();
    }
  }, [wheelMode, topThreeList.length, refreshTopThree]);

  // Render high-contrast crisp Canvas Wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 500;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 18;
    const items = activeWheelItems;
    const numSlices = items.length;

    ctx.clearRect(0, 0, size, size);

    if (numSlices === 0) {
      ctx.fillStyle = '#112F21';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2A5039';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#C5A66A';
      ctx.font = '700 15px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No restaurants match this filter', centerX, centerY - 10);
      ctx.font = '400 12px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#A8B5A0';
      ctx.fillText('Reset cuisine filter or override 5-day exclusion', centerX, centerY + 14);
      return;
    }

    const arcSize = (Math.PI * 2) / numSlices;

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const item = items[i];
      const startAngle = currentRotation + i * arcSize;
      const endAngle = startAngle + arcSize;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const isAlt = i % 2 === 0;
      const key = item.brand && !item.isGenericCategory
        ? `brand:${item.brand.toLowerCase().trim()}`
        : `generic:${item.id.toLowerCase().trim()}`;
      const isItemFatigued = fatigueStatuses.get(key)?.isFatigued;

      if (isItemFatigued) {
        ctx.fillStyle = isAlt ? '#2C3A30' : '#24312A';
      } else {
        // Subtle deep alternating surfaces with slight saturation for luxury feel
        ctx.fillStyle = isAlt ? '#1F4A34' : '#183D2B';
      }
      ctx.fill();

      // Hairline wedge border
      ctx.strokeStyle = '#3B6049';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw label inside slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arcSize / 2);

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      if (numSlices <= 6) {
        ctx.font = '700 15px Plus Jakarta Sans, sans-serif';
      } else if (numSlices <= 12) {
        ctx.font = '600 12.5px Plus Jakarta Sans, sans-serif';
      } else {
        ctx.font = '600 10.5px Plus Jakarta Sans, sans-serif';
      }

      ctx.fillStyle = isItemFatigued ? '#637A69' : '#F5F0E6';

      const maxTextWidth = radius - 55;
      let label = item.name;
      if (ctx.measureText(label).width > maxTextWidth) {
        while (ctx.measureText(label + '…').width > maxTextWidth && label.length > 2) {
          label = label.slice(0, -1);
        }
        label += '…';
      }

      ctx.fillText(label, radius - 24, 0);

      // Category color pip
      ctx.beginPath();
      ctx.arc(radius - 10, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = isItemFatigued ? '#ef4444' : (item.color || '#C5A66A');
      ctx.fill();

      ctx.restore();
    }

    // Outer wheel border & gold rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#C5A66A';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center metallic hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#112F21';
    ctx.fill();
    ctx.strokeStyle = '#C5A66A';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.fillStyle = '#F5F0E6';
    ctx.font = '800 12px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY - 1);

    ctx.fillStyle = '#C5A66A';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillText(`${numSlices} CHOICES`, centerX, centerY + 13);
  }, [activeWheelItems, currentRotation, fatigueStatuses]);

  // Spin calculation and animation
  const spinWheel = useCallback(() => {
    if (isSpinning || activeWheelItems.length === 0) return;

    setIsSpinning(true);
    setSelectedResult(null);

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setLastSessionId(sessionId);

    const totalSlices = activeWheelItems.length;
    const targetIndex = Math.floor(Math.random() * totalSlices);
    const sliceAngle = (Math.PI * 2) / totalSlices;

    const extraRotations = (5 + Math.floor(Math.random() * 3)) * (Math.PI * 2);
    const pointerAngle = (3 * Math.PI) / 2;
    const targetSliceCenter = targetIndex * sliceAngle + sliceAngle / 2;

    const currentRotMod = currentRotation % (Math.PI * 2);
    let delta = (pointerAngle - targetSliceCenter - currentRotMod);
    while (delta < 0) {
      delta += Math.PI * 2;
    }
    const finalRotation = currentRotation + extraRotations + delta;

    const startRot = currentRotation;
    const totalDelta = finalRotation - startRot;
    const duration = 4400; // ms
    const startTime = performance.now();
    lastSoundTickAngleRef.current = startRot;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth custom ease-out curve
      const ease = 1 - Math.pow(1 - progress, 3.8);
      const newRot = startRot + totalDelta * ease;
      setCurrentRotation(newRot);

      if (soundEnabled) {
        const tickThreshold = sliceAngle;
        if (Math.abs(newRot - lastSoundTickAngleRef.current) >= tickThreshold) {
          soundEffects.playTick(1 + progress * 0.35);
          lastSoundTickAngleRef.current = newRot;
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const chosen = activeWheelItems[targetIndex];
        setSelectedResult(chosen);

        if (soundEnabled) {
          soundEffects.playFanfare();
        }

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C5A66A', '#F5F0E6', '#A8B5A0', '#183D2B'],
        });

        // Trigger fun fact pop-up for Brianna!
        onWheelLandChoice(chosen, sessionId);

        const key = chosen.brand && !chosen.isGenericCategory
          ? `brand:${chosen.brand.toLowerCase().trim()}`
          : `generic:${chosen.id.toLowerCase().trim()}`;
        const status = fatigueStatuses.get(key);
        if (status && status.isFatigued) {
          onTriggerFatigueWarning(chosen);
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isSpinning, activeWheelItems, currentRotation, soundEnabled, fatigueStatuses, onTriggerFatigueWarning, onWheelLandChoice]);

  // Keyboard shortcut: Space to Spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpinning && e.target === document.body) {
        e.preventDefault();
        spinWheel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spinWheel, isSpinning]);

  const handleLockInClick = () => {
    if (!selectedResult || !lastSessionId) return;
    onLockIn(selectedResult, wheelMode, lastSessionId);
  };

  const handleRejectClick = () => {
    if (!selectedResult || !lastSessionId) return;
    const session: WheelSession = {
      id: lastSessionId,
      timestamp: new Date().toISOString(),
      mode: wheelMode,
      selectedChoiceId: selectedResult.id,
      selectedName: selectedResult.name,
      topThreeIds: wheelMode === 'top_three_wheel' ? topThreeList.map((t) => t.id) : undefined,
      status: 'rejected',
      rejectionReason: 'User rejected wheel selection',
    };
    onRejectResult(selectedResult, session);
    setSelectedResult(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Mode Controls & Quick Cuisine Filters UX */}
      <div className="w-full max-w-xl flex flex-col items-center gap-3 mb-5">
        <div className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              setWheelMode('main_wheel');
              setSelectedResult(null);
            }}
            disabled={isSpinning}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              wheelMode === 'main_wheel'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Eligible ({activeWheelItems.length} Options)
          </button>
          <button
            onClick={() => {
              setWheelMode('top_three_wheel');
              setSelectedResult(null);
            }}
            disabled={isSpinning}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              wheelMode === 'top_three_wheel'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Top 3 Curated
          </button>
        </div>

        {/* Cuisine Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 px-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 shrink-0 mr-1" />
          {availableCategories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCuisineFilter(c);
                setSelectedResult(null);
              }}
              disabled={isSpinning}
              className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                cuisineFilter === c
                  ? 'bg-amber-400 text-neutral-950 shadow-md scale-102'
                  : 'bg-neutral-950 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              {c === 'all'
                ? 'All Spots (23)'
                : c === 'Fast Food'
                ? '🍔 Fast Food (15)'
                : '🍽️ Restaurant (8)'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Strong 5-Day Cooldown Bar UX */}
      {fatiguedItems.length > 0 && (
        <div className="w-full max-w-xl mb-5 p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-white">
                5-Day Food Fatigue Cooldown ({fatiguedItems.length} excluded)
              </span>
            </div>
            <button
              onClick={() => setIncludeFatiguedOverride(!includeFatiguedOverride)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline cursor-pointer"
            >
              {includeFatiguedOverride ? 'Hide Excluded' : 'Show All in Wheel'}
            </button>
          </div>

          {/* List of Cooling Down Items with Mini Progress Bar & 1-Click Unlock */}
          <div className="space-y-1.5 pt-1">
            {fatiguedItems.map((item) => {
              const key = item.brand && !item.isGenericCategory
                ? `brand:${item.brand.toLowerCase().trim()}`
                : `generic:${item.id.toLowerCase().trim()}`;
              const s = fatigueStatuses.get(key);
              const daysLeft = s?.daysUntilNextRecovery ?? 5;
              const daysCompleted = Math.max(0, maxExclusionDays - daysLeft);

              return (
                <div
                  key={item.id}
                  className="px-2.5 py-1.5 bg-neutral-950 border border-neutral-800/80 rounded-lg flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      (Day {daysCompleted + 1} of {maxExclusionDays} max)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      {daysLeft}d left
                    </span>
                    <button
                      onClick={() => onOverrideCraving(item, 'Craving override from wheel')}
                      className="px-2 py-0.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded flex items-center gap-1 cursor-pointer"
                      title="Override 5-day exclusion for this craving"
                    >
                      <Unlock className="w-3 h-3" />
                      Unlock
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Wheel Container with Tactile Pointer & Spacebar Hint */}
      <div className="relative flex flex-col items-center justify-center p-2">
        {/* Pointer with Amber Glow */}
        <div className="absolute top-0 z-20 flex flex-col items-center pointer-events-none transform -translate-y-1 drop-shadow-lg">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-amber-400" />
        </div>

        {/* Wheel Canvas */}
        <div className="relative rounded-full shadow-2xl p-1 bg-neutral-950 border border-neutral-800">
          <canvas
            ref={canvasRef}
            className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] rounded-full cursor-pointer transition-transform duration-100"
            onClick={!isSpinning ? spinWheel : undefined}
          />
        </div>

        {/* Spin CTA Button */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <button
            onClick={spinWheel}
            disabled={isSpinning || activeWheelItems.length === 0}
            className="px-9 py-4 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-extrabold text-base rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 active:scale-98 flex items-center gap-2.5 cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            {isSpinning ? 'Deciding Your Meal…' : 'Spin the Wheel'}
          </button>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <span>Or press</span>
            <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-[10px] text-neutral-400">
              Space
            </kbd>
            <span>to spin</span>
          </div>

          {wheelMode === 'top_three_wheel' && !isSpinning && (
            <button
              onClick={refreshTopThree}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors mt-0.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Re-roll Top 3 Selection
            </button>
          )}
        </div>
      </div>

      {/* 4. Winning Result Card with High-Impact UX */}
      {selectedResult && !isSpinning && (
        <div className="w-full max-w-xl mt-8 p-6 bg-neutral-950 border border-amber-500/60 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  Roulette Selected
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1 tracking-tight">
                {selectedResult.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                {selectedResult.cuisine}
                {selectedResult.brand && !selectedResult.isGenericCategory && ` · Brand: ${selectedResult.brand}`}
                {selectedResult.isGenericCategory && ' · Generic Food Choice'}
              </p>
            </div>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-700"
              style={{ backgroundColor: `${selectedResult.color}25` }}
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: selectedResult.color }}
              />
            </div>
          </div>

          {/* Quick Menu Item Suggestions Preview */}
          {selectedResult.defaultItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-900">
              <span className="text-[11px] text-neutral-500 block mb-1.5">
                Popular Menu Items at this spot:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedResult.defaultItems.slice(0, 3).map((dish) => (
                  <span
                    key={dish}
                    className="px-2 py-0.5 text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-md"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleLockInClick}
              className="w-full sm:flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Lock It In
            </button>
            <button
              onClick={() => onWheelLandChoice(selectedResult, lastSessionId || `session-${Date.now()}`)}
              className="w-full sm:w-auto py-3 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-semibold border border-neutral-800 hover:border-amber-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Show fun trivia facts for this spot"
            >
              💡 Fun Trivia
            </button>
            <button
              onClick={handleRejectClick}
              className="w-full sm:w-auto py-3 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs border border-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Pass / Spin Again
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 text-center mt-3">
            Wheel decisions stay isolated until confirmed. Nothing counts toward fatigue automatically.
          </p>
        </div>
      )}
    </div>
  );
};
