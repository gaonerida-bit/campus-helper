'use client';

import { useCallback, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface SyncStatus {
  lastSynced: Date | null;
  isSyncing: boolean;
  error: string | null;
}

export function useSupabaseSync() {
  const [status, setStatus] = useState<SyncStatus>({
    lastSynced: null,
    isSyncing: false,
    error: null,
  });

  const syncToCloud = useCallback(async (data: any, table: string) => {
    if (!supabase) {
      console.log('Supabase not configured, skipping sync');
      return { success: false, reason: 'not_configured' };
    }

    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const { error } = await supabase!
        .from(table)
        .upsert(data);

      if (error) throw error;

      setStatus({
        lastSynced: new Date(),
        isSyncing: false,
        error: null,
      });

      return { success: true };
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  }, []);

  const syncFromCloud = useCallback(async (table: string, userId?: string) => {
    if (!supabase) {
      return { data: null, reason: 'not_configured' };
    }

    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      let query = supabase!.from(table).select('*');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setStatus({
        lastSynced: new Date(),
        isSyncing: false,
        error: null,
      });

      return { data };
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error.message,
      }));
      return { data: null, error: error.message };
    }
  }, []);

  return {
    ...status,
    syncToCloud,
    syncFromCloud,
    isConfigured: isSupabaseConfigured(),
  };
}
