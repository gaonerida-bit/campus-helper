'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import WeeklyReport from '@/components/Reports/WeeklyReport';
import Button from '@/components/UI/Button';
import { useStats, useActivities, useApplications, useInterviews, useOffers } from '@/context/DataContext';

const stageLabels: Record<string, string> = {
  pending: '待回复',
  interviewing: '面试中',
  offer: '已录取',
  rejected: '已拒绝',
};

const stageColors: Record<string, string> = {
  pending: 'bg-[var(--foreground-muted)]',
  interviewing: 'bg-[var(--warning)]',
  offer: 'bg-[var(--success)]',
  rejected: 'bg-[var(--error)]',
};

const activityIcons: Record<string, string> = {
  application: '📮',
  interview: '📅',
  offer: '🏆',
  contact: '🤝',
  update: '🔄',
};

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

export default function DashboardPage() {
  const [showReport, setShowReport] = useState(false);
  const { stats, goals } = useStats();
  const { recentActivities } = useActivities();
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { offers } = useOffers();

  // Pipeline distribution
  const pipeline = useMemo(() => {
    const stages = ['pending', 'interviewing', 'offer', 'rejected'];
    return stages.map(stage => ({
      stage,
      label: stageLabels[stage],
      count: applications.filter(a => a.status === stage).length,
      color: stageColors[stage],
    }));
  }, [applications]);

  const maxPipeline = Math.max(...pipeline.map(p => p.count), 1);

  // Interview success rate
  const interviewMetrics = useMemo(() => {
    const completed = interviews.filter(i => i.status === 'completed');
    const passed = completed.filter(i => (i.rating || 0) >= 4);
    const total = completed.length;
    const passRate = total > 0 ? Math.round((passed.length / total) * 100) : 0;
    const avgRating = total > 0
      ? (completed.reduce((sum, i) => sum + (i.rating || 0), 0) / total).toFixed(1)
      : '—';
    return { total: completed.length, passed: passed.length, passRate, avgRating };
  }, [interviews]);

  // Weekly application trend (last 7 days)
  const weeklyTrend = useMemo(() => {
    const days: Array<{ label: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('zh-CN', { weekday: 'short' });
      const count = applications.filter(a => a.appliedDate === dateStr).length;
      days.push({ label: dayLabel, count });
    }
    return days;
  }, [applications]);

  const maxTrend = Math.max(...weeklyTrend.map(d => d.count), 1);

  // Top companies by application count
  const topCompanies = useMemo(() => {
    const map = new Map<string, number>();
    applications.forEach(a => map.set(a.company, (map.get(a.company) || 0) + 1));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [applications]);

  return (
    <AppLayout>
      <Header
        title="数据看板"
        subtitle={`投递 ${stats.totalApplications} · 面试 ${stats.upcomingInterviews + stats.completedInterviews} · Offer ${stats.totalOffers}`}
        actions={
          <Button
            variant="secondary"
            onClick={() => setShowReport(!showReport)}
          >
            {showReport ? '📊 收起报告' : '📊 查看周报'}
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {showReport && <WeeklyReport />}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">📮</div>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.totalApplications}</div>
            <div className="text-sm text-[var(--foreground-muted)]">投递总数</div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.upcomingInterviews}</div>
            <div className="text-sm text-[var(--foreground-muted)]">待面试</div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.totalOffers}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Offer数</div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">📞</div>
            <div className="text-3xl font-bold text-[var(--foreground)]">{stats.totalContacts}</div>
            <div className="text-sm text-[var(--foreground-muted)]">联系人</div>
          </div>
        </div>

        {/* Pipeline + Interview Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pipeline Distribution */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 投递 pipeline</h3>
            {applications.length > 0 ? (
              <div className="space-y-3">
                {pipeline.map(p => (
                  <div key={p.stage}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--foreground)]">{p.label}</span>
                      <span className="text-sm font-semibold text-[var(--foreground)]">{p.count}</span>
                    </div>
                    <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${p.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(p.count / maxPipeline) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--foreground-muted)] py-8">暂无投递数据</p>
            )}
          </div>

          {/* Interview Metrics */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📅 面试数据</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--muted)] rounded-xl text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">{interviewMetrics.total}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">已完成面试</div>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-xl text-center">
                <div className="text-2xl font-bold text-[var(--success)]">{interviewMetrics.passRate}%</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">通过率</div>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-xl text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">{interviewMetrics.avgRating}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">平均评分</div>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-xl text-center">
                <div className="text-2xl font-bold text-[var(--warning)]">{stats.upcomingInterviews}</div>
                <div className="text-xs text-[var(--foreground-muted)] mt-1">即将到来</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trend + Top Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Application Trend */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📈 近7天投递趋势</h3>
            <div className="flex items-end gap-2 h-32">
              {weeklyTrend.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-[var(--foreground)]">{d.count}</span>
                  <div
                    className="w-full bg-[var(--primary)] rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max((d.count / maxTrend) * 100, 4)}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-[var(--foreground-muted)]">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Companies */}
          <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">🏢 投递最多的公司</h3>
            {topCompanies.length > 0 ? (
              <div className="space-y-3">
                {topCompanies.map(([company, count], i) => (
                  <div key={company} className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[var(--foreground-muted)]">#{i + 1}</span>
                      <span className="font-medium text-[var(--foreground)]">{company}</span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--primary)]">{count}次</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--foreground-muted)] py-8">暂无数据</p>
            )}
          </div>
        </div>

        {/* Goal Progress */}
        <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">🎯 目标进度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--muted)] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-light)]">投递目标</span>
                <span className="text-sm font-semibold">{goals.applications.current}/{goals.applications.target}</span>
              </div>
              <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${goals.applications.progress}%` }} />
              </div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">{Math.round(goals.applications.progress)}%</div>
            </div>
            <div className="p-4 bg-[var(--muted)] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-light)]">面试目标</span>
                <span className="text-sm font-semibold">{goals.interviews.current}/{goals.interviews.target}</span>
              </div>
              <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--warning)] rounded-full transition-all" style={{ width: `${goals.interviews.progress}%` }} />
              </div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">{Math.round(goals.interviews.progress)}%</div>
            </div>
            <div className="p-4 bg-[var(--muted)] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[var(--foreground-light)]">回复目标</span>
                <span className="text-sm font-semibold">{goals.replies.current}/{goals.replies.target}</span>
              </div>
              <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--success)] rounded-full transition-all" style={{ width: `${goals.replies.progress}%` }} />
              </div>
              <div className="text-xs text-[var(--foreground-muted)] mt-1">{Math.round(goals.replies.progress)}%</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">🕐 最近动态</h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.slice(0, 10).map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-[var(--muted)] rounded-xl">
                  <span className="text-xl mt-0.5">{activityIcons[activity.type] || '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--foreground)]">
                      {activity.action}
                      {activity.company && <span className="font-semibold"> {activity.company}</span>}
                      {activity.position && <span className="text-[var(--foreground-light)]"> · {activity.position}</span>}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[var(--foreground-muted)] py-8">暂无活动记录</p>
          )}
        </div>

        {/* Usage Tips */}
        <div className="bg-[var(--surface)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">💡 使用提示</h3>
          <ul className="space-y-2 text-sm text-[var(--foreground-light)]">
            <li>• 定期查看周报，了解自己的求职进度</li>
            <li>• 点击「导出报告」可保存周报为文本文件</li>
            <li>• 数据会自动同步到 Supabase 云端</li>
            <li>• 使用快捷键 ⌘K 可快速搜索</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
