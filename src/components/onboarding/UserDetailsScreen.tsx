import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, SkipForward } from 'lucide-react';

interface UserDetailsScreenProps {
  onComplete: (details: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  }) => void;
}

export const UserDetailsScreen: React.FC<UserDetailsScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleContinue = () => {
    onComplete({
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      password: password || undefined
    });
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4BE0D1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#F3F4F6] mb-2">
            Personal Details
          </h2>
          <p className="text-[#CBD5E1]">
            Help us personalize your Sweat Mint experience (all fields optional)
          </p>
        </div>

        <div className="bg-[#161B22] rounded-2xl p-6 border border-[#2B3440] space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#F3F4F6] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CBD5E1]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#F3F4F6] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CBD5E1]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#F3F4F6] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CBD5E1]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#F3F4F6] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CBD5E1]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full pl-10 pr-4 py-3 bg-[#0D1117] border border-[#2B3440] rounded-xl text-[#F3F4F6] placeholder-[#CBD5E1] focus:border-[#4BE0D1] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Info Text */}
          <div className="bg-[#4BE0D1]/10 border border-[#4BE0D1]/30 rounded-xl p-3">
            <p className="text-sm text-[#F3F4F6]">
              💡 All fields are optional. You can always add this information later in your profile settings.
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-[#4BE0D1] hover:bg-[#6BD0D2] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full text-[#CBD5E1] font-medium py-3 px-4 rounded-xl hover:bg-[#161B22] transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip for now</span>
          </button>
        </div>
      </div>
    </div>
  );
};