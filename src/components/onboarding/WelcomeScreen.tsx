import React from 'react';
import { Target, Zap, Trophy, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#F08A3E] to-[#E17226] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Target className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#F3F4F6] mb-4">
          SweatMint
        </h1>
        <p className="text-xl text-[#CBD5E1] mb-8 leading-relaxed">
          Earn rewards for your fitness journey with AI-powered coaching and community support
        </p>

        {/* Features */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-[#F08A3E]/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#F08A3E]" />
            </div>
            <div>
              <h3 className="text-[#F3F4F6] font-semibold">AI-Powered Coaching</h3>
              <p className="text-[#9CA3AF] text-sm">Personalized recommendations and voice logging</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-[#F08A3E]/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#F08A3E]" />
            </div>
            <div>
              <h3 className="text-[#F3F4F6] font-semibold">Earn Rewards</h3>
              <p className="text-[#9CA3AF] text-sm">Get tokens for completing fitness goals</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 bg-[#F08A3E]/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-[#F08A3E]" />
            </div>
            <div>
              <h3 className="text-[#F3F4F6] font-semibold">Community Support</h3>
              <p className="text-[#9CA3AF] text-sm">Connect with like-minded fitness enthusiasts</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#F08A3E] to-[#E17226] text-white font-semibold py-4 px-6 rounded-2xl hover:from-[#E17226] to-[#D86B1F] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Get Started
        </button>

        <p className="text-[#6B7280] text-sm mt-6">
          Join thousands of users already earning rewards for their fitness journey
        </p>
      </div>
    </div>
  );
};