/**
 * Sample data for initial app state
 * Arrays are intentionally empty — the app starts blank on first visit.
 * File kept for import compatibility.
 */

import { Application, Interview, Contact, Exam, Question, CalendarEvent, Offer, Resume } from '@/context/DataContext';

export const sampleApplications: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>[] = [];

export const sampleInterviews: Omit<Interview, 'id' | 'createdAt'>[] = [];

export const sampleContacts: Omit<Contact, 'id' | 'createdAt'>[] = [];

export const sampleExams: Omit<Exam, 'id' | 'createdAt'>[] = [];

export const sampleQuestions: Omit<Question, 'id' | 'createdAt'>[] = [];

export const sampleOffers: Omit<Offer, 'id' | 'createdAt'>[] = [];

export const sampleResumes: Omit<Resume, 'id' | 'createdAt' | 'updatedAt' | 'version'>[] = [];

export const sampleEvents: Omit<CalendarEvent, 'id' | 'createdAt'>[] = [];

// Check if data has been initialized
export function isDataInitialized(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('campus-helper-data') !== null ||
         localStorage.getItem('campus-helper-initialized') === 'true';
}

export function markDataAsInitialized(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('campus-helper-initialized', 'true');
  }
}
