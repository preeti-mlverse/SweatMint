import { Home, TrendingUp, Calendar, ShoppingBag, Users, User } from 'lucide-react';
import { MainTab } from '../../types';

interface MainTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

const tabs = [
  { id: 'today' as MainTab, label: 'Today', icon: Home },
  { id: 'progress' as MainTab, label: 'Progress', icon: TrendingUp },
  { id: 'plan' as MainTab, label: 'Plan', icon: Calendar },
  { id: 'shop' as MainTab, label: 'Shop', icon: ShoppingBag },
  { id: 'community' as MainTab, label: 'Community', icon: Users },
  { id: 'profile' as MainTab, label: 'Profile', icon: User }
];

export const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#161B22] border-t border-[#2B3440] safe-bottom">
      <div className="grid grid-cols-6 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive 
                  ? 'text-[#58A6FF]' 
                  : 'text-[#7D8590] hover:text-[#F0F6FC]'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};