import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FoodItemHierarchy,
  MealRecord,
  PendingMeal,
  WheelSession,
  FatigueOverrideRecord,
  AppSettings,
  DecisionSource,
} from './types/food';
import { INITIAL_FOOD_LIST } from './data/initialFoodList';
import {
  loadFoodList,
  saveFoodList,
  loadConfirmedMeals,
  saveConfirmedMeals,
  loadPendingMeals,
  savePendingMeals,
  loadWheelSessions,
  saveWheelSessions,
  loadOverrides,
  saveOverrides,
  loadSettings,
  saveSettings,
  seedRealisticHistory,
  DEFAULT_SETTINGS,
} from './utils/storage';
import { evaluateAllFatigueStatuses } from './utils/fatigueEngine';

import { Navigation, ActiveTab } from './components/Navigation';
import { RouletteWheel } from './components/RouletteWheel';
import { DecisionModal } from './components/DecisionModal';
import { FatigueWarningModal } from './components/FatigueWarningModal';
import { PendingMealsBar } from './components/PendingMealsBar';
import { MealEditModal } from './components/MealEditModal';
import { DashboardView } from './components/DashboardView';
import { MealHistoryView } from './components/MealHistoryView';
import { FoodHierarchyView } from './components/FoodHierarchyView';
import { ValidationTestsView } from './components/ValidationTestsView';
import { SettingsModal } from './components/SettingsModal';
import { FunFactCelebrationModal } from './components/FunFactCelebrationModal';

export default function App() {
  // App state
  const [activeTab, setActiveTab] = useState<ActiveTab>('wheel');
  const [foodList, setFoodList] = useState<FoodItemHierarchy[]>(loadFoodList);
  const [confirmedMeals, setConfirmedMeals] = useState<MealRecord[]>(loadConfirmedMeals);
  const [pendingMeals, setPendingMeals] = useState<PendingMeal[]>(loadPendingMeals);
  const [wheelSessions, setWheelSessions] = useState<WheelSession[]>(loadWheelSessions);
  const [overrides, setOverrides] = useState<FatigueOverrideRecord[]>(loadOverrides);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Modal controls
  const [decisionModalItem, setDecisionModalItem] = useState<{
    item: FoodItemHierarchy;
    source: DecisionSource;
    wheelSessionId: string;
  } | null>(null);

  const [funFactModalData, setFunFactModalData] = useState<{
    item: FoodItemHierarchy;
    sessionId: string;
  } | null>(null);

  const [fatigueWarningItem, setFatigueWarningItem] = useState<FoodItemHierarchy | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealRecord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    saveFoodList(foodList);
  }, [foodList]);

  useEffect(() => {
    saveConfirmedMeals(confirmedMeals);
  }, [confirmedMeals]);

  useEffect(() => {
    savePendingMeals(pendingMeals);
  }, [pendingMeals]);

  useEffect(() => {
    saveWheelSessions(wheelSessions);
  }, [wheelSessions]);

  useEffect(() => {
    saveOverrides(overrides);
  }, [overrides]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Derived fatigue statuses for all items
  const fatigueStatuses = useMemo(() => {
    return evaluateAllFatigueStatuses(foodList, confirmedMeals, settings, new Date());
  }, [foodList, confirmedMeals, settings]);

  // Handlers for wheel interactions
  const handleLockIn = useCallback(
    (item: FoodItemHierarchy, source: DecisionSource, wheelSessionId: string) => {
      // Record wheel session as locked_in
      const session: WheelSession = {
        id: wheelSessionId,
        timestamp: new Date().toISOString(),
        mode: source === 'top_three_wheel' ? 'top_three_wheel' : 'main_wheel',
        selectedChoiceId: item.id,
        selectedName: item.name,
        status: 'locked_in',
      };
      setWheelSessions((prev) => [session, ...prev]);

      // Open decision modal to ask: Yes ate it, Not yet, or Changed my mind
      setDecisionModalItem({ item, source, wheelSessionId });
    },
    []
  );

  const handleRejectResult = useCallback(
    (item: FoodItemHierarchy, session: WheelSession) => {
      // Store session result separately - wheel result must never automatically count as meal
      setWheelSessions((prev) => [session, ...prev]);
    },
    []
  );

  const handleWheelLandChoice = useCallback(
    (item: FoodItemHierarchy, sessionId: string) => {
      setFunFactModalData({ item, sessionId });
    },
    []
  );

  const handleTriggerFatigueWarning = useCallback(
    (item: FoodItemHierarchy) => {
      setFatigueWarningItem(item);
    },
    []
  );

  // Handlers for confirming meals
  const handleConfirmMeal = useCallback(
    (newMealData: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
      const nowIso = new Date().toISOString();
      const newMeal: MealRecord = {
        ...newMealData,
        id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setConfirmedMeals((prev) => [newMeal, ...prev]);
    },
    []
  );

  const handleSavePending = useCallback(
    (pendingData: Omit<PendingMeal, 'id'>) => {
      const newPending: PendingMeal = {
        ...pendingData,
        id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      setPendingMeals((prev) => [newPending, ...prev]);
    },
    []
  );

  // Handlers for pending meals bar
  const handleConfirmPending = useCallback(
    (pending: PendingMeal) => {
      const nowIso = new Date().toISOString();
      const newMeal: MealRecord = {
        id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: pending.lockedAt,
        choiceId: pending.choiceId,
        displayName: pending.displayName,
        restaurantBrand: pending.restaurantBrand,
        isGenericCategory: pending.isGenericCategory,
        location: pending.location || null,
        specificFoodItem: pending.specificFoodItem || null,
        appetiteState: pending.appetiteState,
        source: pending.source,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setConfirmedMeals((prev) => [newMeal, ...prev]);
      setPendingMeals((prev) => prev.filter((p) => p.id !== pending.id));
    },
    []
  );

  const handleChangedMindPending = useCallback(
    (pending: PendingMeal) => {
      const found = foodList.find((f) => f.id === pending.choiceId) || foodList[0];
      setPendingMeals((prev) => prev.filter((p) => p.id !== pending.id));
      setDecisionModalItem({
        item: found,
        source: pending.source,
        wheelSessionId: pending.wheelSessionId || `session-${Date.now()}`,
      });
    },
    [foodList]
  );

  const handleDiscardPending = useCallback((pendingId: string) => {
    setPendingMeals((prev) => prev.filter((p) => p.id !== pendingId));
  }, []);

  // Handlers for editing & deleting meal history
  const handleSaveMealFromModal = useCallback(
    (mealData: Omit<MealRecord, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string) => {
      const nowIso = new Date().toISOString();

      if (existingId) {
        // Edit existing meal -> triggers recalculation
        setConfirmedMeals((prev) =>
          prev.map((m) =>
            m.id === existingId
              ? {
                  ...m,
                  ...mealData,
                  updatedAt: nowIso,
                }
              : m
          )
        );
      } else {
        // Create new manual meal
        const newMeal: MealRecord = {
          ...mealData,
          id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          createdAt: nowIso,
          updatedAt: nowIso,
        };
        setConfirmedMeals((prev) => [newMeal, ...prev]);
      }

      setEditingMeal(null);
    },
    []
  );

  const handleDeleteMeal = useCallback((mealId: string) => {
    setConfirmedMeals((prev) => prev.filter((m) => m.id !== mealId));
  }, []);

  // Handlers for fatigue override
  const handleOverrideCraving = useCallback(
    (fatiguedItem: FoodItemHierarchy, reason?: string) => {
      const key =
        fatiguedItem.brand && !fatiguedItem.isGenericCategory
          ? `brand:${fatiguedItem.brand.toLowerCase().trim()}`
          : `generic:${fatiguedItem.id.toLowerCase().trim()}`;
      const status = fatigueStatuses.get(key);

      const overrideRecord: FatigueOverrideRecord = {
        id: `override-${Date.now()}`,
        timestamp: new Date().toISOString(),
        targetKey: key,
        displayName: fatiguedItem.name,
        mealsCountAtTime: status?.mealsLast30Days || 4,
        reason,
      };

      setOverrides((prev) => [overrideRecord, ...prev]);

      // Automatically open decision modal to lock in or confirm this craving meal
      setDecisionModalItem({
        item: fatiguedItem,
        source: 'main_wheel',
        wheelSessionId: `override-spin-${Date.now()}`,
      });
    },
    [fatigueStatuses]
  );

  const handleUpdateFoodItem = useCallback((updated: FoodItemHierarchy) => {
    setFoodList((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }, []);

  const handleSeedSampleData = useCallback(() => {
    const seeded = seedRealisticHistory();
    setConfirmedMeals(seeded);
    saveConfirmedMeals(seeded);
  }, []);

  const handleResetAllData = useCallback(() => {
    setFoodList(INITIAL_FOOD_LIST);
    setConfirmedMeals([]);
    setPendingMeals([]);
    setWheelSessions([]);
    setOverrides([]);
    setSettings(DEFAULT_SETTINGS);
    localStorage.clear();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Navigation Top Bar adhering to Top Bar Contract */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLogModal={() => {
          setEditingMeal(null);
          setIsEditModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        pendingCount={pendingMeals.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Pending Meals Alert / Notification Bar */}
        <PendingMealsBar
          pendingMeals={pendingMeals}
          onConfirmPending={handleConfirmPending}
          onChangedMindPending={handleChangedMindPending}
          onDiscardPending={handleDiscardPending}
        />

        {/* Tab 1: Interactive Roulette Wheel */}
        {activeTab === 'wheel' && (
          <div className="py-4 flex flex-col items-center">
            <div className="text-center mb-6 max-w-xl">
              <span className="text-xs uppercase tracking-wider text-rose-400 font-bold flex items-center justify-center gap-1">
                Brianna&apos;s Choice ❤️
              </span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Where should Brianna eat today?
              </h1>
              <p className="text-xs text-neutral-400 mt-1.5">
                Spin between Brianna&apos;s 23 favorite restaurants. Discover fun trivia facts every time the wheel lands, with a 5-day max fatigue cooldown!
              </p>
            </div>

            <RouletteWheel
              foodList={foodList}
              fatigueStatuses={fatigueStatuses}
              onLockIn={handleLockIn}
              onRejectResult={handleRejectResult}
              onTriggerFatigueWarning={handleTriggerFatigueWarning}
              onOverrideCraving={handleOverrideCraving}
              onWheelLandChoice={handleWheelLandChoice}
              soundEnabled={settings.wheelSoundEnabled}
              fatigueThreshold={settings.fatigueWarningThreshold}
              maxExclusionDays={settings.maxExclusionDays || 5}
            />
          </div>
        )}

        {/* Tab 2: Dashboard View */}
        {activeTab === 'dashboard' && (
          <DashboardView
            confirmedMeals={confirmedMeals}
            fatigueStatuses={fatigueStatuses}
            foodList={foodList}
            settings={settings}
          />
        )}

        {/* Tab 3: Confirmed Meal History */}
        {activeTab === 'history' && (
          <MealHistoryView
            confirmedMeals={confirmedMeals}
            onEditMeal={(meal) => {
              setEditingMeal(meal);
              setIsEditModalOpen(true);
            }}
            onDeleteMeal={handleDeleteMeal}
            onOpenAddModal={() => {
              setEditingMeal(null);
              setIsEditModalOpen(true);
            }}
          />
        )}

        {/* Tab 4: Food Hierarchy Database */}
        {activeTab === 'hierarchy' && (
          <FoodHierarchyView
            foodList={foodList}
            fatigueStatuses={fatigueStatuses}
            onUpdateFoodItem={handleUpdateFoodItem}
          />
        )}

        {/* Tab 5: Validation Tests Suite */}
        {activeTab === 'tests' && (
          <ValidationTestsView
            foodList={foodList}
            settings={settings}
          />
        )}
      </main>

      {/* Decision Modal after Lock It In */}
      {decisionModalItem && (
        <DecisionModal
          item={decisionModalItem.item}
          wheelSessionId={decisionModalItem.wheelSessionId}
          source={decisionModalItem.source}
          foodList={foodList}
          isOpen={true}
          onClose={() => setDecisionModalItem(null)}
          onConfirmMeal={handleConfirmMeal}
          onSavePending={handleSavePending}
        />
      )}

      {/* Fatigue Warning Modal */}
      {fatigueWarningItem && (
        <FatigueWarningModal
          fatiguedItem={fatigueWarningItem}
          fatigueStatus={
            fatigueStatuses.get(
              fatigueWarningItem.brand && !fatigueWarningItem.isGenericCategory
                ? `brand:${fatigueWarningItem.brand.toLowerCase().trim()}`
                : `generic:${fatigueWarningItem.id.toLowerCase().trim()}`
            )
          }
          foodList={foodList}
          fatigueStatuses={fatigueStatuses}
          isOpen={true}
          onClose={() => setFatigueWarningItem(null)}
          onSelectAlternative={(alt) => {
            setFatigueWarningItem(null);
            setDecisionModalItem({
              item: alt,
              source: 'main_wheel',
              wheelSessionId: `alt-session-${Date.now()}`,
            });
          }}
          onOverrideCraving={handleOverrideCraving}
        />
      )}

      {/* Manual / Edit Meal Modal */}
      <MealEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMeal(null);
        }}
        onSave={handleSaveMealFromModal}
        foodList={foodList}
        editingMeal={editingMeal}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onSeedSampleData={handleSeedSampleData}
        onResetAllData={handleResetAllData}
      />

      {/* Fun Fact Celebration Modal for Brianna ❤️ */}
      {funFactModalData && (
        <FunFactCelebrationModal
          item={funFactModalData.item}
          isOpen={true}
          onClose={() => setFunFactModalData(null)}
          onLockIn={() => {
            const current = funFactModalData;
            setFunFactModalData(null);
            handleLockIn(current.item, 'main_wheel', current.sessionId);
          }}
          onPassSpinAgain={() => {
            const current = funFactModalData;
            setFunFactModalData(null);
            handleRejectResult(current.item, {
              id: current.sessionId,
              timestamp: new Date().toISOString(),
              mode: 'main_wheel',
              selectedChoiceId: current.item.id,
              selectedName: current.item.name,
              status: 'rejected',
              rejectionReason: 'Pass / Spin Again from trivia card',
            });
          }}
        />
      )}
    </div>
  );
}
