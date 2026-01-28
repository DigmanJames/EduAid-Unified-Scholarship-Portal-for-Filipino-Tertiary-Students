import React, { createContext, useContext, useState, useEffect } from 'react';
import { Scholarship } from '../types';
import { MOCK_SCHOLARSHIPS } from '../data/mockData';
import { 
  getScholarshipsStream, 
  addScholarshipDB, 
  updateScholarshipDB, 
  deleteScholarshipDB,
  getSavedScholarshipIdsStream,
  toggleSavedScholarshipDB
} from '../services/firebaseService';
import { useAuth } from './AuthContext';

interface ScholarshipContextType {
  scholarships: Scholarship[];
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addScholarship: (scholarship: Scholarship) => void;
  updateScholarship: (scholarship: Scholarship) => void;
  deleteScholarship: (id: string) => void;
}

const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { currentUser } = useAuth();

  // Load Scholarships from Firestore
  useEffect(() => {
    const unsubscribe = getScholarshipsStream((data) => {
      if (data.length === 0) {
        // Optional: Seed DB if empty (Dev only)
        // MOCK_SCHOLARSHIPS.forEach(s => addScholarshipDB(s));
        setScholarships(MOCK_SCHOLARSHIPS); // Fallback to mock if DB empty for demo
      } else {
        setScholarships(data);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load Saved IDs
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getSavedScholarshipIdsStream(currentUser.id, (ids) => {
        setSavedIds(ids);
      });
      return () => unsubscribe();
    } else {
      setSavedIds([]);
    }
  }, [currentUser]);

  const toggleSave = async (id: string) => {
    if (!currentUser) return;
    await toggleSavedScholarshipDB(currentUser.id, id, savedIds);
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const addScholarship = async (scholarship: Scholarship) => {
    await addScholarshipDB(scholarship);
  };

  const updateScholarship = async (scholarship: Scholarship) => {
    await updateScholarshipDB(scholarship);
  };

  const deleteScholarship = async (id: string) => {
    await deleteScholarshipDB(id);
  };

  return (
    <ScholarshipContext.Provider value={{ scholarships, savedIds, toggleSave, isSaved, addScholarship, updateScholarship, deleteScholarship }}>
      {children}
    </ScholarshipContext.Provider>
  );
};

export const useScholarships = () => {
  const context = useContext(ScholarshipContext);
  if (context === undefined) {
    throw new Error('useScholarships must be used within a ScholarshipProvider');
  }
  return context;
};
