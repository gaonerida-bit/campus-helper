'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import StatCard from '@/components/UI/StatCard';
import Button from '@/components/UI/Button';
import GlobalSearch from '@/components/UI/GlobalSearch';
import { useApplications, useInterviews, useOffers, useEvents, useUserProfile } from '@/context/DataContext';
import { buildWeeklySchedule, getRecentApplications } from '@/lib/application-selectors';

const quickActions = [
  { id: 1, icon: '📤', title: '添加投递', href: '/applications/new', color: 'bg-[var(--primary)]' },
  { id: 2, icon: '📅', title: '记录面试', href: '/interview', color: 'bg-[var(--warning)]' },
  { id: 3, icon: '📊', title: '数据看板', href: '/dashboard', color: 'bg-purple-500' },
  { id: 4, icon: '🤝', title: '添加联系人', href: '/contacts', color: 'bg-[var(--info)]' },
  { id: 5, icon: '📝', title: '笔试题库', href: '/exam', color: 'bg-[var(--success)]' },
  { id: 6, icon: '📄', title: '简历管理', href: '/resume', color: 'bg-[var(--accent)]' },
  { id: 7, icon: '🏆', title: 'Offer对比', href: '/offer', color: 'bg-amber-500' },
  { id: 8, icon: '🤖', title: 'AI模拟面试', href: '/interview', color: 'bg-pink-500' },
];

const statusColors = {
  interview: 'text-[var(--info)] bg-[var(--info)]/10',
  viewed: 'text-[var(--primary)] bg-[var(--primary)]/10',
  applied: 'text-[var(--success)] bg-[var(--success)]/10',
  rejected: 'text-[var(--error)] bg-[var(--error)]/10',
  test: 'text-[var(--warning)] bg-[var(--warning)]/10',
};

const statusLabels = {
  interview: '面试',
  viewed: '已查看',
  applied: '已投递',
  rejected: '已拒绝',
  test: '笔试',
};

// 每日鼓励语
const encouragements = [
  '每一次投递都是离梦想更近一步，继续加油！✨',
  '秋招是一场马拉松，保持节奏，你一定能到达终点！🏃‍♀️',
  '今天的努力，明天的收获，offer 就在不远处等你！🌟',
  '相信自己，你的每一份付出都不会被辜负！💪',
  '面试是双向选择，找到最合适的才是最好的！🎯',
];

function ProgressRing({ progress, size = 60, strokeWidth = 6 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        className="text-[var(--muted)]"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-[var(--primary)] transition-all duration-500"
      />
    </svg>
  );
}

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [encouragement] = useState(() => encouragements[Math.floor(Math.random() * encouragements.length)]);

  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { offers } = useOffers();
  const { events } = useEvents();
  const { userProfile } = useUserProfile();

  const weeklySchedule = buildWeeklySchedule(events, interviews);

  // Goals from user settings (with sensible defaults)
  const goalApplications = userProfile.goals?.applications || 50;
  const goalInterviews = userProfile.goals?.interviews || 20;
  const goalReplies = userProfile.goals?.replies || 30;

  // Calculate real stats
  const stats = {
    totalApplications: applications.length,
    pendingInterview: interviews.filter(i => i.status === 'upcoming').length,
    offerReceived: offers.length,
    totalReplies: applications.filter(a => a.status !== 'pending').length,
    weeklyGoal: goalApplications,
    weeklyProgress: applications.length,
  };

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  const weekProgress = Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100);

  // Get upcoming interviews
  const upcomingInterviews = interviews
    .filter(i => i.status === 'upcoming')
    .slice(0, 3)
    .map(i => ({
      id: i.id,
      company: i.company,
      position: i.position,
      time: `${i.date} ${i.time}`,
      type: i.type,
      status: i.status
    }));

  // Get no response alerts (applications pending for more than 7 days)
  const noResponseAlerts = applications
    .filter(a => {
      if (a.status !== 'pending') return false;
      const appliedDate = new Date(a.appliedDate || a.createdAt);
      const daysSince = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince > 7;
    })
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      company: a.company,
      days: Math.floor((Date.now() - new Date(a.appliedDate || a.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      position: a.position
    }));

  return (
    <>
      <AppLayout>
        <Header
          title="欢迎回来"
          subtitle={`秋招进度：投递 ${stats.totalApplications} 家 · 面试 ${stats.pendingInterview} 场 · Offer ${stats.offerReceived} 个`}
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">搜索</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-[var(--muted-dark)] text-xs ml-2">⌘K</kbd>
              </Button>
              <Link href="/applications">
                <Button>＋ 添加投递</Button>
              </Link>
            </div>
          }
        />

        <div className="flex-1 overflow-auto p-6">
          {/* 鼓励语 */}
          <div className="mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]/70 rounded-2xl p-4 text-white">
            <p className="text-sm opacity-90">💬 每日鼓励</p>
            <p className="text-lg font-medium mt-1">
              {encouragement}
            </p>
          </div>

          {/* 统计卡片 + 进度环 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="投递总数"
              value={stats.totalApplications}
              subtitle="本季度"
              icon="📮"
              color="primary"
            />
            <StatCard
              title="待面试"
              value={stats.pendingInterview}
              subtitle="即将到来"
              icon="🎯"
              color="warning"
            />
            <StatCard
              title="收到Offer"
              value={stats.offerReceived}
              subtitle="恭喜 🎉"
              icon="🏆"
              color="success"
            />
            <StatCard
              title="已回复"
              value={stats.totalReplies}
              subtitle="招聘方回复"
              icon="💬"
              color="accent"
            />
          </div>

          {/* 目标进度 */}
          <div className="mb-8 bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">🎯 本周目标</h3>
                <p className="text-sm text-[var(--foreground-muted)]">完成 {stats.weeklyProgress}/{stats.weeklyGoal} 家投递</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ProgressRing progress={weekProgress} size={70} strokeWidth={7} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[var(--foreground)]">
                    {weekProgress}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--foreground-light)]">投递目标</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{stats.totalApplications}/{goalApplications}</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, goalApplications > 0 ? (stats.totalApplications / goalApplications) * 100 : 0)}%` }}
                  />
                </div>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--foreground-light)]">面试目标</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{stats.pendingInterview}/{goalInterviews}</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--warning)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, goalInterviews > 0 ? (stats.pendingInterview / goalInterviews) * 100 : 0)}%` }}
                  />
                </div>
              </div>
              <div className="p-4 bg-[var(--muted)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--foreground-light)]">回复目标</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{stats.totalReplies}/{goalReplies}</span>
                </div>
                <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--success)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, goalReplies > 0 ? (stats.totalReplies / goalReplies) * 100 : 0)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 本周日程 */}
          <div className="mb-8 bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">📅 本周日程</h3>
              <Link href="/calendar" className="text-sm text-[var(--primary)] hover:underline">查看完整日历</Link>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklySchedule.map((day, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl text-center transition-smooth ${
                    day.highlight
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--muted)] hover:bg-[var(--muted-dark)]'
                  }`}
                >
                  <div className={`text-xs ${day.highlight ? 'text-white/80' : 'text-[var(--foreground-muted)]'} mb-1`}>{day.day}</div>
                  <div className={`font-semibold mb-2 ${day.highlight ? 'text-white' : 'text-[var(--foreground)]'}`}>{day.dayName}</div>
                  <div className={`text-xs space-y-1 ${day.highlight ? 'text-white/90' : 'text-[var(--foreground-light)]'}`}>
                    {day.events.map((event, i) => (
                      <div key={i} className="truncate" title={event}>
                        {event === '暂无安排' ? event : event.replace(/^\d{2}:\d{2}\s/, '')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 快捷操作 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">⚡ 快捷操作</h3>
              <div className="grid grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.id} href={action.href}>
                    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth group">
                      <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-xl text-white group-hover:scale-110 transition-smooth`}>
                        {action.icon}
                      </div>
                      <span className="text-xs text-[var(--foreground)]">{action.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 无回应提醒 */}
            {noResponseAlerts.length > 0 && (
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm border-l-4 border-[var(--warning)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    ⏰ 无回应提醒
                  </h3>
                  <Link
                    href="/settings"
                    className="text-xs text-[var(--foreground-muted)] hover:underline"
                  >
                    设置提醒天数
                  </Link>
                </div>
                <div className="space-y-3">
                  {noResponseAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-[var(--warning)]/10 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {alert.company}
                        </p>
                        <p className="text-sm text-[var(--foreground-light)]">
                          {alert.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[var(--warning)] font-semibold">
                          {alert.days}天
                        </span>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          无回应
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 即将面试 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  📅 即将面试
                </h3>
                <Link
                  href="/interview"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  查看全部
                </Link>
              </div>
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {upcomingInterviews.map((interview: any) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--muted-dark)] transition-smooth cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          interview.type === '技术面' ? 'bg-[var(--primary)]/10' :
                          interview.type === 'HR面' ? 'bg-[var(--info)]/10' :
                          interview.type === '笔试' ? 'bg-[var(--warning)]/10' :
                          'bg-[var(--accent)]/10'
                        }`}>
                          {interview.type === '技术面' ? '💻' : interview.type === 'HR面' ? '👤' : interview.type === '笔试' ? '📝' : '👥'}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">
                            {interview.company}
                          </p>
                          <p className="text-sm text-[var(--foreground-light)]">
                            {interview.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {interview.time}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          {interview.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--foreground-muted)] py-8">
                  暂无面试安排，去添加面试记录吧 🎯
                </p>
              )}
            </div>

            {/* 最近投递 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  📮 最近投递
                </h3>
                <Link
                  href="/applications"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  查看全部
                </Link>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {getRecentApplications(applications, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--muted-dark)] transition-smooth cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-[var(--foreground)]">
                          {app.company}
                        </p>
                        <p className="text-sm text-[var(--foreground-light)]">
                          {app.position}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        app.status === 'pending' ? 'text-[var(--foreground-muted)] bg-[var(--muted)]' :
                        app.status === 'interviewing' ? 'text-[var(--warning)] bg-[var(--warning)]/10' :
                        app.status === 'offer' ? 'text-[var(--success)] bg-[var(--success)]/10' :
                        'text-[var(--error)] bg-[var(--error)]/10'
                      }`}>
                        {app.stage || app.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[var(--foreground-muted)] py-8">
                  还没有投递记录，开始记录吧 📤
                </p>
              )}
            </div>
          </div>

          {/* AI 助手快捷入口 */}
          <div className="mt-6 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">🤖 AI 助手</h3>
                <p className="text-white/80 text-sm">
                  有任何问题？让 AI 帮你优化简历、分析 JD、准备面试
                </p>
              </div>
              <Link href="/ai">
                <Button className="bg-white text-[var(--primary)] hover:bg-white/90">
                  开始对话
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>

      {/* 全局搜索 */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
