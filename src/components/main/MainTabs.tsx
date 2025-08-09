@@ .. @@
-import { Home, TrendingUp, Calendar, User } from 'lucide-react';
+import { Home, TrendingUp, Calendar, ShoppingBag, Users, User } from 'lucide-react';
 import { MainTab } from '../../types';
 
 interface MainTabsProps {
@@ .. @@
 const tabs = [
   { id: 'today' as MainTab, label: 'Today', icon: Home },
   { id: 'progress' as MainTab, label: 'Progress', icon: TrendingUp },
   { id: 'plan' as MainTab, label: 'Plan', icon: Calendar },
+  { id: 'shop' as MainTab, label: 'Shop', icon: ShoppingBag },
+  { id: 'community' as MainTab, label: 'Community', icon: Users },
   { id: 'profile' as MainTab, label: 'Profile', icon: User }
 ];
 
 export const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onTabChange }) => {
   return (
     <div className="fixed bottom-0 left-0 right-0 bg-[#161B22] border-t border-[#2B3440] safe-bottom">
-      <div className="grid grid-cols-4 max-w-md mx-auto">
+      <div className="grid grid-cols-6 max-w-md mx-auto">