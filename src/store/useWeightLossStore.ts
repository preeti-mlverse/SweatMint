import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeightLossGoal, MealLog, ExerciseLog, WeightEntry } from '../types/weightLoss';

interface WeightLossState {
  goal: WeightLossGoal | null;
  mealLogs: MealLog[];
  exerciseLogs: ExerciseLog[];
  weightEntries: WeightEntry[];
  dailyCalorieGoal: number;
  dailyCaloriesBurned: number;
  
  // Actions
  setGoal: (goal: WeightLossGoal) => void;
  addMealLog: (meal: MealLog) => void;
  addExerciseLog: (exercise: ExerciseLog) => void;
  addWeightEntry: (weight: WeightEntry) => void;
  updateDailyCalorieGoal: (calories: number) => void;
  getTodayMeals: () => MealLog[];
  getTodayExercises: () => ExerciseLog[];
  getTodayCaloriesConsumed: () => number;
  getTodayCaloriesBurned: () => number;
  getNetCalories: () => number;
}

export const useWeightLossStore = create<WeightLossState>()(
  persist(
    (set, get) => ({
      goal: null,
      mealLogs: [],
      exerciseLogs: [],
      weightEntries: [],
      dailyCalorieGoal: 2000,
      dailyCaloriesBurned: 0,

      setGoal: (goal) => set({ goal }),

      addMealLog: (meal) => set((state) => {
        console.log('🏪 Store: Adding meal log:', {
          id: meal.id,
          mealType: meal.mealType,
          calories: meal.actualCalories,
          foodsCount: meal.foodsConsumed.length,
          loggedDate: meal.loggedDate
        });
        
        const newMealLogs = [...state.mealLogs, meal];
        console.log('🏪 Store: New total meal logs:', newMealLogs.length);
        
        // Immediately verify today's meals after adding
        const today = new Date().toDateString();
        const todayMealsAfterAdd = newMealLogs.filter(m => {
          const mealDate = new Date(m.loggedDate).toDateString();
          return mealDate === today;
        });
        console.log('🏪 Store: Today meals after add:', todayMealsAfterAdd.length);
        
        return {
          mealLogs: newMealLogs
        };
      }),

      addExerciseLog: (exercise) => set((state) => ({
        exerciseLogs: [...state.exerciseLogs, exercise]
      })),

      addWeightEntry: (weight) => set((state) => ({
        weightEntries: [...state.weightEntries, weight]
      })),

      updateDailyCalorieGoal: (calories) => set({ dailyCalorieGoal: calories }),

      getTodayMeals: () => {
        const state = get();
        const today = new Date().toDateString();
        const todayMeals = state.mealLogs.filter(meal => {
          const mealDate = new Date(meal.loggedDate).toDateString();
          return mealDate === today;
        });
        console.log('🏪 Store: getTodayMeals called, found:', todayMeals.length, 'meals');
        return todayMeals;
      },

      getTodayExercises: () => {
        const state = get();
        const today = new Date().toDateString();
        return state.exerciseLogs.filter(exercise => {
          const exerciseDate = new Date(exercise.loggedDate).toDateString();
          return exerciseDate === today;
        });
      },

      getTodayCaloriesConsumed: () => {
        const todayMeals = get().getTodayMeals();
        const totalCalories = todayMeals.reduce((total, meal) => total + meal.actualCalories, 0);
        console.log('🏪 Store: getTodayCaloriesConsumed:', totalCalories, 'from', todayMeals.length, 'meals');
        return totalCalories;
      },

      getTodayCaloriesBurned: () => {
        const todayExercises = get().getTodayExercises();
        return todayExercises.reduce((total, exercise) => total + exercise.caloriesBurned, 0);
      },

      getNetCalories: () => {
        const consumed = get().getTodayCaloriesConsumed();
        const burned = get().getTodayCaloriesBurned();
        return consumed - burned;
      }
    }),
    {
      name: 'weight-loss-storage',
    }
  )
);