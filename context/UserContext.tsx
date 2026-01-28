
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Application, Notification, Scholarship, ApplicationStatus } from '../types';
import { useAuth } from './AuthContext';
import { 
  getUserApplicationsStream, 
  getAllApplicationsStream, 
  submitApplicationDB, 
  updateApplicationStatusDB,
  uploadFile,
  getUserNotificationsStream,
  addNotificationDB,
  updateNotificationReadDB,
  deleteNotificationDB,
  deleteApplicationDB
} from '../services/firebaseService';

interface UserContextType {
  applications: Application[];
  notifications: Notification[];
  allApplications: Application[]; 
  applyForScholarship: (scholarship: Scholarship, files: File[]) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, message?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteApplication: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Stream User Applications
  useEffect(() => {
    if (currentUser) {
      const unsub = getUserApplicationsStream(currentUser.id, (apps) => {
        setUserApplications(apps);
      }, (error) => {
          if(error.code === 'permission-denied') {
              console.warn("Access to applications denied. Check security rules.");
              setUserApplications([]);
          }
      });
      return () => unsub();
    } else {
        setUserApplications([]);
    }
  }, [currentUser]);

  // Stream User Notifications
  useEffect(() => {
    if (currentUser) {
      const unsub = getUserNotificationsStream(currentUser.id, (notes) => {
        // Always Sort client-side to handle Fallback Scenario (unsorted DB return)
        const sorted = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNotifications(sorted);
      });
      return () => unsub();
    } else {
        setNotifications([]);
    }
  }, [currentUser]);

  // Stream All Applications (For Admin)
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      const unsub = getAllApplicationsStream((apps) => {
        setAllApplications(apps);
      });
      return () => unsub();
    } else {
        setAllApplications([]);
    }
  }, [currentUser]);

  const applyForScholarship = async (scholarship: Scholarship, files: File[]) => {
    if (!currentUser) return;

    // 1. Check if already applied (Client side check, though DB rules should also prevent)
    const hasApplied = userApplications.some(app => app.scholarshipId === scholarship.id);
    if (hasApplied) {
        console.warn("Already applied to this scholarship");
        return;
    }

    const dateToday = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Upload files to Storage
    const uploadedDocs = await Promise.all(files.map(async (f) => {
      const path = `applications/${currentUser.id}/${Date.now()}_${f.name}`;
      const url = await uploadFile(f, path);
      return {
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
        type: f.type.includes('pdf') ? 'PDF' : 'Image',
        dateUploaded: dateToday,
        url: url
      };
    }));

    const newApp: Application = {
      id: "", // Firestore creates ID
      userId: currentUser.id,
      applicantName: currentUser.name,
      applicantEmail: currentUser.email,
      applicantProfile: currentUser.profile,
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      sponsor: scholarship.sponsor,
      dateApplied: dateToday,
      status: 'Applied',
      remarks: 'Application submitted successfully.',
      documents: uploadedDocs as any,
      history: [
          { status: 'Applied', date: dateToday, message: 'Application submitted.' }
      ]
    };
    
    const appId = await submitApplicationDB(newApp);

    // Create "Application Submitted" Notification
    const newNotification: Omit<Notification, 'id'> = {
      userId: currentUser.id,
      title: "Application Submitted",
      message: `Your application for ${scholarship.title} has been successfully submitted.`,
      type: 'success',
      date: new Date().toISOString(), 
      read: false,
      relatedAppId: appId
    };
    await addNotificationDB(newNotification);
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus, customMessage?: string) => {
    const app = allApplications.find(a => a.id === id);
    if (!app) return;

    const dateToday = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    
    const newHistory = [
        ...(app.history || []), 
        { status, date: dateToday, message: customMessage || `Status updated to ${status}` }
    ];

    // Update Status in Application DB
    await updateApplicationStatusDB(id, status, customMessage, newHistory);

    // CREATE NOTIFICATION FOR USER
    const notifTitle = customMessage ? "New Message from Admin" : `Application Status Update: ${status}`;
    const notifType = status === 'Accepted' ? 'success' : status === 'Rejected' ? 'alert' : 'info';
    
    const newNotification: Omit<Notification, 'id'> = {
        userId: app.userId,
        title: notifTitle,
        message: `Your application for ${app.scholarshipTitle} has been updated to ${status}. ${customMessage ? "Check details for instructions." : ""}`,
        type: notifType,
        date: new Date().toISOString(),
        read: false,
        relatedAppId: id
    };

    await addNotificationDB(newNotification);
  };

  const deleteApplication = async (id: string) => {
    // Optimistic update if needed, but stream handles it
    await deleteApplicationDB(id);
  };

  const markNotificationAsRead = async (id: string) => {
    // Optimistic update for UI smoothness
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await updateNotificationReadDB(id);
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // In a real app, batch update. For now, iterate.
    notifications.forEach(n => {
        if(!n.read) updateNotificationReadDB(n.id);
    });
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await deleteNotificationDB(id);
  };

  return (
    <UserContext.Provider value={{ 
      applications: userApplications,
      notifications: notifications,
      allApplications, 
      applyForScholarship, 
      updateApplicationStatus,
      deleteApplication,
      markNotificationAsRead, 
      markAllNotificationsRead, 
      deleteNotification 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
