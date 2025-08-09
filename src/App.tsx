import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useWeightLossStore } from './store/useWeightLossStore';
import { AuthWrapper } from './components/auth/AuthWrapper';

// Onboarding Components
import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
import { PhoneVerification } from './components/onboarding/PhoneVerification';
import { ProfileSetup } from './components/onboarding/ProfileSetup';
import { GoalSelection } from './components/onboarding/GoalSelection';
import { WeightLossSetup } from './components/weightLoss/WeightLossSetup';
import { DevicePairingScreen } from './components/cardio/DevicePairingScreen';
import { CardioSetup } from './components/cardio/CardioSetup';
import { StrengthDevicePairingScreen } from './components/strength/StrengthDevicePairingScreen';
import { StrengthSetup } from './components/strength/StrengthSetup';
import { SleepDevicePairingScreen } from './components/sleep/SleepDevicePairingScreen';
import { SleepSetup } from './components/sleep/SleepSetup';
import { StepsDevicePairingScreen } from './components/steps/StepsDevicePairingScreen';
import { StepsSetup } from './components/steps/StepsSetup';

// Main App Components
import { MainTabs } from './components/main/MainTabs';
import { TodayTab } from './components/main/TodayTab';
import { ProgressTab } from './components/main/ProgressTab';
import { PlanTab } from './components/main/PlanTab';
import { ProfileTab } from './components/main/ProfileTab';

// Types
import { GoalType, UserProfile, Goal } from './types';
import { WeightLossProfile } from './types/weightLoss';
import { CardioProfile, ConnectedDevice } from './types/cardio';
import { StrengthProfile, EquipmentType } from './types/strength';
import { SleepProfile, ConnectedSleepDevice } from './types/sleep';
import { StepsProfile, ConnectedStepsDevice } from './types/steps';
import { useCardioStore } from './store/useCardioStore';
import { useStrengthStore } from './store/useStrengthStore';
import { useSleepStore } from './store/useSleepStore';
import { useStepsStore } from './store/useStepsStore';

function App() {
  const {
    currentScreen,
    currentTab,
    userProfile,
    goals,
    setCurrentScreen,
    setCurrentTab,
    setUserProfile,
    addGoal
  } = useAppStore();

  const {
    profile: weightLossProfile,
    setProfile: setWeightLossProfile
  } = useWeightLossStore();

  const {
    profile: cardioProfile,
    setProfile: setCardioProfile
  } = useCardioStore();
  
  const {
    profile: strengthProfile,
    setProfile: setStrengthProfile
  } = useStrengthStore();
  
  const {
    profile: sleepProfile,
    setProfile: setSleepProfile
  } = useSleepStore();
  
  const {
    profile: stepsProfile,
    setProfile: setStepsProfile
  } = useStepsStore();

  const [pendingCardioDevices, setPendingCardioDevices] = useState<ConnectedDevice[]>([]);
  const [pendingStrengthEquipment, setPendingStrengthEquipment] = useState<EquipmentType[]>([]);
  const [pendingSleepDevices, setPendingSleepDevices] = useState<ConnectedSleepDevice[]>([]);
  const [pendingStepsDevices, setPendingStepsDevices] = useState<ConnectedStepsDevice[]>([]);

  const handleGetStarted = () => {
    setCurrentScreen('phone');
  };

  const handlePhoneSkip = () => {
    setCurrentScreen('profile');
  };

  const handlePhoneVerified = (phone: string) => {
    setCurrentScreen('profile');
  };

  const handleProfileComplete = (profileData: any) => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      weight: profileData.weight,
      weightUnit: profileData.weightUnit,
      height: profileData.height,
      heightUnit: profileData.heightUnit,
      age: profileData.age,
      gender: profileData.gender,
      selectedGoals: [],
      createdAt: new Date()
    };
    setUserProfile(profile);
    setCurrentScreen('goals');
  };

  const handleGoalsSelected = (selectedGoals: GoalType[]) => {
    const existingGoalTypes = goals.map(goal => goal.type);
    const newGoals = selectedGoals.filter(goalType => !existingGoalTypes.includes(goalType));
    
    if (newGoals.length === 0) {
      setCurrentScreen('main');
      return;
    }

    if (userProfile) {
      setUserProfile({
        ...userProfile,
        selectedGoals: [...userProfile.selectedGoals, ...newGoals]
      });
    } else {
      const profile: UserProfile = {
        id: Date.now().toString(),
        selectedGoals: newGoals,
        weightUnit: 'pounds',
        heightUnit: 'feet',
        createdAt: new Date()
      };
      setUserProfile(profile);
    }

    if (newGoals.includes('weight_loss')) {
      setCurrentScreen('goal-setup');
      return;
    }
    
    if (newGoals.includes('cardio_endurance')) {
      setCurrentScreen('goal-setup');
      return;
    }

    newGoals.forEach((goalType, index) => {
      const goalData = getGoalData(goalType);
      const goal: Goal = {
        id: `goal_${Date.now()}_${index}`,
        type: goalType,
        title: goalData.title,
        description: goalData.description,
        icon: goalData.icon,
        targetValue: goalData.defaultTarget,
        targetTimeframe: 12,
        currentValue: 0,
        isActive: true,
        createdAt: new Date()
      };
      
      addGoal(goal);
    });

    setCurrentScreen('main');
  };

  const handleWeightLossSetupComplete = (profile: WeightLossProfile) => {
    setWeightLossProfile(profile);
    
    const goal: Goal = {
      id: profile.goalId,
      type: 'weight_loss',
      title: 'Weight Loss',
      description: `Lose ${profile.currentWeight - profile.targetWeight}kg`,
      icon: 'target',
      targetValue: profile.targetWeight,
      targetTimeframe: 12,
      currentValue: profile.currentWeight,
      isActive: true,
      createdAt: new Date()
    };
    
    addGoal(goal);
    setCurrentScreen('main');
  };

  const handleCardioDevicesPaired = (devices: ConnectedDevice[]) => {
    setPendingCardioDevices(devices);
  };

  const handleCardioSetupComplete = (profile: CardioProfile) => {
    setCardioProfile(profile);
    
    const goal: Goal = {
      id: profile.goalId,
      type: 'cardio_endurance',
      title: 'Cardio Endurance',
      description: `Improve cardiovascular fitness`,
      icon: 'heart',
      targetValue: 150,
      targetTimeframe: 12,
      currentValue: 0,
      isActive: true,
      createdAt: new Date()
    };
    
    addGoal(goal);
    setCurrentScreen('main');
  };

  const handleStrengthEquipmentSelected = (equipment: EquipmentType[]) => {
    setPendingStrengthEquipment(equipment);
  };

  const handleStrengthSetupComplete = (profile: StrengthProfile) => {
    setStrengthProfile(profile);
    
    const goal: Goal = {
      id: profile.goalId,
      type: 'strength_building',
      title: 'Strength Building',
      description: `Build strength with training`,
      icon: 'dumbbell',
      targetValue: 12,
      targetTimeframe: 12,
      currentValue: 0,
      isActive: true,
      createdAt: new Date()
    };
    
    addGoal(goal);
    setCurrentScreen('main');
  };

  const handleSleepDevicesPaired = (devices: ConnectedSleepDevice[]) => {
    setPendingSleepDevices(devices);
  };

  const handleSleepSetupComplete = (profile: SleepProfile) => {
    setSleepProfile(profile);
    
    const goal: Goal = {
      id: profile.goalId,
      type: 'sleep_tracking',
      title: 'Sleep Tracking',
      description: `Improve sleep quality`,
      icon: 'moon',
      targetValue: profile.targetSleepHours,
      targetTimeframe: 12,
      currentValue: 0,
      isActive: true,
      createdAt: new Date()
    };
    
    addGoal(goal);
    setCurrentScreen('main');
  };

  const handleStepsDevicesPaired = (devices: ConnectedStepsDevice[]) => {
    setPendingStepsDevices(devices);
  };

  const handleStepsSetupComplete = (profile: StepsProfile) => {
    setStepsProfile(profile);
    
    const goal: Goal = {
      id: profile.goalId,
      type: 'daily_steps',
      title: 'Daily Steps',
      description: `Walk ${profile.dailyStepTarget.toLocaleString()} steps daily`,
      icon: 'footprints',
      targetValue: profile.dailyStepTarget,
      targetTimeframe: 12,
      currentValue: 0,
      isActive: true,
      createdAt: new Date()
    };
    
    addGoal(goal);
    setCurrentScreen('main');
  };

  const renderGoalSetup = () => {
    const needsWeightLossSetup = userProfile?.selectedGoals.includes('weight_loss') && !weightLossProfile;
    if (needsWeightLossSetup) {
      return (
        <WeightLossSetup
          onComplete={handleWeightLossSetupComplete}
          userProfile={userProfile}
        />
      );
    }

    const needsCardioSetup = userProfile?.selectedGoals.includes('cardio_endurance') && !cardioProfile;
    if (needsCardioSetup) {
      if (pendingCardioDevices.length === 0) {
        return (
          <DevicePairingScreen
            onComplete={handleCardioDevicesPaired}
            onSkip={() => handleCardioDevicesPaired([])}
          />
        );
      } else {
        return (
          <CardioSetup
            onComplete={handleCardioSetupComplete}
            userProfile={userProfile}
            connectedDevices={pendingCardioDevices}
          />
        );
      }
    }
    
    const needsStrengthSetup = userProfile?.selectedGoals.includes('strength_building') && !strengthProfile;
    if (needsStrengthSetup) {
      if (pendingStrengthEquipment.length === 0) {
        return (
          <StrengthDevicePairingScreen
            onComplete={handleStrengthEquipmentSelected}
            onSkip={() => handleStrengthEquipmentSelected(['bodyweight_only'])}
          />
        );
      } else {
        return (
          <StrengthSetup
            onComplete={handleStrengthSetupComplete}
            userProfile={userProfile}
            availableEquipment={pendingStrengthEquipment}
          />
        );
      }
    }
    
    const needsSleepSetup = userProfile?.selectedGoals.includes('sleep_tracking') && !sleepProfile;
    if (needsSleepSetup) {
      if (pendingSleepDevices.length === 0) {
        return (
          <SleepDevicePairingScreen
            onComplete={handleSleepDevicesPaired}
            onSkip={() => handleSleepDevicesPaired([])}
          />
        );
      } else {
        return (
          <SleepSetup
            onComplete={handleSleepSetupComplete}
            userProfile={userProfile}
            connectedDevices={pendingSleepDevices}
          />
        );
      }
    }
    
    const needsStepsSetup = userProfile?.selectedGoals.includes('daily_steps') && !stepsProfile;
    if (needsStepsSetup) {
      if (pendingStepsDevices.length === 0) {
        return (
          <StepsDevicePairingScreen
            onComplete={handleStepsDevicesPaired}
            onSkip={() => handleStepsDevicesPaired([])}
          />
        );
      } else {
        return (
          <StepsSetup
            onComplete={handleStepsSetupComplete}
            userProfile={userProfile}
            connectedDevices={pendingStepsDevices}
          />
        );
      }
    }

    setCurrentScreen('main');
    return null;
  };

  const getGoalData = (goalType: GoalType) => {
    const goalData = {
      weight_loss: {
        title: 'Weight Loss',
        description: 'Lose weight through calorie tracking and exercise',
        icon: 'target',
        defaultTarget: userProfile?.weightUnit === 'kg' ? 5 : 10
      },
      cardio_endurance: {
        title: 'Cardio Endurance',
        description: 'Build cardiovascular fitness',
        icon: 'heart',
        defaultTarget: 150
      },
      strength_building: {
        title: 'Strength Building',
        description: 'Increase muscle strength',
        icon: 'dumbbell',
        defaultTarget: 12
      },
      daily_steps: {
        title: 'Daily Steps',
        description: 'Stay active with daily step goals',
        icon: 'footprints',
        defaultTarget: 10000
      },
      sleep_tracking: {
        title: 'Sleep Tracking',
        description: 'Improve sleep quality',
        icon: 'moon',
        defaultTarget: 8
      }
    };

    return goalData[goalType];
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      
      case 'phone':
        return (
          <PhoneVerification
            onSkip={handlePhoneSkip}
            onVerified={handlePhoneVerified}
          />
        );
      
      case 'profile':
        return <ProfileSetup onComplete={handleProfileComplete} />;
      
      case 'goals':
        return <GoalSelection onGoalsSelected={handleGoalsSelected} />;
      
      case 'goal-setup':
        return renderGoalSetup();
      
      case 'main':
        return (
          <div className="min-h-screen bg-[#0D1117]">
            {renderMainContent()}
            <MainTabs activeTab={currentTab} onTabChange={setCurrentTab} />
          </div>
        );
      
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  const renderMainContent = () => {
    switch (currentTab) {
      case 'today':
        return <TodayTab />;
      case 'progress':
        return <ProgressTab />;
      case 'plan':
        return <PlanTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <TodayTab />;
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