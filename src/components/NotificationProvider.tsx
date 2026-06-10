'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApplications, useInterviews, useApp } from '@/context/DataContext';

interface Encouragement {
  id: string;
  message: string;
  type: 'success' | 'encourage' | 'warning' | 'milestone';
  icon: string;
  timestamp: number;
}

// Encouragement messages
const encouragements: { type: 'success' | 'encourage' | 'warning' | 'milestone'; icon: string; messages: string[] }[] = [
  { type: 'success', icon: '🎉', messages: [
    '太棒了！又完成了一次投递，加油！💪',
    '每一次投递都是进步，继续保持！',
    '投递顺利！相信自己的能力！',
  ]},
  { type: 'encourage', icon: '🌟', messages: [
    '校招是一场马拉松，保持节奏最重要',
    '今天也要元气满满地投简历呀！',
    '每一家公司都是机会，继续加油！',
  ]},
  { type: 'warning', icon: '⏰', messages: [
    '有些投递很久没更新了，要不要跟进一下？',
    '今天的你比昨天更接近梦想',
    '别忘了关注即将截止的网申哦',
  ]},
  { type: 'milestone', icon: '🏆', messages: [
    '解锁成就：投递达人！',
    '你已经完成了重要的里程碑！',
    '庆祝一下，你的努力在积累！',
  ]},
];

const milestoneThresholds = [1, 5, 10, 20, 50];

export default function NotificationProvider({ children }: { children?: React.ReactNode }) {
  const [currentEncouragement, setCurrentEncouragement] = useState<Encouragement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { applications } = useApplications();
  const { upcomingInterviews } = useInterviews();
  const { state } = useApp();

  // Check for reminders
  const checkReminders = useCallback(() => {
    const now = new Date();

    // Check for upcoming interviews
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const upcomingTomorrow = upcomingInterviews.filter(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate >= tomorrow && interviewDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
    });

    if (upcomingTomorrow.length > 0) {
      const companies = upcomingTomorrow.map(i => i.company).join('、');
      showEncouragement({
        type: 'warning',
        icon: '📅',
        message: `明天有 ${upcomingTomorrow.length} 场面试：${companies}`,
      });
      return;
    }

    // Check for milestone achievements
    const prevCount = parseInt(localStorage.getItem('last-encouragement-count') || '0', 10);
    for (const threshold of milestoneThresholds) {
      if (applications.length >= threshold && prevCount < threshold) {
        showEncouragement({
          type: 'milestone',
          icon: '🎯',
          message: `恭喜！投递数量突破 ${threshold} 家！`,
        });
        localStorage.setItem('last-encouragement-count', applications.length.toString());
        return;
      }
    }

    // Random encouragement (once per day)
    const lastEncouragement = localStorage.getItem('last-encouragement-date');
    const today = now.toISOString().split('T')[0];

    if (lastEncouragement !== today) {
      const randomType = encouragements[Math.floor(Math.random() * encouragements.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];
      showEncouragement({
        type: randomType.type,
        icon: randomType.icon,
        message: randomMessage,
      });
      localStorage.setItem('last-encouragement-date', today);
    }
  }, [applications.length, upcomingInterviews]);

  const showEncouragement = (enc: Omit<Encouragement, 'id' | 'timestamp'>) => {
    setCurrentEncouragement({
      ...enc,
      id: `${Date.now()}`,
      timestamp: Date.now(),
    });
    setIsVisible(true);
  };

  const dismiss = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentEncouragement(null), 300);
  };

  // Check reminders on mount and periodically
  useEffect(() => {
    // Initial check after a short delay
    const timer = setTimeout(checkReminders, 3000);
    return () => clearTimeout(timer);
  }, [checkReminders]);

  // Check reminders every hour
  useEffect(() => {
    const interval = setInterval(checkReminders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkReminders]);

  // Request notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        Notification.requestPermission();
      }, 30000); // Ask after 30 seconds
    }
  }, []);

  // Browser push notifications for reminders
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const interval = setInterval(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0); // 9 AM

        const upcomingTomorrow = upcomingInterviews.filter(interview => {
          const interviewDate = new Date(interview.date);
          return interviewDate >= tomorrow && interviewDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
        });

        if (upcomingTomorrow.length > 0 && new Date().getHours() === 9) {
          new Notification('校招助手提醒', {
            body: `明天有 ${upcomingTomorrow.length} 场面试，记得准备好哦！`,
            icon: '/icons/icon-192.svg',
          });
        }
      }, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [upcomingInterviews]);

  return (
    <>
      {children}

      {/* Encouragement Toast */}
      {currentEncouragement && (
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className={`
            px-6 py-4 rounded-2xl shadow-lg max-w-sm
            ${currentEncouragement.type === 'success' ? 'bg-[var(--success)]/90 text-white' : ''}
            ${currentEncouragement.type === 'encourage' ? 'bg-[var(--encourage)]/90 text-white' : ''}
            ${currentEncouragement.type === 'warning' ? 'bg-[var(--warning)]/90 text-white' : ''}
            ${currentEncouragement.type === 'milestone' ? 'bg-[var(--primary)]/90 text-white' : ''}
          `}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentEncouragement.icon}</span>
              <p className="text-sm font-medium">{currentEncouragement.message}</p>
            </div>
            <button
              onClick={dismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
