import React from 'react';
import { AppSettings } from '../types/food';
import { X, Volume2, VolumeX, RotateCcw, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onSeedSampleData: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onSeedSampleData,
  onResetAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            App Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* Fatigue Warning Threshold Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white">
                Food Fatigue Warning Threshold
              </label>
              <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                {settings.fatigueWarningThreshold} meals
              </span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Default is 4 meals in 30 days (1–3 allowed without warning; warning triggers on the 4th meal).
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, fatigueWarningThreshold: num })
                  }
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                    settings.fatigueWarningThreshold === num
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Maximum Exclusion Duration Setting (5 Days Max) */}
          <div className="space-y-2 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white">
                Maximum Exclusion Duration
              </label>
              <span className="font-mono text-amber-400 font-bold text-sm tabular-nums">
                {settings.maxExclusionDays || 5} days max
              </span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-relaxed">
              Restaurants are excluded for a maximum of 5 days, automatically restoring to the wheel afterwards.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {[3, 5, 7, 10, 14].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ ...settings, maxExclusionDays: days })
                  }
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors ${
                    (settings.maxExclusionDays || 5) === days
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {days}d{days === 5 ? ' ★' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <div>
              <div className="font-semibold text-white">Wheel Sound Effects</div>
              <div className="text-[11px] text-neutral-400">
                Tactile ticker and landing victory chime
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, wheelSoundEnabled: !settings.wheelSoundEnabled })
              }
              className={`p-2 rounded-lg border transition-colors ${
                settings.wheelSoundEnabled
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
            >
              {settings.wheelSoundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Data Management */}
          <div className="pt-3 border-t border-neutral-800 space-y-2.5">
            <span className="font-semibold text-white block">
              Data Management & Demo Tools
            </span>

            <button
              onClick={() => {
                onSeedSampleData();
                onClose();
              }}
              className="w-full p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left flex items-center gap-2.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-medium text-white">Seed Realistic 30-Day History</div>
                <div className="text-[10px] text-neutral-400">
                  Loads realistic meals with Chipotle fatigued, McDonald&apos;s approaching cap, etc.
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset to initial 23 food entries and clear history?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="w-full p-2.5 bg-neutral-950 hover:bg-red-950/30 border border-neutral-800 hover:border-red-800/50 rounded-lg text-left flex items-center gap-2.5 text-neutral-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <div className="font-medium text-red-400">Reset to Defaults</div>
                <div className="text-[10px] text-neutral-500">
                  Resets to clean 23 options and clears confirmed history.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
