@@ .. @@
 import React, { useState } from 'react';
 import { Target, Mail, Lock, User, ArrowRight } from 'lucide-react';
 import { SupabaseService } from '../../services/supabaseService';
+import { useAppStore } from '../../store/useAppStore';
 
 export const AuthScreen: React.FC = () => {
   const [mode, setMode] = useState<'signin' | 'signup'>('signin');
@@ .. @@
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
+  const { setCurrentScreen } = useAppStore();
 
   const handleSubmit = async (e: React.FormEvent) => {
@@ .. @@
       } else {
         const { error } = await SupabaseService.signIn(email, password);
         if (error) throw error;
+        
+        // On successful login, redirect to welcome screen
+        setCurrentScreen('welcome');
       }
     } catch (err: any) {