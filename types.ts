
import React from 'react';

export interface Scholarship {
  id: string;
  title: string;
  sponsor: string;
  amount: string;
  deadline: string;
  tags: string[];
  category: 'Merit' | 'Need-Based' | 'Research' | 'Athletic' | 'Arts' | 'Government' | 'NGO';
  description: string;
  matchScore?: number; // Percentage 0-100
  isUrgent?: boolean;
  location?: string;
  logoUrl?: string;
  websiteUrl?: string;
  coverImage?: string;
  eligibility: string[];
  requirements: string[];
  datePosted?: string; // ISO string or timestamp of when it was created
}

export interface UserProfile {
  // Personal
  firstName?: string;
  middleName?: string;
  lastName?: string;
  // Legacy support or computed
  fullName?: string; 
  
  dob?: string;
  age?: string;
  gender?: string;
  nationality?: string;
  location?: string;
  phone?: string;
  bio?: string;
  
  // Guardian / Emergency
  guardianName?: string;
  guardianRelationship?: string;
  guardianContact?: string;
  
  // Academic
  educationLevel?: string;
  schoolName?: string;
  studentId?: string;
  major?: string;
  gpa?: string;
  
  // Financial
  incomeRange?: string;
  householdSize?: number;
  isWorkingStudent?: boolean;
  
  // Preferences
  preferredType?: string[];
  preferredLocation?: 'Local' | 'International';
  
  interests?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password?: string; // stored in localstorage for demo purposes
  avatar?: string;
  profile?: UserProfile;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Exam' | 'Interview' | 'Accepted' | 'Rejected';

export interface ApplicationDocument {
  name: string;
  size: string;
  type: string;
  dateUploaded: string;
  url: string;
}

export interface TimelineEvent {
  status: ApplicationStatus;
  date: string;
  message?: string;
}

export interface Application {
  id: string;
  userId: string; // Link application to specific user
  applicantName: string;
  applicantEmail: string;
  applicantProfile?: UserProfile; // Snapshot of profile at time of application
  scholarshipId: string;
  scholarshipTitle: string;
  sponsor: string;
  dateApplied: string;
  status: ApplicationStatus;
  remarks?: string;
  adminMessage?: string; // Specific instructions from admin (e.g. Exam details)
  documents?: ApplicationDocument[];
  history?: TimelineEvent[];
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface Notification {
  id: string;
  userId: string; // Link notification to specific user
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  date: string;
  read: boolean;
  relatedAppId?: string; // ID of the application this notification belongs to
}