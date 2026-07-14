'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef, ReactNode } from 'react';

// ============= Types =============
export interface Application {
  id: string;
  company: string;
  position: string;
  location?: string;
  salary?: string;
  stage: string; // Dynamic - matches pipeline node names
  status: 'pending' | 'interviewing' | 'offer' | 'rejected';
  appliedDate: string;
  deadline?: string;
  notes?: string;
  hrContact?: string;
  source?: string;
  url?: string; // 投递原始链接
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId?: string;
  company: string;
  position: string;
  type: '技术面' | 'HR面' | '群面' | '笔试' | '性格测试' | '其他';
  date: string;
  time: string;
  location?: string;
  onlineLink?: string;
  interviewer?: string;
  feedback?: string;
  rating?: number;
  questions?: string[];
  notes?: string;
  reminder?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
  wechat?: string;
  linkedin?: string;
  relationship: '校友' | '内推人' | 'HR' | '面试官' | '同学' | '其他';
  lastContact?: string;
  notes?: string;
  tags?: string[];
  companyProfileId?: string;
  createdAt: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  description?: string;
  salary?: {
    entry?: string;
    intern?: string;
  };
  benefits?: string[];
  interviews?: string[];
  timeline?: string;
  culture?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  company: string;
  position?: string;
  date: string;
  time: string;
  type: '笔试' | '面试' | '测评' | 'OT';
  status: 'upcoming' | 'completed' | 'cancelled';
  location?: string;
  duration?: string;
  onlineLink?: string;
  score?: string;
  notes?: string;
  applicationId?: string;
  createdAt: string;
}

export interface Question {
  id: string;
  category: string;
  type: '选择' | '填空' | '编程' | '简答';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer?: string;
  explanation?: string;
  tags?: string[];
  starred?: boolean;
  source?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'interview' | 'test' | 'deadline' | 'milestone' | 'custom';
  company?: string;
  description?: string;
  reminder?: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  company: string;
  position: string;
  salary: {
    base: number;
    bonus?: number;
    stock?: number;
    total?: number;
  };
  location: string;
  level?: string;
  startDate?: string;
  deadline?: string;
  benefits?: string[];
  pros?: string[];
  cons?: string[];
  recommendation?: 'accept' | 'negotiate' | 'reject';
  notes?: string;
  comparedWith?: string[];
  createdAt: string;
}

export interface Resume {
  id: string;
  title: string;
  content: string;
  version: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  targetPositions: string[];
  targetLocations: string[];
  targetCompanies?: string[];
  goals?: {
    applications?: number;
    interviews?: number;
    replies?: number;
  };
  settings?: {
    noResponseDays?: number;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    monthlyBudget?: number;
    theme?: string;
    defaultView?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: 'application' | 'interview' | 'offer' | 'contact' | 'update';
  action: string;
  company?: string;
  position?: string;
  timestamp: string;
}

// ============= State & Actions =============
interface AppState {
  applications: Application[];
  interviews: Interview[];
  contacts: Contact[];
  companyProfiles: CompanyProfile[];
  exams: Exam[];
  questions: Question[];
  events: CalendarEvent[];
  offers: Offer[];
  resumes: Resume[];
  userProfile: UserProfile;
  chatHistory: ChatMessage[];
  activities: Activity[];
  isLoading: boolean;
  isHydrated: boolean;
}

type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION'; payload: { id: string; data: Partial<Application> } }
  | { type: 'DELETE_APPLICATION'; payload: string }
  | { type: 'ADD_INTERVIEW'; payload: Interview }
  | { type: 'UPDATE_INTERVIEW'; payload: { id: string; data: Partial<Interview> } }
  | { type: 'DELETE_INTERVIEW'; payload: string }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: { id: string; data: Partial<Contact> } }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_COMPANY_PROFILE'; payload: CompanyProfile }
  | { type: 'UPDATE_COMPANY_PROFILE'; payload: { id: string; data: Partial<CompanyProfile> } }
  | { type: 'DELETE_COMPANY_PROFILE'; payload: string }
  | { type: 'ADD_EXAM'; payload: Exam }
  | { type: 'UPDATE_EXAM'; payload: { id: string; data: Partial<Exam> } }
  | { type: 'DELETE_EXAM'; payload: string }
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'UPDATE_QUESTION'; payload: { id: string; data: Partial<Question> } }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_EVENT'; payload: { id: string; data: Partial<CalendarEvent> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'ADD_OFFER'; payload: Offer }
  | { type: 'UPDATE_OFFER'; payload: { id: string; data: Partial<Offer> } }
  | { type: 'DELETE_OFFER'; payload: string }
  | { type: 'ADD_RESUME'; payload: Resume }
  | { type: 'UPDATE_RESUME'; payload: { id: string; data: Partial<Resume> } }
  | { type: 'DELETE_RESUME'; payload: string }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY' }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'CLEAR_ALL_DATA' };

// ============= Initial State =============
const defaultUserProfile: UserProfile = {
  name: 'Nerida',
  title: '前端开发工程师',
  targetPositions: ['前端开发工程师', 'Web前端开发', '前端工程师'],
  targetLocations: ['北京', '上海', '深圳'],
  goals: {
    applications: 50,
    interviews: 20,
    replies: 30,
  },
  settings: {
    noResponseDays: 7,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    monthlyBudget: 100,
    theme: 'green',
    defaultView: 'kanban',
  },
};

const initialState: AppState = {
  applications: [],
  interviews: [],
  contacts: [],
  companyProfiles: [],
  exams: [],
  questions: [],
  events: [],
  offers: [],
  resumes: [],
  userProfile: defaultUserProfile,
  chatHistory: [],
  activities: [],
  isLoading: true,
  isHydrated: false,
};

// ============= Reducer =============
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, isHydrated: true, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_APPLICATION':
      return { ...state, applications: [action.payload, ...state.applications] };
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map((app) =>
          app.id === action.payload.id ? { ...app, ...action.payload.data, updatedAt: new Date().toISOString() } : app
        ),
      };
    case 'DELETE_APPLICATION':
      return {
        ...state,
        applications: state.applications.filter((app) => app.id !== action.payload),
      };
    case 'ADD_INTERVIEW':
      return { ...state, interviews: [action.payload, ...state.interviews] };
    case 'UPDATE_INTERVIEW':
      return {
        ...state,
        interviews: state.interviews.map((interview) =>
          interview.id === action.payload.id ? { ...interview, ...action.payload.data } : interview
        ),
      };
    case 'DELETE_INTERVIEW':
      return {
        ...state,
        interviews: state.interviews.filter((interview) => interview.id !== action.payload),
      };
    case 'ADD_CONTACT':
      return { ...state, contacts: [action.payload, ...state.contacts] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((contact) =>
          contact.id === action.payload.id ? { ...contact, ...action.payload.data } : contact
        ),
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter((contact) => contact.id !== action.payload),
      };
    case 'ADD_COMPANY_PROFILE':
      return { ...state, companyProfiles: [action.payload, ...state.companyProfiles] };
    case 'UPDATE_COMPANY_PROFILE':
      return {
        ...state,
        companyProfiles: state.companyProfiles.map((profile) =>
          profile.id === action.payload.id ? { ...profile, ...action.payload.data } : profile
        ),
      };
    case 'DELETE_COMPANY_PROFILE':
      return {
        ...state,
        companyProfiles: state.companyProfiles.filter((profile) => profile.id !== action.payload),
      };
    case 'ADD_EXAM':
      return { ...state, exams: [action.payload, ...state.exams] };
    case 'UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map((exam) =>
          exam.id === action.payload.id ? { ...exam, ...action.payload.data } : exam
        ),
      };
    case 'DELETE_EXAM':
      return {
        ...state,
        exams: state.exams.filter((exam) => exam.id !== action.payload),
      };
    case 'ADD_QUESTION':
      return { ...state, questions: [action.payload, ...state.questions] };
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload.data } : q
        ),
      };
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter((q) => q.id !== action.payload),
      };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? { ...event, ...action.payload.data } : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
      };
    case 'ADD_OFFER':
      return { ...state, offers: [action.payload, ...state.offers] };
    case 'UPDATE_OFFER':
      return {
        ...state,
        offers: state.offers.map((offer) =>
          offer.id === action.payload.id ? { ...offer, ...action.payload.data } : offer
        ),
      };
    case 'DELETE_OFFER':
      return {
        ...state,
        offers: state.offers.filter((offer) => offer.id !== action.payload),
      };
    case 'ADD_RESUME':
      return { ...state, resumes: [action.payload, ...state.resumes] };
    case 'UPDATE_RESUME':
      return {
        ...state,
        resumes: state.resumes.map((resume) =>
          resume.id === action.payload.id ? { ...resume, ...action.payload.data, updatedAt: new Date().toISOString() } : resume
        ),
      };
    case 'DELETE_RESUME':
      return {
        ...state,
        resumes: state.resumes.filter((resume) => resume.id !== action.payload),
      };
    case 'UPDATE_USER_PROFILE':
      return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'CLEAR_CHAT_HISTORY':
      return { ...state, chatHistory: [] };
    case 'ADD_ACTIVITY':
      return { ...state, activities: [action.payload, ...state.activities].slice(0, 100) };
    case 'CLEAR_ALL_DATA':
      return { ...initialState, isHydrated: true, isLoading: false };
    default:
      return state;
  }
}

// ============= Sync Status =============
export type SyncStatus = 'idle' | 'saving' | 'syncing' | 'synced' | 'error';

// ============= Context =============
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helper functions
  generateId: () => string;
  addActivity: (type: Activity['type'], action: string, company?: string, position?: string) => void;
  syncStatus: SyncStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============= Storage Keys =============
const STORAGE_KEY = 'campus-helper-data';
const INIT_KEY = 'campus-helper-initialized';
const SUPABASE_SYNCED_KEY = 'campus-helper-supabase-synced';

import { isSupabaseConfigured } from '@/lib/supabase';
import { loadAllCollections, syncAllCollections, syncUserProfile } from '@/lib/supabase-service';
import { useToast } from '@/components/UI/Toast';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadFromStorage(): Partial<AppState> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data && data !== 'null' && data !== 'undefined') {
      const parsed = JSON.parse(data);
      // Check if it's a valid state object with arrays
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.applications)) {
        return parsed;
      }
    }
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    const { isLoading, isHydrated, ...persistedState } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// ============= Provider =============
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  // Track whether the initial hydration has been processed (to avoid showing
  // the "saving" indicator on app load when data is just being loaded)
  const isFirstHydrationRef = useRef(true);

  // Hydrate from Supabase (primary) or localStorage (fallback) on mount
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      // Try Supabase first if configured
      if (isSupabaseConfigured()) {
        try {
          const cloudData = await loadAllCollections();
          if (!cancelled && cloudData) {
            const hasData = Object.entries(cloudData).some(([key, val]) => {
              if (key === 'userProfile') return !!val;
              return Array.isArray(val) && val.length > 0;
            });

            if (hasData) {
              // 若 Supabase 没有返回 userProfile（首次使用或写入曾失败），
              // 从 localStorage 保留已保存的 userProfile，避免被默认值覆盖
              let dataToHydrate = cloudData;
              if (!cloudData.userProfile) {
                const local = loadFromStorage();
                if (local.userProfile) {
                  dataToHydrate = { ...cloudData, userProfile: local.userProfile };
                }
              }
              dispatch({ type: 'HYDRATE', payload: dataToHydrate });
              // Also save to localStorage as backup
              saveToStorage({ ...initialState, ...dataToHydrate, isHydrated: true, isLoading: false } as AppState);
              return;
            }
          }
        } catch (err) {
          console.error('[DataContext] Failed to load from Supabase:', err);
        }
      }

      // Fall back to localStorage
      if (!cancelled) {
        const persisted = loadFromStorage();
        dispatch({ type: 'HYDRATE', payload: persisted });
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage on state change + update syncStatus
  useEffect(() => {
    if (!state.isHydrated) return;
    saveToStorage(state);
    // Skip sync status display for the initial hydration load
    if (isFirstHydrationRef.current) {
      isFirstHydrationRef.current = false;
      return;
    }
    setSyncStatus('saving');
    if (!isSupabaseConfigured()) {
      const t = setTimeout(() => setSyncStatus('idle'), 2000);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Sync to Supabase on state change (debounced, 3s)
  useEffect(() => {
    if (!state.isHydrated || !isSupabaseConfigured()) return;

    const timer = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        await syncAllCollections(state);
        localStorage.setItem(SUPABASE_SYNCED_KEY, 'true');
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } catch (err) {
        setSyncStatus('error');
        console.error('[DataContext] Failed to sync to Supabase:', err);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // userProfile 变更时立刻同步到 Supabase，不等防抖
  // 防止用户保存后 3 秒内刷新导致数据丢失
  useEffect(() => {
    if (!state.isHydrated || !isSupabaseConfigured()) return;
    syncUserProfile(state.userProfile).catch((err: any) => {
      console.error('[DataContext] Failed to immediately sync user profile:', err);
    });
  }, [state.userProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addActivity = useCallback((
    type: Activity['type'],
    action: string,
    company?: string,
    position?: string
  ) => {
    const activity: Activity = {
      id: generateId(),
      type,
      action,
      company,
      position,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, [generateId]);

  return (
    <AppContext.Provider value={{ state, dispatch, generateId, addActivity, syncStatus }}>
      {children}
    </AppContext.Provider>
  );
}

// ============= Hooks =============
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function useSyncStatus(): SyncStatus {
  return useApp().syncStatus;
}

export function useApplications() {
  const { state, dispatch, generateId, addActivity } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const application: Application = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_APPLICATION', payload: application });
    addActivity('application', `投递 ${application.company} - ${application.position}`, application.company, application.position);
    addToast('success', `已添加 ${application.company} 的投递记录`, 2000);
    return application;
  }, [dispatch, generateId, addActivity, addToast]);

  const update = useCallback((id: string, data: Partial<Application>) => {
    const app = state.applications.find(a => a.id === id);
    dispatch({ type: 'UPDATE_APPLICATION', payload: { id, data } });
    addToast('success', app ? `已更新 ${app.company} 的信息` : '已更新投递信息', 2000);
  }, [dispatch, state.applications, addToast]);

  const remove = useCallback((id: string) => {
    const app = state.applications.find(a => a.id === id);
    dispatch({ type: 'DELETE_APPLICATION', payload: id });
    addToast('info', app ? `已删除 ${app.company} 的投递记录` : '已删除投递记录', 2000);
  }, [dispatch, state.applications, addToast]);

  return {
    applications: state.applications,
    add,
    update,
    remove,
  };
}

export function useInterviews() {
  const { state, dispatch, generateId, addActivity } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Interview, 'id' | 'createdAt'>) => {
    const interview: Interview = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_INTERVIEW', payload: interview });
    addActivity('interview', `添加面试 ${interview.company} - ${interview.type}`, interview.company, interview.position);
    addToast('success', `已添加 ${interview.company} 的面试记录`, 2000);
    return interview;
  }, [dispatch, generateId, addActivity, addToast]);

  const update = useCallback((id: string, data: Partial<Interview>) => {
    const interview = state.interviews.find(i => i.id === id);
    dispatch({ type: 'UPDATE_INTERVIEW', payload: { id, data } });
    addToast('success', interview ? `已更新 ${interview.company} 的面试信息` : '已更新面试信息', 2000);
  }, [dispatch, state.interviews, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_INTERVIEW', payload: id });
    addToast('info', '已删除面试记录', 2000);
  }, [dispatch, addToast]);

  return {
    interviews: state.interviews,
    upcomingInterviews: state.interviews.filter(i => i.status === 'upcoming'),
    completedInterviews: state.interviews.filter(i => i.status === 'completed'),
    add,
    update,
    remove,
  };
}

export function useContacts() {
  const { state, dispatch, generateId, addActivity } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CONTACT', payload: contact });
    addActivity('contact', `添加联系人 ${contact.name}`, contact.company);
    addToast('success', `已添加联系人 ${contact.name}`, 2000);
    return contact;
  }, [dispatch, generateId, addActivity, addToast]);

  const update = useCallback((id: string, data: Partial<Contact>) => {
    const contact = state.contacts.find(c => c.id === id);
    dispatch({ type: 'UPDATE_CONTACT', payload: { id, data } });
    addToast('success', contact ? `已更新 ${contact.name} 的信息` : '已更新联系人信息', 2000);
  }, [dispatch, state.contacts, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONTACT', payload: id });
    addToast('info', '已删除联系人', 2000);
  }, [dispatch, addToast]);

  return {
    contacts: state.contacts,
    add,
    update,
    remove,
  };
}

export function useCompanyProfiles() {
  const { state, dispatch, generateId } = useApp();

  const add = useCallback((data: Omit<CompanyProfile, 'id' | 'createdAt'>) => {
    const profile: CompanyProfile = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMPANY_PROFILE', payload: profile });
    return profile;
  }, [dispatch, generateId]);

  const update = useCallback((id: string, data: Partial<CompanyProfile>) => {
    dispatch({ type: 'UPDATE_COMPANY_PROFILE', payload: { id, data } });
  }, [dispatch]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COMPANY_PROFILE', payload: id });
  }, [dispatch]);

  return {
    companyProfiles: state.companyProfiles,
    add,
    update,
    remove,
  };
}

export function useExams() {
  const { state, dispatch, generateId, addActivity } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Exam, 'id' | 'createdAt'>) => {
    const exam: Exam = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EXAM', payload: exam });
    addActivity('interview', `添加笔试 ${exam.company} - ${exam.type}`, exam.company);
    addToast('success', `已添加 ${exam.company} 的笔试`, 2000);
    return exam;
  }, [dispatch, generateId, addActivity, addToast]);

  const update = useCallback((id: string, data: Partial<Exam>) => {
    const exam = state.exams.find(e => e.id === id);
    dispatch({ type: 'UPDATE_EXAM', payload: { id, data } });
    addToast('success', exam ? `已更新 ${exam.company} 的笔试信息` : '已更新笔试信息', 2000);
  }, [dispatch, state.exams, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXAM', payload: id });
    addToast('info', '已删除笔试记录', 2000);
  }, [dispatch, addToast]);

  return {
    exams: state.exams,
    upcomingExams: state.exams.filter(e => e.status === 'upcoming'),
    completedExams: state.exams.filter(e => e.status === 'completed'),
    add,
    update,
    remove,
  };
}

export function useQuestions() {
  const { state, dispatch, generateId } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Question, 'id' | 'createdAt'>) => {
    const question: Question = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_QUESTION', payload: question });
    addToast('success', '已添加题目', 2000);
    return question;
  }, [dispatch, generateId, addToast]);

  const update = useCallback((id: string, data: Partial<Question>) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: { id, data } });
    addToast('success', '已更新题目', 2000);
  }, [dispatch, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_QUESTION', payload: id });
    addToast('info', '已删除题目', 2000);
  }, [dispatch, addToast]);

  const toggleStar = useCallback((id: string) => {
    const question = state.questions.find(q => q.id === id);
    if (question) {
      dispatch({ type: 'UPDATE_QUESTION', payload: { id, data: { starred: !question.starred } } });
    }
  }, [dispatch, state.questions]);

  return {
    questions: state.questions,
    starredQuestions: state.questions.filter(q => q.starred),
    add,
    update,
    remove,
    toggleStar,
  };
}

export function useEvents() {
  const { state, dispatch, generateId } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const event: CalendarEvent = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_EVENT', payload: event });
    addToast('success', `已添加日历事件：${event.title}`, 2000);
    return event;
  }, [dispatch, generateId, addToast]);

  const update = useCallback((id: string, data: Partial<CalendarEvent>) => {
    dispatch({ type: 'UPDATE_EVENT', payload: { id, data } });
    addToast('success', '已更新日历事件', 2000);
  }, [dispatch, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: id });
    addToast('info', '已删除日历事件', 2000);
  }, [dispatch, addToast]);

  return {
    events: state.events,
    add,
    update,
    remove,
  };
}

export function useOffers() {
  const { state, dispatch, generateId, addActivity } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Offer, 'id' | 'createdAt'>) => {
    const offer: Offer = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_OFFER', payload: offer });
    addActivity('offer', `收到 Offer: ${offer.company} - ${offer.position}`, offer.company, offer.position);
    addToast('success', `已添加 ${offer.company} 的 Offer`, 2000);
    return offer;
  }, [dispatch, generateId, addActivity, addToast]);

  const update = useCallback((id: string, data: Partial<Offer>) => {
    const offer = state.offers.find(o => o.id === id);
    dispatch({ type: 'UPDATE_OFFER', payload: { id, data } });
    addToast('success', offer ? `已更新 ${offer.company} 的 Offer 信息` : '已更新 Offer 信息', 2000);
  }, [dispatch, state.offers, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_OFFER', payload: id });
    addToast('info', '已删除 Offer 记录', 2000);
  }, [dispatch, addToast]);

  return {
    offers: state.offers,
    add,
    update,
    remove,
  };
}

export function useResumes() {
  const { state, dispatch, generateId } = useApp();
  const { addToast } = useToast();

  const add = useCallback((data: Omit<Resume, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const resume: Resume = {
      ...data,
      id: generateId(),
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_RESUME', payload: resume });
    addToast('success', `已添加简历「${resume.title}」`, 2000);
    return resume;
  }, [dispatch, generateId, addToast]);

  const update = useCallback((id: string, data: Partial<Resume>) => {
    const resume = state.resumes.find(r => r.id === id);
    dispatch({ type: 'UPDATE_RESUME', payload: { id, data } });
    addToast('success', resume ? `已更新简历「${resume.title}」` : '已更新简历', 2000);
  }, [dispatch, state.resumes, addToast]);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'DELETE_RESUME', payload: id });
    addToast('info', '已删除简历', 2000);
  }, [dispatch, addToast]);

  const duplicate = useCallback((id: string) => {
    const resume = state.resumes.find(r => r.id === id);
    if (resume) {
      const newResume: Resume = {
        ...resume,
        id: generateId(),
        title: `${resume.title} (副本)`,
        version: 1,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_RESUME', payload: newResume });
      addToast('success', `已复制简历「${resume.title}」`, 2000);
      return newResume;
    }
  }, [dispatch, generateId, state.resumes, addToast]);

  return {
    resumes: state.resumes,
    defaultResume: state.resumes.find(r => r.isDefault),
    add,
    update,
    remove,
    duplicate,
  };
}

export function useUserProfile() {
  const { state, dispatch } = useApp();

  const update = useCallback((data: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: data });
  }, [dispatch]);

  return {
    userProfile: state.userProfile,
    update,
  };
}

export function useActivities() {
  const { state } = useApp();
  return {
    activities: state.activities,
    recentActivities: state.activities.slice(0, 20),
  };
}

export function useChatHistory() {
  const { state, dispatch } = useApp();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const msg: ChatMessage = {
      ...message,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: msg });
    return msg;
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR_CHAT_HISTORY' });
  }, [dispatch]);

  return {
    chatHistory: state.chatHistory,
    addMessage,
    clear,
  };
}

export function useStats() {
  const { state } = useApp();

  const stats = {
    totalApplications: state.applications.length,
    pendingApplications: state.applications.filter(a => a.status === 'pending').length,
    interviewingApplications: state.applications.filter(a => a.status === 'interviewing').length,
    offerReceived: state.applications.filter(a => a.status === 'offer').length,
    rejectedApplications: state.applications.filter(a => a.status === 'rejected').length,
    upcomingInterviews: state.interviews.filter(i => i.status === 'upcoming').length,
    completedInterviews: state.interviews.filter(i => i.status === 'completed').length,
    totalContacts: state.contacts.length,
    totalOffers: state.offers.length,
    totalExams: state.exams.length,
    upcomingExams: state.exams.filter(e => e.status === 'upcoming').length,
  };

  const goals = {
    applications: {
      current: stats.totalApplications,
      target: state.userProfile.goals?.applications || 50,
      progress: Math.min(100, (stats.totalApplications / (state.userProfile.goals?.applications || 50)) * 100),
    },
    interviews: {
      current: stats.completedInterviews,
      target: state.userProfile.goals?.interviews || 20,
      progress: Math.min(100, (stats.completedInterviews / (state.userProfile.goals?.interviews || 20)) * 100),
    },
    replies: {
      current: stats.pendingApplications + stats.interviewingApplications,
      target: state.userProfile.goals?.replies || 30,
      progress: Math.min(100, ((stats.pendingApplications + stats.interviewingApplications) / (state.userProfile.goals?.replies || 30)) * 100),
    },
  };

  return { stats, goals };
}

export function useDataManagement() {
  const { dispatch } = useApp();

  const exportData = useCallback(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campus-helper-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const importData = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          window.location.reload();
          resolve();
        } catch {
          reject(new Error('Invalid file format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const clearAllData = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INIT_KEY);
  }, [dispatch]);

  return { exportData, importData, clearAllData };
}
