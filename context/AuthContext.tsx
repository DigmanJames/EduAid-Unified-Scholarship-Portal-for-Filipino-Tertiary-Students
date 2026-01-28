
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth } from '../firebase/config';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  loginWithGoogle, 
  getUserProfile, 
  updateUserProfileDB,
  deleteUserDB,
  updatePasswordDB
} from '../services/firebaseService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  changePassword: (current: string, newPass: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. User will remain logged out.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch detailed profile from Firestore
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            setCurrentUser(userProfile);
          } else {
            // Fallback if firestore doc missing
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'user'
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (!auth) throw new Error("Auth not initialized");
    setIsLoading(true);
    try {
      await loginUser(email, password);
      // Success handled by onAuthStateChanged
    } catch (e) {
      setIsLoading(false);
      throw e; // Throw error so UI can display specific message
    }
  };

  const googleLogin = async (): Promise<void> => {
    // If auth is completely missing
    if (!auth) {
        console.warn("Auth not initialized. Using Mock.");
        setCurrentUser({
            id: 'mock-user-' + Date.now(),
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'user',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            profile: {
                firstName: 'Demo',
                lastName: 'User',
                educationLevel: 'Undergraduate',
                location: 'Manila',
                incomeRange: 'Under ₱150,000'
            }
        });
        return;
    }

    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (e: any) {
      // HANDLE UNAUTHORIZED DOMAIN ERROR FOR PREVIEWS
      if (e.code === 'auth/unauthorized-domain' || e.code === 'auth/operation-not-allowed') {
          console.warn("Google Auth Domain Unauthorized. Falling back to Mock User for Demo.");
          setCurrentUser({
              id: 'mock-google-user',
              name: 'Demo Student',
              email: 'student@demo.com',
              role: 'user',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
              profile: {
                  firstName: 'Demo',
                  lastName: 'Student',
                  educationLevel: 'Undergraduate',
                  schoolName: 'University of the Philippines',
                  major: 'Computer Science',
                  gpa: '1.25',
                  location: 'Quezon City',
                  incomeRange: 'Under ₱150,000',
                  householdSize: 4,
                  guardianName: 'Maria Student',
                  guardianRelationship: 'Mother'
              }
          });
          setIsLoading(false);
          return; // Return success so UI redirects
      }

      setIsLoading(false);
      throw e;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    if (!auth) throw new Error("Auth not initialized");
    setIsLoading(true);
    try {
      await registerUser(name, email, password);
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const logout = () => {
    if (auth) {
        logoutUser();
    }
    // Ensure state is cleared even if auth was mock
    setCurrentUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    // Optimistic update
    setCurrentUser({ ...currentUser, ...data });
    // DB update if we have a real ID (not mock)
    if (!currentUser.id.startsWith('mock')) {
        await updateUserProfileDB(currentUser.id, data);
    }
  };

  const changePassword = async (current: string, newPass: string): Promise<void> => {
    if (currentUser?.id.startsWith('mock')) {
        throw new Error("Cannot change password for demo account.");
    }
    try {
      await updatePasswordDB(current, newPass);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!currentUser) return;
    
    // Handle mock user
    if (currentUser.id.startsWith('mock')) {
        setCurrentUser(null);
        return;
    }

    if (!auth || !auth.currentUser) return;
    
    try {
        const uid = currentUser.id;
        
        // 1. Delete from Firestore
        await deleteUserDB(uid);
        
        // 2. Delete from Auth
        await deleteUser(auth.currentUser);
        
        setCurrentUser(null);
    } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout, updateProfile, changePassword, deleteAccount, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
