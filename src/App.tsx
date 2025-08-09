@@ .. @@
 import React, { useEffect, useState } from 'react';
 import { useAppStore } from './store/useAppStore';
 import { useWeightLossStore } from './store/useWeightLossStore';
+import { AuthWrapper } from './components/auth/AuthWrapper';
 
 // Onboarding Components
 import { WelcomeScreen } from './components/onboarding/WelcomeScreen';
@@ .. @@
   };

   return (
-    <div className="App">
-      {renderCurrentScreen()}
-    </div>
+    <AuthWrapper>
+      <div className="App">
+        {renderCurrentScreen()}
+      </div>
+    </AuthWrapper>
   );
 }
 
 export default App;