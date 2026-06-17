'use client';

import { useCallback, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { syncAllCollections, loadAllCollections, getDeviceId } from '@/lib/supabase-service';

interface SyncStatus {
  lastSynced: Date | null;
  isSyncing: boolean;
  error: string | null;
  configured: boolean;
  deviceId: string | null;
}

export function useSupabaseSync() {
  const [status, setStatus] = useState<SyncStatus>({
    lastSynced: null,
    isSyncing: false,
    error: null,
    configured: isSupabaseConfigured(),
    deviceId: typeof window !== 'undefined' ? getDeviceId() : null,
  });

  const syncToCloud = useCallback(async (state: any) => {
    if (!isSupabaseConfigured()) {
      return { success: false, reason: 'not_configured' };
    }

    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const success = await syncAllCollections(state);

      if (!success) {
        setStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: '同步失败，请检查网络连接',
        }));
        return { success: false, error: 'Sync failed' };
      }

      setStatus({
        lastSynced: new Date(),
        isSyncing: false,
        error: null,
        configured: true,
        deviceId: getDeviceId(),
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

  const syncFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      return { data: null, reason: 'not_configured' };
    }

    setStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const data = await loadAllCollections();

      if (!data) {
        setStatus(prev => ({
          ...prev,
          isSyncing: false,
          error: '从云端加载数据失败',
        }));
        return { data: null, error: 'Load failed' };
      }

      setStatus({
        lastSynced: new Date(),
        isSyncing: false,
        error: null,
        configured: true,
        deviceId: getDeviceId(),
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
