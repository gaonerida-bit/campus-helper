import { supabase, isSupabaseConfigured } from './supabase';

// ============= Device ID Management =============
const DEVICE_ID_KEY = 'campus-helper-device-id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// ============= Table Name Mapping =============
const TABLE_MAP: Record<string, string> = {
  applications: 'applications',
  interviews: 'interviews',
  contacts: 'contacts',
  companyProfiles: 'company_profiles',
  exams: 'exams',
  questions: 'questions',
  events: 'calendar_events',
  offers: 'offers',
  resumes: 'resumes',
  chatHistory: 'chat_messages',
  activities: 'activities',
};

// ============= Field Name Mapping (camelCase → snake_case) =============
const FIELD_MAP: Record<string, Record<string, string>> = {
  applications: {
    appliedDate: 'applied_date',
    hrContact: 'hr_contact',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  interviews: {
    applicationId: 'application_id',
    onlineLink: 'online_link',
    createdAt: 'created_at',
  },
  contacts: {
    lastContact: 'last_contact',
    companyProfileId: 'company_profile_id',
    createdAt: 'created_at',
  },
  companyProfiles: {
    createdAt: 'created_at',
  },
  exams: {
    onlineLink: 'online_link',
    applicationId: 'application_id',
    createdAt: 'created_at',
  },
  questions: {
    createdAt: 'created_at',
  },
  events: {
    createdAt: 'created_at',
  },
  calendar_events: {
    createdAt: 'created_at',
  },
  offers: {
    startDate: 'start_date',
    comparedWith: 'compared_with',
    createdAt: 'created_at',
  },
  resumes: {
    isDefault: 'is_default',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  chat_messages: {
    createdAt: 'created_at',
  },
  activities: {
    createdAt: 'created_at',
  },
};

// ============= Transform Functions =============
function toSnakeCase(obj: Record<string, any>, collection: string): Record<string, any> {
  const fieldMap = FIELD_MAP[collection] || FIELD_MAP[TABLE_MAP[collection]] || {};
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = fieldMap[key] || key;
    result[snakeKey] = value;
  }
  return result;
}

function toCamelCase(obj: Record<string, any>, collection: string): Record<string, any> {
  const fieldMap = FIELD_MAP[collection] || {};
  // Build reverse map: snake_case → camelCase
  const reverseMap: Record<string, string> = {};
  for (const [camel, snake] of Object.entries(fieldMap)) {
    reverseMap[snake] = camel;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = reverseMap[key] || key;
    result[camelKey] = value;
  }
  return result;
}

// ============= Core CRUD Operations =============

/**
 * Fetch all records for a table, scoped to the current device/user
 */
export async function fetchCollection<T>(collection: string): Promise<T[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  const table = TABLE_MAP[collection] || collection;
  const userId = getDeviceId();

  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error(`[Supabase] Failed to fetch ${collection}:`, error.message);
      return [];
    }

    return (data || []).map((row: any) => {
      const { user_id, ...rest } = row;
      return toCamelCase(rest, table) as T;
    });
  } catch (err: any) {
    console.error(`[Supabase] Exception fetching ${collection}:`, err.message);
    return [];
  }
}

/**
 * Replace all records in a table for the current user (full sync)
 * Deletes existing records then inserts new ones
 */
export async function syncCollection(collection: string, items: any[]): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const table = TABLE_MAP[collection] || collection;
  const userId = getDeviceId();

  try {
    // Delete existing records for this user
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error(`[Supabase] Failed to clear ${collection}:`, deleteError.message);
      return false;
    }

    // Insert new records if any
    if (items.length > 0) {
      const rows = items.map(item => ({
        ...toSnakeCase(item, table),
        user_id: userId,
      }));

      const { error: insertError } = await supabase
        .from(table)
        .insert(rows);

      if (insertError) {
        console.error(`[Supabase] Failed to insert ${collection}:`, insertError.message);
        return false;
      }
    }

    return true;
  } catch (err: any) {
    console.error(`[Supabase] Exception syncing ${collection}:`, err.message);
    return false;
  }
}

/**
 * Upsert a single record
 */
export async function upsertRecord(collection: string, item: any): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const table = TABLE_MAP[collection] || collection;
  const userId = getDeviceId();

  try {
    const row = {
      ...toSnakeCase(item, table),
      user_id: userId,
    };

    const { error } = await supabase
      .from(table)
      .upsert(row);

    if (error) {
      console.error(`[Supabase] Failed to upsert ${collection}:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error(`[Supabase] Exception upserting ${collection}:`, err.message);
    return false;
  }
}

/**
 * Delete a single record by ID
 */
export async function deleteRecord(collection: string, id: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const table = TABLE_MAP[collection] || collection;

  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`[Supabase] Failed to delete from ${collection}:`, error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error(`[Supabase] Exception deleting from ${collection}:`, err.message);
    return false;
  }
}

/**
 * Fetch user profile
 */
export async function fetchUserProfile(): Promise<any | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const userId = getDeviceId();

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;

    const { user_id, ...profile } = data;
    return profile;
  } catch {
    return null;
  }
}

/**
 * Upsert user profile
 */
export async function syncUserProfile(profile: any): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const userId = getDeviceId();

  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        ...profile,
      });

    if (error) {
      console.error('[Supabase] Failed to sync user profile:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[Supabase] Exception syncing user profile:', err.message);
    return false;
  }
}

/**
 * Sync all collections to Supabase (full sync)
 */
export async function syncAllCollections(state: Record<string, any>): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const collections = Object.keys(TABLE_MAP);
  let allSuccess = true;

  for (const collection of collections) {
    const items = state[collection];
    if (Array.isArray(items)) {
      const success = await syncCollection(collection, items);
      if (!success) allSuccess = false;
    }
  }

  // Sync user profile separately
  if (state.userProfile) {
    const success = await syncUserProfile(state.userProfile);
    if (!success) allSuccess = false;
  }

  return allSuccess;
}

/**
 * Load all collections from Supabase
 */
export async function loadAllCollections(): Promise<Record<string, any> | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const [
      applications,
      interviews,
      contacts,
      companyProfiles,
      exams,
      questions,
      events,
      offers,
      resumes,
      chatHistory,
      activities,
      userProfile,
    ] = await Promise.all([
      fetchCollection<any>('applications'),
      fetchCollection<any>('interviews'),
      fetchCollection<any>('contacts'),
      fetchCollection<any>('companyProfiles'),
      fetchCollection<any>('exams'),
      fetchCollection<any>('questions'),
      fetchCollection<any>('events'),
      fetchCollection<any>('offers'),
      fetchCollection<any>('resumes'),
      fetchCollection<any>('chatHistory'),
      fetchCollection<any>('activities'),
      fetchUserProfile(),
    ]);

    return {
      applications,
      interviews,
      contacts,
      companyProfiles,
      exams,
      questions,
      events,
      offers,
      resumes,
      chatHistory,
      activities,
      ...(userProfile ? { userProfile } : {}),
    };
  } catch (err: any) {
    console.error('[Supabase] Failed to load all collections:', err.message);
    return null;
  }
}
