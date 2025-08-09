@@ .. @@
   const handleMealLogged = (meal: MealLog) => {
     console.log('🍽️ WeightLossToday: Received meal log:', meal);
     
    // Call parent handler first (this will add to store)
     onMealLogged(meal);
     
    // Use the hook to get fresh data for this specific meal type
    const mealTypeCalories = todayMeals
     
     console.log('✅ WeightLossToday: Meal logged successfully');
   };

@@ .. @@
        <MealLogging
          mealType={showMealLogging.mealType}
          targetCalories={mealDistribution[showMealLogging.mealType]}
          currentCalories={getMealCalories(showMealLogging.mealType)}
          onMealLogged={handleMealLogged}
          onClose={() => {
            setShowMealLogging({ show: false, mealType: 'breakfast' });
            // Force refresh when modal closes
            forceUpdate();
          }}
          key={`${showMealLogging.mealType}-${refreshKey}`}
        />
      )}