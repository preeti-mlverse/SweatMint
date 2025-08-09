import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Sparkles, Target, Heart, Dumbbell, Footprints, Moon, Calendar } from 'lucide-react';
import { GoalType } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useWeightLossStore } from '../../store/useWeightLossStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actionSuggestions?: string[];
  motivationalTip?: string;
}

interface GoalSpecificAIAssistantProps {
  goalType: GoalType;
  onClose: () => void;
  onDataUpdate?: (updates: any) => void;
}

const goalIcons = {
  weight_loss: Target,
  cardio_endurance: Heart,
  strength_building: Dumbbell,
  daily_steps: Footprints,
  sleep_tracking: Moon
};

const goalColors = {
  weight_loss: '#F08A3E',
  cardio_endurance: '#EF4444',
  strength_building: '#EF4444',
  daily_steps: '#10B981',
  sleep_tracking: '#8B5CF6'
};

export const GoalSpecificAIAssistant: React.FC<GoalSpecificAIAssistantProps> = ({
  goalType,
  onClose,
  onDataUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userProfile, goals } = useAppStore();
  const { profile: weightLossProfile, getTodayCalories, getTodayMeals } = useWeightLossStore();

  const Icon = goalIcons[goalType];
  const goalColor = goalColors[goalType];

  useEffect(() => {
    initializeConversation();
  }, [goalType]);

  const initializeConversation = () => {
    const welcomeMessage = getWelcomeMessage();
    setMessages([{
      id: '1',
      role: 'assistant',
      content: welcomeMessage.content,
      timestamp: new Date(),
      actionSuggestions: welcomeMessage.suggestions,
      motivationalTip: welcomeMessage.tip
    }]);
  };

  const getWelcomeMessage = () => {
    switch (goalType) {
      case 'weight_loss':
        const remainingCals = weightLossProfile ? weightLossProfile.dailyCalorieTarget - getTodayCalories() : 0;
        return {
          content: `Hi! I'm your weight loss coach. You have ${remainingCals} calories remaining today. How can I help you stay on track?`,
          suggestions: ["I'm craving something sweet", "What should I eat for dinner?", "I went over my calories", "Suggest a healthy snack"],
          tip: "Small consistent choices lead to big transformations!"
        };
      
      default:
        return {
          content: "Hi! I'm your fitness coach. How can I help you achieve your goals today?",
          suggestions: ["Get started", "Check progress", "Need motivation"],
          tip: "Every day is a new opportunity to grow stronger!"
        };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help with your fitness goals! What would you like to know?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const getGoalTitle = () => {
    const goalTitles = {
      weight_loss: 'Weight Loss Coach',
      cardio_endurance: 'Cardio Coach',
      strength_building: 'Strength Coach',
      daily_steps: 'Walking Coach',
      sleep_tracking: 'Sleep Coach'
    };
    return goalTitles[goalType];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <div className="bg-[#161B22] rounded-t-2xl border border-[#2B3440] w-full max-w-md h-[80vh] flex flex-col">
        <div className="p-4 border-b border-[#2B3440] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: goalColor }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#F3F4F6]">{getGoalTitle()}</h3>
              <p className="text-sm text-[#CBD5E1]">Specialized AI coaching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#2B3440] hover:bg-[#0D1117] rounded-lg flex items-center justify-center text-[#CBD5E1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-[#F08A3E]' : ''
                  }`}
                  style={{ backgroundColor: message.role === 'user' ? '#F08A3E' : goalColor }}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-[#F08A3E] text-white' 
                    : 'bg-[#0D1117] text-[#F3F4F6] border border-[#2B3440]'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {message.role === 'assistant' && message.actionSuggestions && message.actionSuggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs opacity-70">Quick actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.actionSuggestions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(action)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'assistant' && message.motivationalTip && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg border-l-2" style={{ borderColor: goalColor }}>
                      <div className="flex items-center space-x-1 mb-1">
                        <Sparkles className="w-3 h-3" style={{ color: goalColor }} />
                        <span className="text-xs font-medium" style={{ color: goalColor }}>Motivation</span>
                      </div>
                      <p className="text-xs opacity-90">{message.motivationalTip}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {messages.length === 1 && messages[0].actionSuggestions && (
            <div className="space-y-2">
              <p className="text-sm text-[#CBD5E1] text-center">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {messages[0].actionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 bg-[#0D1117] hover:bg-[#2B3440] border border-[#2B3440] text-[#CBD5E1] rounded-lg text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: goalColor }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-[#0D1117] border border-[#2B3440] rounded-2xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#CBD5E1] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#CBD5E1] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#CBD5E1] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[#2B3440]">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
              placeholder="Ask about your fitness goals..."
              className="flex-1 px-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#F08A3E] focus:outline-none"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-3 text-white rounded-xl transition-colors"
              style={{ 
                backgroundColor: goalColor,
                opacity: (!inputMessage.trim() || isTyping) ? 0.5 : 1
              }}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};