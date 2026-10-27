import React from 'react';
import { Sliders, Plus, Clock } from 'lucide-react';

export type ActiveTab = 'wheel' | 'dashboard' | 'history' | 'hierarchy' | 'tests';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenLogModal: () => void;
  onOpenSettings: () => void;
  pendingCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenLogModal,
  onOpenSettings,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('wheel')}
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap focus:outline-none"
          >
            Brianna&apos;s Choice ❤️
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('wheel')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'wheel' ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Wheel
          </button>
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'history' ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Meal History
            {pendingCount > 0 && (
              <span className="font-mono text-xs px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('hierarchy')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'hierarchy' ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Food Database
          </button>
          <button
            onClick={() => onSelectTab('tests')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'tests' ? 'text-amber-400 font-semibold' : 'hover:text-neutral-200'
            }`}
          >
            Validation Tests
          </button>
        </nav>

        {/* Zone 3: 1 primary action + settings */}
        <div className="flex items-center gap-3 shrink-0">
          {pendingCount > 0 && (
            <button
              onClick={() => onSelectTab('history')}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-md"
              title="Pending Meals"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{pendingCount}</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Log Meal
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800/80 px-2 py-2 bg-neutral-950 text-xs">
        <button
          onClick={() => onSelectTab('wheel')}
          className={`px-2 py-1 ${activeTab === 'wheel' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          Wheel
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 ${activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`px-2 py-1 ${activeTab === 'history' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          History ({pendingCount})
        </button>
        <button
          onClick={() => onSelectTab('hierarchy')}
          className={`px-2 py-1 ${activeTab === 'hierarchy' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          Database
        </button>
        <button
          onClick={() => onSelectTab('tests')}
          className={`px-2 py-1 ${activeTab === 'tests' ? 'text-amber-400 font-bold' : 'text-neutral-400'}`}
        >
          Tests
        </button>
      </div>
    </header>
  );
};
