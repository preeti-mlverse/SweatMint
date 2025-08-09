import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useWeightLossStore } from './store/useWeightLossStore';
import { AuthWrapper } from './components/auth/AuthWrapper';

// Onboarding Components
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { PersonalInfoScreen } from './components/onboarding/PersonalInfoScreen';
import { GoalsScreen } from './components/onboarding/GoalsScreen';
import { ActivityLevelScreen } from './components/onboarding/ActivityLevelScreen';
import { DietaryPreferencesScreen } from './components/onboarding/DietaryPreferencesScreen';
import { HealthConditionsScreen } from './components/onboarding/HealthConditionsScreen';
import { OnboardingComplete } from './components/onboarding/OnboardingComplete';

// Main App Components
import { Dashboard } from './components/dashboard/Dashboard';
import { MealPlanning } from './components/meal-planning/MealPlanning';
import { WorkoutPlanning } from './components/workout-planning/WorkoutPlanning';
import { Progress } from './components/progress/Progress';
import { Settings } from './components/settings/Settings';

function App() {
  const { currentScreen, setCurrentScreen } = useAppStore();
  const { isOnboardingComplete } = useWeightLossStore();

  useEffect(() => {
    if (isOnboardingComplete && currentScreen.startsWith('onboarding')) {
      setCurrentScreen('dashboard');
    }
  }, [isOnboardingComplete, currentScreen, setCurrentScreen]);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'onboarding-welcome':
        return <WelcomeScreen />;
      case 'onboarding-personal-info':
        return <PersonalInfoScreen />;
      case 'onboarding-goals':
        return <GoalsScreen />;
      case 'onboarding-activity-level':
        return <ActivityLevelScreen />;
      case 'onboarding-dietary-preferences':
        return <DietaryPreferencesScreen />;
      case 'onboarding-health-conditions':
        return <HealthConditionsScreen />;
      case 'onboarding-complete':
        return <OnboardingComplete />;
      case 'dashboard':
        return <Dashboard />;
      case 'meal-planning':
        return <MealPlanning />;
      case 'workout-planning':
        return <WorkoutPlanning />;
      case 'progress':
        return <Progress />;
      case 'settings':
        return <Settings />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <AuthWrapper>
      <div className="App">
        {renderCurrentScreen()}
      </div>
    </AuthWrapper>
  );
}

export default App;