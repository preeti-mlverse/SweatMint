@@ .. @@
 import React, { useEffect, useState } from 'react';
 import { supabase } from '../../lib/supabase';
 import { User } from '@supabase/supabase-js';
 import { AuthScreen } from './AuthScreen';
+import { Target } from 'lucide-react';
 
 interface AuthWrapperProps {
   children: React.ReactNode;
 }
@@ .. @@
   if (loading) {
     return (
       <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
-        <div className="w-8 h-8 border-2 border-[#F08A3E] border-t-transparent rounded-full animate-spin"></div>
+        <div className="text-center">
+          <div className="w-16 h-16 bg-gradient-to-br from-[#F08A3E] to-[#E17226] rounded-2xl flex items-center justify-center mx-auto mb-4">
+            <Target className="w-8 h-8 text-white" />
+          </div>
+          <div className="w-8 h-8 border-2 border-[#F08A3E] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#CBD5E1] mt-4">Loading SweatMint...</p>
+        </div>
       </div>
     );
   }