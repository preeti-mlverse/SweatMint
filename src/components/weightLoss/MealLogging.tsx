@@ .. @@
   const handleSaveMeal = () => {
     if (loggedFoods.length === 0) {
       console.warn('⚠️ No foods to save');
       return;
     }
     
     console.log('🍽️ MealLogging: Saving meal with foods:', loggedFoods);
     
     const meal: MealLog = {
       id: Date.now().toString(),
       goalId: 'weight-loss-goal',
       mealType,
-      loggedDate: new Date(),
+      loggedDate: new Date(), // Ensure this is today's date
       plannedCalories: targetCalories,
       actualCalories: totalCalories,
       foodsConsumed: loggedFoods,
       aiSuggested: false,
       userFollowed: false,
       createdAt: new Date()
     };

     console.log('💾 MealLogging: Final meal object:', meal);
     
     // Save the meal and close modal
     onMealLogged(meal);
-    onClose();
   };