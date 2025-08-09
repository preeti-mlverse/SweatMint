import { GoalType } from '../../types';
import { conversationalAgent, chatWithWeightLossCoach } from '../../services/conversationalAgent';
import { useAppStore } from '../../store/useAppStore';
import { useWeightLossStore } from '../../store/useWeightLossStore';
import { useCardioStore } from '../../store/useCardioStore';

  useEffect(() => {
    setAgentReady(conversationalAgent.isReady());
    initializeConversation();
  }, [goalType]);

    // Get AI response
    setTimeout(async () => {
      try {
        const userId = userProfile?.id || 'anonymous';
        console.log('🤖 Starting AI chat with user:', userId);
        
        if (goalType === 'weight_loss' && weightLossProfile) {
          console.log('🤖 Using conversational agent for weight loss coaching');
          
          const response = await chatWithWeightLossCoach(
            userId,
            message,
            weightLossProfile,
            {
              totalCalories: getTodayCalories(),
              remainingCalories: weightLossProfile.dailyCalorieTarget - getTodayCalories(),
              mealsLogged: getTodayMeals(),
              exerciseCalories: 0,
              waterIntake: 0
            }
          );
          
          console.log('🤖 Conversational agent response received:', {
            hasMessage: !!response.message,
            messageLength: response.message?.length,
            hasActionSuggestions: !!response.actionSuggestions,
            hasTip: !!response.motivationalTip,
            confidence: response.confidence
          });
          
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
            actionSuggestions: response.actionSuggestions,
            motivationalTip: response.motivationalTip
          };

          setMessages(prev => [...prev, aiResponse]);
        } else {
          // For other goals, use simple fallback for now
          console.log('🤖 Using fallback for goal type:', goalType);
          const fallbackResponse = {
            message: `I'm here to help with your ${goalType.replace('_', ' ')} goals! How can I assist you today?`,
            actionSuggestions: ["Get started", "Check progress", "Need motivation"],
            motivationalTip: "Every step forward is progress!"
          };

          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackResponse.message,
            timestamp: new Date(),
            actionSuggestions: fallbackResponse.actionSuggestions,
            motivationalTip: fallbackResponse.motivationalTip
          };

          setMessages(prev => [...prev, aiResponse]);
        }
        
      } catch (error) {
        console.error('🚨 Conversational agent failed:', error);
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now, but I'm still here to help! What would you like to know about your weight loss goals?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    }
    )

  function getInputPlaceholder() {
    const placeholders = {
      weight_loss: "Ask about meals, recipes, cravings, or nutrition...",
      cardio_endurance: "Ask about heart rate, workouts, or endurance...",
      strength_building: "Ask about lifting, exercises, or strength...",
      daily_steps: "Ask about walking, steps, or movement...",
    }
  }