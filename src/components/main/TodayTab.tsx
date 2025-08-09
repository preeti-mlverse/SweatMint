@@ .. @@
   const handleMealLogged = (meal: MealLog) => {
     console.log('📝 TodayTab: Handling meal log:', meal);
     
     const { addMealLog } = useWeightLossStore.getState();
     addMealLog(meal);
     
     console.log('✅ TodayTab: Meal logged to store');
     
-    // Force re-render to update calorie displays
-    setTimeout(() => {
-      window.dispatchEvent(new Event('mealLogged'));
-    }, 100);
+    // Trigger immediate UI update
+    window.dispatchEvent(new Event('mealLogged'));
   };