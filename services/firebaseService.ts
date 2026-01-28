
import { auth, googleProvider, db, storage } from "../firebase/config";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  updateProfile as firebaseUpdateProfile,
  deleteUser as firebaseDeleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  GoogleAuthProvider
} from "firebase/auth";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User, UserProfile, Application, Scholarship, Notification } from "../types";

// Helper to check initialization
const ensureInitialized = () => {
  if (!auth || !db || !storage) {
    throw new Error("Firebase not initialized. Please check your API keys in firebase/config.ts");
  }
};

// --- AUTHENTICATION ---

export const loginUser = async (email: string, pass: string) => {
  if (!auth) throw new Error("Auth not initialized");
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error: any) {
    // Throw raw error so UI can handle specific codes (like invalid-credential)
    throw error;
  }
};

export const registerUser = async (name: string, email: string, pass: string) => {
  if (!auth || !db) throw new Error("Firebase not initialized");
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  // Save extra user details to Firestore
  const userRef = doc(db, "users", userCredential.user.uid);
  await setDoc(userRef, {
    uid: userCredential.user.uid,
    name,
    email,
    role: 'user', // Default role
    createdAt: new Date().toISOString()
  });
  // Update Auth Profile
  await firebaseUpdateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
};

export const loginWithGoogle = async () => {
  if (!auth || !db) throw new Error("Firebase not initialized");
  
  // Use exported provider or create new instance if missing (fallback)
  const provider = googleProvider || new GoogleAuthProvider();
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Check if user doc exists, if not create it
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }
  return user;
};

export const logoutUser = () => {
  if (auth) signOut(auth);
};

export const updatePasswordDB = async (currentPass: string, newPass: string) => {
  if (!auth || !auth.currentUser) throw new Error("No user logged in");
  
  // 1. Re-authenticate the user
  const credential = EmailAuthProvider.credential(auth.currentUser.email!, currentPass);
  await reauthenticateWithCredential(auth.currentUser, credential);
  
  // 2. Update Password
  await updatePassword(auth.currentUser, newPass);
};

// --- DATABASE: USERS ---

export const getUserProfile = async (uid: string): Promise<User | null> => {
  if (!db) return null;
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: data.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        profile: data.profile // Detailed profile object
      };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
  return null;
};

export const getAllUsers = async (): Promise<string[]> => {
  if (!db) return [];
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.id); // Return list of UIDs
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUserProfileDB = async (uid: string, data: Partial<User>) => {
  if (!db) return;
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

export const deleteUserDB = async (uid: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (error) {
    console.error("Error deleting user data:", error);
  }
};

// --- DATABASE: SCHOLARSHIPS ---

export const getScholarshipsStream = (callback: (data: Scholarship[]) => void, onError?: (error: any) => void) => {
  if (!db) {
    console.warn("Firestore not initialized, returning empty list");
    callback([]); 
    return () => {};
  }
  try {
    const q = query(collection(db, "scholarships"));
    return onSnapshot(q, (querySnapshot) => {
      const scholarships: Scholarship[] = [];
      querySnapshot.forEach((doc) => {
        scholarships.push({ id: doc.id, ...doc.data() } as Scholarship);
      });
      callback(scholarships);
    }, (error) => {
      if (onError) onError(error);
      else console.error("Error streaming scholarships:", error.message);
    });
  } catch (e) {
    console.error("Error setting up scholarship stream:", e);
    callback([]);
    return () => {};
  }
};

export const addScholarshipDB = async (scholarship: Scholarship) => {
  if (!db) return;
  // We remove the ID as Firestore generates it, or we can set it manually
  const { id, ...data } = scholarship; 
  const finalData = {
      ...data,
      datePosted: new Date().toISOString() // Ensure timestamp
  };
  await addDoc(collection(db, "scholarships"), finalData);
};

export const updateScholarshipDB = async (scholarship: Scholarship) => {
  if (!db) return;
  const ref = doc(db, "scholarships", scholarship.id);
  const { id, ...data } = scholarship;
  await updateDoc(ref, data);
};

export const deleteScholarshipDB = async (id: string) => {
  if (!db) return;
  
  try {
      // 1. Find all applications for this scholarship
      const appQuery = query(collection(db, "applications"), where("scholarshipId", "==", id));
      const appSnapshot = await getDocs(appQuery);
      
      // 2. Delete them
      const deletePromises = appSnapshot.docs.map(appDoc => deleteDoc(appDoc.ref));
      await Promise.all(deletePromises);
      
      // 3. Delete the scholarship itself
      await deleteDoc(doc(db, "scholarships", id));
  } catch (error) {
      console.error("Error deleting scholarship and applications:", error);
      throw error;
  }
};

// --- DATABASE: SAVED SCHOLARSHIPS ---

export const getSavedScholarshipIdsStream = (uid: string, callback: (ids: string[]) => void, onError?: (error: any) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const docRef = doc(db, "savedScholarships", uid);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data().scholarshipIds || []);
      } else {
        callback([]);
      }
    }, (error) => {
        if(onError) onError(error);
        else console.warn("Saved items stream error:", error.message);
    });
  } catch (e) {
    console.error("Error setting up saved stream:", e);
    callback([]);
    return () => {};
  }
};

export const toggleSavedScholarshipDB = async (uid: string, scholarshipId: string, currentSaved: string[]) => {
  if (!db) return;
  const docRef = doc(db, "savedScholarships", uid);
  let newSaved;
  if (currentSaved.includes(scholarshipId)) {
    newSaved = currentSaved.filter(id => id !== scholarshipId);
  } else {
    newSaved = [...currentSaved, scholarshipId];
  }
  await setDoc(docRef, { scholarshipIds: newSaved }, { merge: true });
};

// --- DATABASE: APPLICATIONS ---

export const getUserApplicationsStream = (uid: string, callback: (apps: Application[]) => void, onError?: (error: any) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, "applications"), where("userId", "==", uid));
    return onSnapshot(q, (querySnapshot) => {
      const apps: Application[] = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application);
      });
      callback(apps);
    }, (error) => {
        if(onError) onError(error);
        else console.warn("User applications stream error:", error.message);
    });
  } catch (e) {
    console.error("Error setting up user app stream:", e);
    callback([]);
    return () => {};
  }
};

export const getAllApplicationsStream = (callback: (apps: Application[]) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(collection(db, "applications"));
    return onSnapshot(q, (querySnapshot) => {
      const apps: Application[] = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as Application);
      });
      callback(apps);
    });
  } catch (e) {
    console.error("Error setting up all app stream:", e);
    callback([]);
    return () => {};
  }
};

export const submitApplicationDB = async (application: Application) => {
  if (!db) throw new Error("Database not initialized");
  const { id, ...data } = application;
  const docRef = await addDoc(collection(db, "applications"), data);
  return docRef.id;
};

export const updateApplicationStatusDB = async (appId: string, status: string, message?: string, history?: any[]) => {
  if (!db) return;
  const ref = doc(db, "applications", appId);
  await updateDoc(ref, { status, adminMessage: message, history });
};

export const deleteApplicationDB = async (appId: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, "applications", appId));
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

// --- DATABASE: NOTIFICATIONS ---

export const getUserNotificationsStream = (uid: string, callback: (notes: Notification[]) => void) => {
  if (!db) {
    callback([]);
    return () => {};
  }

  // STRATEGY: Try Sorted First. If it fails (index error), Fallback to Unsorted.
  
  // 1. Fallback Query (No Sort)
  const fallbackQuery = query(
    collection(db, "notifications"), 
    where("userId", "==", uid)
  );

  const setupFallbackListener = () => {
    return onSnapshot(fallbackQuery, (querySnapshot) => {
        const notes: Notification[] = [];
        querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() } as Notification);
        });
        // Client sorts this later
        callback(notes);
    });
  };

  try {
    // 2. Primary Query (Sorted)
    const sortedQuery = query(
        collection(db, "notifications"), 
        where("userId", "==", uid), 
        orderBy("date", "desc")
    );
    
    return onSnapshot(sortedQuery, (querySnapshot) => {
      const notes: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Notification);
      });
      callback(notes);
    }, (error) => {
        // 3. Error Handler -> Switch to Fallback
        console.warn("Index/Permission missing for sorted notifications. Switching to fallback query.");
        setupFallbackListener();
    });
  } catch (e) {
    console.error("Error setting up notification stream, trying fallback:", e);
    return setupFallbackListener();
  }
};

export const addNotificationDB = async (notification: Omit<Notification, 'id'>) => {
  if (!db) return;
  await addDoc(collection(db, "notifications"), notification);
};

export const updateNotificationReadDB = async (id: string) => {
  if (!db) return;
  const ref = doc(db, "notifications", id);
  await updateDoc(ref, { read: true });
};

export const deleteNotificationDB = async (id: string) => {
  if (!db) return;
  await deleteDoc(doc(db, "notifications", id));
};

// --- STORAGE ---

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!storage) {
    console.warn("Storage not initialized");
    return "#";
  }
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (e) {
    console.error("Upload failed", e);
    return "#";
  }
};
