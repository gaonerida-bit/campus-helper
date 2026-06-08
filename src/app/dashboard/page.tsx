'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';

interface StatCard {
  title: string;
  value: number;
  change?: number;
  icon: string;
  color: string;
}

interface WeeklyData {
  day: string;
  applications: number;
  interviews: number;
}

interface CompanySource {
  name: string;
  count: number;
  percentage: number;
}

const stats: StatCard[] = [
  { title: '总投递数', value: 24, change: 12, icon: '📮', color: 'primary' },
  { title: '收到回复', value: 8, change: 25, icon: '💬', color: 'success' },
  { title: '面试机会', value: 5, change: 67, icon: '🎯', color: 'warning' },
  { title: 'Offer', value: 1, change: 0, icon: '🏆', color: 'accent' },
];

const weeklyData: WeeklyData[] = [
  { day: '周一', applications: 3, interviews: 1 },
  { day: '周二', applications: 5, interviews: 0 },
  { day: '周三', applications: 2, interviews: 2 },
  { day: '周四', applications: 4, interviews: 1 },
  { day: '周五', applications: 6, interviews: 0 },
  { day: '周六', applications: 1, interviews: 0 },
  { day: '周日', applications: 3, interviews: 1 },
];

const companySources: CompanySource[] = [
  { name: 'Boss直聘', count: 8, percentage: 33 },
  { name: '官网投递', count: 6, percentage: 25 },
  { name: '牛客网', count: 5, percentage: 21 },
  { name: '内推', count: 3, percentage: 13 },
  { name: '实习僧', count: 2, percentage: 8 },
];

const achievements = [
  { id: 1, icon: '🎯', title: '初出茅庐', description: '完成第一次投递', unlocked: true, progress: 100 },
  { id: 2, icon: '💬', title: '有回音', description: '收到第一个回复', unlocked: true, progress: 100 },
  { id: 3, icon: '🎯', title: '面试达人', description: '完成5次面试', unlocked: false, progress: 60 },
  { id: 4, icon: '🏆', title: 'Offer收割机', description: '收到3个Offer', unlocked: false, progress: 33 },
  { id: 5, icon: '🔥', title: '连续投递', description: '连续7天投递', unlocked: false, progress: 71 },
];

const colorMap: Record<string, string> = {
  primary: 'bg-[var(--primary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  accent: 'bg-[var(--accent)]',
  info: 'bg-[var(--info)]',
};

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const maxApplications = Math.max(...weeklyData.map(d => d.applications));

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
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colorMap[stat.color]} flex items-center justify-center text-2xl text-white`}>
                    {stat.icon}
                  </div>
                  {stat.change !== undefined && stat.change !== 0 && (
                    <span className={`text-sm font-medium ${stat.change > 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                      {stat.change > 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                    </span>
                  )}
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
            {/* 本周投递趋势 */}
            <div className="lg:col-span-2 bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                📊 本周投递趋势
              </h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.map((data, index) => (
                  <div key={data.day} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center gap-1 h-36 justify-end">
                      <div
                        className="w-8 rounded-t-lg bg-[var(--primary)] transition-all"
                        style={{ height: `${(data.applications / maxApplications) * 100}%` }}
                      />
                      <div
                        className="w-8 rounded-t-lg bg-[var(--warning)] transition-all opacity-70"
                        style={{ height: `${(data.interviews / maxApplications) * 50}%` }}
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

            {/* 投递渠道 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">
                📍 投递渠道分布
              </h3>
              <div className="space-y-4">
                {companySources.map((source, index) => (
                  <div key={source.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--foreground)]">
                        {source.name}
                      </span>
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {source.count}家
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          index === 0 ? 'bg-[var(--primary)]' :
                          index === 1 ? 'bg-[var(--info)]' :
                          index === 2 ? 'bg-[var(--warning)]' :
                          'bg-[var(--accent)]'
                        }`}
                        style={{ width: `${source.percentage}%` }}
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
                    <span className="text-sm text-[var(--foreground-muted)]">24/50</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full transition-all"
                      style={{ width: '48%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--foreground)]">面试目标</span>
                    <span className="text-sm text-[var(--foreground-muted)]">5/20</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--warning)] rounded-full transition-all"
                      style={{ width: '25%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[var(--foreground)]">回复率目标</span>
                    <span className="text-sm text-[var(--foreground-muted)]">33%/40%</span>
                  </div>
                  <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--success)] rounded-full transition-all"
                      style={{ width: '82.5%' }}
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: '待筛选', count: 8, color: 'bg-[var(--muted)]', textColor: 'text-[var(--foreground)]' },
                { label: '笔试中', count: 3, color: 'bg-[var(--info)]', textColor: 'text-white' },
                { label: '面试中', count: 5, color: 'bg-[var(--warning)]', textColor: 'text-white' },
                { label: '已通过', count: 2, color: 'bg-[var(--success)]', textColor: 'text-white' },
                { label: '已拒绝', count: 6, color: 'bg-[var(--error)]', textColor: 'text-white' },
              ].map((item) => (
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
