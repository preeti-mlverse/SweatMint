@@ .. @@
       addMealLog: (meal) => set((state) => {
         console.log('🏪 Store: Adding meal log:', {
           id: meal.id,
           mealType: meal.mealType,
           calories: meal.actualCalories,
           foodsCount: meal.foodsConsumed.length,
           loggedDate: meal.loggedDate
         });
         
-        // Ensure the meal has today's date
-        const mealWithCorrectDate = {
-          ...meal,
-          loggedDate: new Date() // Force today's date
-        };
-        
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