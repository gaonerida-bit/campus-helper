'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import { useStats, useApplications, useInterviews, useOffers } from '@/context/DataContext';

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  accent: 'bg-[var(--accent)]',
  info: 'bg-[var(--info)]',
};

// 成就徽章
const achievementDefinitions = [
  { id: 1, icon: '🎯', title: '初出茅庐', description: '完成第一次投递', check: (stats: ReturnType<typeof useStats>['stats']) => stats.totalApplications >= 1 },
  { id: 2, icon: '💬', title: '有回音', description: '收到第一个回复', check: (stats: ReturnType<typeof useStats>['stats']) => stats.interviewingApplications >= 1 },
  { id: 3, icon: '🎯', title: '面试达人', description: '完成5次面试', check: (stats: ReturnType<typeof useStats>['stats']) => stats.completedInterviews >= 5 },
  { id: 4, icon: '🏆', title: 'Offer收割机', description: '收到3个Offer', check: (stats: ReturnType<typeof useStats>['stats']) => stats.offerReceived >= 3 },
  { id: 5, icon: '🔥', title: '海投战士', description: '投递50家公司', check: (stats: ReturnType<typeof useStats>['stats']) => stats.totalApplications >= 50 },
];

export default function DashboardPage() {
  const { stats, goals } = useStats();
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { offers } = useOffers();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  // 计算本周投递趋势（最近7天）
  const weeklyData = useMemo(() => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];

      const dayApps = applications.filter(app => app.appliedDate === dateStr).length;
      const dayInterviews = interviews.filter(int => int.date === dateStr).length;

      data.push({ day: dayName, applications: dayApps, interviews: dayInterviews });
    }

    return data;
  }, [applications, interviews]);

  const maxApplications = Math.max(...weeklyData.map(d => d.applications), 1);

  // 投递状态分布
  const statusDistribution = useMemo(() => [
    { label: '待回复', count: applications.filter(a => a.status === 'pending').length, color: 'bg-[var(--muted)]', textColor: 'text-[var(--foreground)]' },
    { label: '面试中', count: applications.filter(a => a.status === 'interviewing').length, color: 'bg-[var(--warning)]', textColor: 'text-white' },
    { label: '已Offer', count: applications.filter(a => a.status === 'offer').length, color: 'bg-[var(--success)]', textColor: 'text-white' },
    { label: '已拒绝', count: applications.filter(a => a.status === 'rejected').length, color: 'bg-[var(--error)]', textColor: 'text-white' },
  ], [applications]);

  // 成就徽章解锁状态
  const achievements = useMemo(() =>
    achievementDefinitions.map(a => ({
      ...a,
      unlocked: a.check(stats),
      progress: stats.totalApplications > 0 ? Math.min(100, (stats.totalApplications / 50) * 100) : 0
    }))
  , [stats]);

  const statCards = [
    { title: '总投递数', value: stats.totalApplications, icon: '📮', color: 'primary' },
    { title: '面试中', value: stats.interviewingApplications, icon: '💬', color: 'warning' },
    { title: '已完成面试', value: stats.completedInterviews, icon: '🎯', color: 'info' },
    { title: 'Offer', value: stats.offerReceived || offers.length, icon: '🏆', color: 'success' },
  ];

  return (
    <AppLayout>
      <Header
        title="数据看板"
        subtitle="秋招进度一目了然"
        actions={
          <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  timeRange === range
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                {range === 'week' ? '本周' : range === 'month' ? '本月' : '全部'}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.title}
                className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colorMap[stat.color]} flex items-center justify-center text-2xl text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-[var(--foreground)] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  {stat.title}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 投递趋势 */}
            <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                📊 近7天投递趋势
              </h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.map((data) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center gap-1 h-36 justify-end">
                      <div
                        className="w-8 rounded-t-lg bg-[var(--primary)] transition-all min-h-[4px]"
                        style={{ height: `${Math.max((data.applications / maxApplications) * 100, data.applications > 0 ? 10 : 0)}%` }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[var(--warning)] transition-all opacity-70 min-h-[4px]"
                        style={{ height: `${Math.max((data.interviews / maxApplications) * 50, data.interviews > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)] mt-2">
                      {data.day}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[var(--primary)]" />
                  <span className="text-sm text-[var(--foreground-light)]">投递数</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-[var(--warning)]" />
                  <span className="text-sm text-[var(--foreground-light)]">面试数</span>
                </div>
              </div>
            </div>

            {/* 投递阶段分布 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                📍 投递阶段分布
              </h3>
              <div className="space-y-4">
                {statusDistribution.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--foreground)]">
                        {item.label}
                      </span>
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {item.count}家
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          index === 0 ? 'bg-[var(--muted)]' :
                          index === 1 ? 'bg-[var(--warning)]' :
                          index === 2 ? 'bg-[var(--success)]' :
                          'bg-[var(--error)]'
                        }`}
                        style={{ width: `${Math.max(item.count / Math.max(applications.length, 1) * 100, item.count > 0 ? 10 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 成就徽章 & 进度目标 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 成就徽章 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  🏅 成就徽章
                </h3>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center p-3 rounded-xl transition-smooth ${
                      achievement.unlocked
                        ? 'bg-[var(--muted)]'
                        : 'bg-[var(--muted)]/50 opacity-60'
                    }`}
                    title={achievement.description}
                  >
                    <span className="text-2xl mb-1">{achievement.icon}</span>
                    <span className={`text-xs text-center ${
                      achievement.unlocked ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                    }`}>
                      {achievement.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 秋招目标 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                🎯 秋招目标进度
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--foreground)]">投递目标</span>
                    <span className="text-sm text-[var(--foreground-muted)]">{stats.totalApplications}/{goals.applications.target}</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all"
                      style={{ width: `${goals.applications.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--foreground)]">面试目标</span>
                    <span className="text-sm text-[var(--foreground-muted)]">{stats.completedInterviews}/{goals.interviews.target}</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--warning)] rounded-full transition-all"
                      style={{ width: `${goals.interviews.progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--foreground)]">回复目标</span>
                    <span className="text-sm text-[var(--foreground-muted)]">{Math.round(goals.replies.current)}/{goals.replies.target}</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--success)] rounded-full transition-all"
                      style={{ width: `${goals.replies.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 投递状态分布 */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
              📈 投递状态分布
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusDistribution.map((item) => (
                <div key={item.label} className="text-center">
                  <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-2xl font-bold mx-auto mb-2 ${item.textColor}`}>
                    {item.count}
                  </div>
                  <p className="text-sm text-[var(--foreground-muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
