@@ .. @@
 import { goalSpecificAI, isGoalAIReady } from '../../services/goalSpecificAI';
+import { weightLossAI, isWeightLossAIReady } from '../../services/weightLossAI';
 import { useAppStore } from '../../store/useAppStore';
 import { useWeightLossStore } from '../../store/useWeightLossStore';
 import { useCardioStore } from '../../store/useCardioStore';
@@ .. @@
   useEffect(() => {
     setAiConfigured(isGoalAIReady());
+    // For weight loss, check the specialized AI
+    if (goalType === 'weight_loss') {
+      setAiConfigured(isWeightLossAIReady());
+    }
     initializeConversation();
   }, [goalType]);
@@ .. @@
     // Get AI response
     setTimeout(async () => {
       try {
-        const response = await goalSpecificAI.handleGoalSpecificQuery({
-          goalType,
-          userMessage: message,
-          profile: getProfile(),
-          todayData: getTodayData(),
-          conversationHistory: messages.map(m => ({
-            role: m.role,
-            content: m.content
-          }))
-        });
+        let response;
+        
+        if (goalType === 'weight_loss' && weightLossProfile) {
+          // Use specialized weight loss AI
+          response = await weightLossAI.handleWeightLossQuery({
+            userMessage: message,
+            userProfile: {
+              currentWeight: weightLossProfile.currentWeight,
+              targetWeight: weightLossProfile.targetWeight,
+              dailyCalorieTarget: weightLossProfile.dailyCalorieTarget,
+              proteinGoalGrams: weightLossProfile.proteinGoalGrams,
+              dietaryPreferences: weightLossProfile.dietaryPreferences,
+              gender: weightLossProfile.gender,
+              activityLevel: weightLossProfile.activityLevel
+            },
+            todayData: {
+              totalCalories: getTodayCalories(),
+              remainingCalories: weightLossProfile.dailyCalorieTarget - getTodayCalories(),
+              mealsLogged: getTodayMeals(),
+              exerciseCalories: 0, // Would get from exercise logs
+              waterIntake: 0 // Would get from water tracking
+            },
+            conversationHistory: messages.map(m => ({
+              role: m.role,
+              content: m.content
+            }))
+          });
+        } else {
+          // Use general goal-specific AI        }
      }
    }
    )
 for other goals
+          response = await goalSpecificAI.handleGoalSpecificQuery({
+            goalType,
+            userMessage: message,
+            profile: getProfile(),
+            todayData: getTodayData(),
+            conversationHistory: messages.map(m => ({
+              role: m.role,
+              content: m.content
+            }))
+          });
+        }

         const aiResponse: Message = {
@@ .. @@
   function getInputPlaceholder() {
     const placeholders = {
-      weight_loss: "Ask about meals, calories, or nutrition...",
+      weight_loss: "Ask about meals, recipes, cravings, or nutrition...",
       cardio_endurance: "Ask about heart rate, workouts, or endurance...",
       strength_building: "Ask about lifting, exercises, or strength...",
       daily_steps: "Ask about walking, steps, or movement...",