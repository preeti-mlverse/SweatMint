@@ .. @@
  const handleMealLogged = (meal: MealLog) => {
    console.log('🍽️ WeightLossToday: Received meal log:', meal);
    
    // Call parent handler first (this will add to store)
    onMealLogged(meal);
    
    // Force immediate re-render and refresh
    forceUpdate();
    setRefreshKey(prev => prev + 1);
    
    console.log('✅ WeightLossToday: Meal logged successfully');
  };

  // Get today's exercise and weight data
  const { exerciseLogs, weightEntries } = useWeightLossStore();
  
  // Force refresh of today's data when meals are logged
  useEffect(() => {
    const handleRefresh = () => {
      console.log('🔄 WeightLossToday: Refreshing calorie data');
      forceUpdate();
    };
    
    window.addEventListener('mealLogged', handleRefresh);
    return () => window.removeEventListener('mealLogged', handleRefresh);
  }, []);
  
  const todayExercises = exerciseLogs.filter(exercise => {
  }
  )