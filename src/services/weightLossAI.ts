interface WeightLossAIConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

interface WeightLossRequest {
  userMessage: string;
  userProfile: {
    currentWeight: number;
    targetWeight: number;
    dailyCalorieTarget: number;
    proteinGoalGrams: number;
    dietaryPreferences: any;
    gender: string;
    activityLevel: string;
  };
  todayData: {
    totalCalories: number;
    remainingCalories: number;
    mealsLogged: any[];
    exerciseCalories: number;
    waterIntake: number;
  };
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface WeightLossAIResponse {
  message: string;
  actionSuggestions?: string[];
  motivationalTip?: string;
  mealRecommendations?: any[];
  exerciseSuggestions?: string[];
}

export class WeightLossAI {
  private config: WeightLossAIConfig;
  private isConfigured: boolean = false;

  constructor(config?: WeightLossAIConfig) {
    this.config = {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-5-mini',
      ...config
    };
    this.isConfigured = !!(this.config.apiKey && 
      this.config.apiKey !== 'your_openai_api_key_here' && 
      this.config.apiKey.length > 20);
    
    if (this.isConfigured) {
      console.log('✅ WeightLossAI: OpenAI GPT-5-mini configured successfully');
      console.log('🔑 WeightLossAI: API key length:', this.config.apiKey.length);
    } else {
      console.warn('⚠️ WeightLossAI: OpenAI API key not found or invalid - using fallback responses');
      console.log('🔑 WeightLossAI: API key value:', this.config.apiKey?.substring(0, 10) + '...');
    }
  }

  configure(config: WeightLossAIConfig) {
    this.config = { ...this.config, ...config };
    this.isConfigured = !!(config.apiKey);
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  async handleWeightLossQuery(request: WeightLossRequest): Promise<WeightLossAIResponse> {
    if (!this.isReady()) {
      console.log('🤖 WeightLossAI: API key not configured, using fallback');
      return this.getFallbackResponse(request);
    }

    console.log('🤖 WeightLossAI: Using GPT-5-mini for query:', request.userMessage);

    try {
      const systemPrompt = this.getSystemPrompt();
      const userPrompt = this.createUserPrompt(request);
      
      console.log('🤖 WeightLossAI: Calling GPT-5-mini...');
      const response = await this.callGPT5Mini(systemPrompt, userPrompt);
      console.log('🤖 WeightLossAI: GPT-5-mini response received');
      return this.parseResponse(response);
    } catch (error) {
      console.error('Weight Loss AI failed:', error);
      return this.getFallbackResponse(request);
    }
  }

  private getSystemPrompt(): string {
    return `## Context

You are a certified nutritionist and fitness coach AI assistant specializing in weight management. Your role is to help users achieve their weight loss goals through intelligent meal planning, calorie tracking, exercise recommendations, and continuous behavioral support. You have access to a comprehensive food database with 500,000+ items, understand portion control, and can provide personalized recommendations based on individual user profiles, preferences, and progress patterns.

## Task

Provide comprehensive weight management assistance including:

1. Real-time calorie tracking and meal logging support
2. Personalized meal recommendations based on remaining calorie budgets
3. Recipe suggestions aligned with dietary preferences and goals
4. Exercise recommendations that complement nutritional choices
5. Continuous feedback and adaptive learning from user interactions
6. Behavioral coaching for sustainable weight loss habits

## Instructions

### Daily Calorie Management

- **Calculate meal distribution**: Breakfast (20-25%), Lunch (30-35%), Dinner (25-30%), Snacks (10-15% total)
- **Track remaining calories** throughout the day and adjust recommendations accordingly
- **Provide real-time adjustments** when users go over or under their targets
- **Consider macronutrient balance**: Aim for adequate protein (0.8-1g per lb body weight), healthy fats (20-35% calories), complex carbs

### Meal Recommendations & Recipes

- **Generate 3 options** for each meal request, varying in preparation time and complexity
- **Include exact calorie counts** and basic macro breakdown for each suggestion
- **Adapt to dietary restrictions**: vegetarian, vegan, gluten-free, keto, Mediterranean, etc.
- **Consider cooking skill level**: Offer quick/easy options alongside more complex recipes
- **Provide ingredient substitutions** when requested

### Voice & Input Processing

- **Parse natural language**: Extract food items, quantities, and preparation methods from casual descriptions
- **Request clarification** when portion sizes or preparation methods are unclear
- **Confirm calorie estimates**: "Got it! Estimating 320 calories for that portion. Sound right?"
- **Learn from corrections**: Adjust future estimates based on user feedback

### Adaptive Learning & Personalization

- **Track food preferences**: Note accepted/rejected suggestions to refine future recommendations
- **Identify patterns**: Meal timing, favorite cuisines, successful adherence strategies
- **Detect behavioral triggers**: Stress eating, social eating, craving patterns
- **Adjust tone and approach** based on user motivation levels and progress

### Exercise Integration

- **Coordinate with meal timing**: Pre/post-workout nutrition recommendations
- **Calculate calorie burn**: Provide exercise suggestions to balance calorie intake
- **Suggest activity-based adjustments**: "Your workout earned 200 calories—add them to dinner or save for tomorrow?"

### Plateau Prevention & Motivation

- **Monitor progress patterns**: Detect weight loss stalls and suggest interventions
- **Provide variety**: Rotate meal suggestions to prevent boredom
- **Offer refeed strategies**: Temporary calorie increases when metabolism adaptation suspected
- **Celebrate achievements**: Acknowledge consistency and milestone progress

### Response Format Guidelines

- **Be conversational and supportive**, not clinical or judgmental
- **Use emojis strategically** to make recommendations more engaging
- **Provide specific, actionable advice** rather than generic tips
- **Ask follow-up questions** to gather more context when needed
- **Maintain encouraging tone** even when users struggle with adherence`;
  }

  private createUserPrompt(request: WeightLossRequest): string {
    const { userMessage, userProfile, todayData, conversationHistory } = request;
    
    return `## User Profile
- Current Weight: ${userProfile.currentWeight}kg
- Target Weight: ${userProfile.targetWeight}kg
- Daily Calorie Target: ${userProfile.dailyCalorieTarget} calories
- Protein Goal: ${userProfile.proteinGoalGrams}g
- Dietary Preference: ${userProfile.dietaryPreferences.type}
- Gender: ${userProfile.gender}
- Activity Level: ${userProfile.activityLevel}
- Allergies: ${userProfile.dietaryPreferences.allergies.join(', ') || 'None'}
- Dislikes: ${userProfile.dietaryPreferences.dislikes.join(', ') || 'None'}

## Today's Progress
- Total Calories Consumed: ${todayData.totalCalories}
- Remaining Calories: ${todayData.remainingCalories}
- Meals Logged: ${todayData.mealsLogged.length}
- Exercise Calories Burned: ${todayData.exerciseCalories}
- Water Intake: ${todayData.waterIntake}ml

## Recent Conversation
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

## Current User Message
"${userMessage}"

Please provide a helpful, personalized response following the system instructions above.`;
  }

  private async callGPT5Mini(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = this.config.apiKey;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      throw new Error('OpenAI API key not configured');
    }
    
    console.log('🤖 Making API call to OpenAI GPT-5-mini...');
    
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🤖 OpenAI API Error:', response.status, errorText);
      let errorMessage = `OpenAI API call failed (${response.status}): ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (e) {
        // If we can't parse the error, just use the status text
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('🤖 OpenAI GPT-5-mini Success:', data.choices[0]?.message?.content?.substring(0, 100) + '...');
    return data.choices[0]?.message?.content || '';
  }

  private parseResponse(response: string): WeightLossAIResponse {
    // Extract action suggestions (lines starting with bullet points)
    const actionLines = response.split('\n').filter(line => 
      line.match(/^[\-\*\•]\s/) || line.match(/^\d+\.\s/)
    );
    
    const actionSuggestions = actionLines.map(line => 
      line.replace(/^[\-\*\•]\s/, '').replace(/^\d+\.\s/, '').trim()
    ).slice(0, 3);

    // Look for motivational content
    const motivationalKeywords = ['remember', 'keep', 'you can', 'great job', 'well done', 'celebrate'];
    const motivationalLine = response.split('\n').find(line => 
      motivationalKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );

    return {
      message: response,
      actionSuggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
      motivationalTip: motivationalLine || undefined
    };
  }

  private getFallbackResponse(request: WeightLossRequest): WeightLossAIResponse {
    const { userMessage, todayData } = request;
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('sweet') || lowerMessage.includes('craving')) {
      return {
        message: `I understand the craving! With ${todayData.remainingCalories} calories remaining, try these satisfying options:\n\n🍓 Greek yogurt with berries (120 cal)\n🍫 1 square dark chocolate (50 cal)\n🍎 Apple with cinnamon (80 cal)\n\nWhich sounds good to you?`,
        actionSuggestions: ["Log your snack choice", "Get more sweet alternatives", "Check meal suggestions"],
        motivationalTip: "Smart choices now lead to lasting results!"
      };
    }

    if (lowerMessage.includes('dinner') || lowerMessage.includes('evening')) {
      return {
        message: `For dinner with ${todayData.remainingCalories} calories remaining:\n\n🥗 Grilled chicken salad (350 cal)\n🍛 Vegetable stir-fry with tofu (320 cal)\n🐟 Baked fish with steamed vegetables (380 cal)\n\nWhich style appeals to you?`,
        actionSuggestions: ["Get recipe details", "Log dinner choice", "Adjust portion sizes"],
        motivationalTip: "Ending the day with a nutritious meal sets you up for success!"
      };
    }

    return {
      message: `You're doing great with your weight loss journey! You have ${todayData.remainingCalories} calories remaining today. How can I help you stay on track?`,
      actionSuggestions: ["Get meal suggestions", "Log your food", "Check progress"],
      motivationalTip: "Consistency is the key to lasting weight loss success!"
    };
  }
}

// Create singleton instance
export const weightLossAI = new WeightLossAI();

// Configuration helper
export const configureWeightLossAI = (config: WeightLossAIConfig) => {
  weightLossAI.configure(config);
};

// Check if Weight Loss AI is ready
export const isWeightLossAIReady = () => weightLossAI.isReady();