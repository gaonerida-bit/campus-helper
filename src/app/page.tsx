'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import StatCard from '@/components/UI/StatCard';
import Button from '@/components/UI/Button';
import GlobalSearch from '@/components/UI/GlobalSearch';

// 模拟数据 - 后续会从数据库获取
const stats = {
  totalApplications: 24,
  pendingInterview: 3,
  offerReceived: 1,
  totalReplies: 8,
};

const upcomingInterviews = [
  { id: 1, company: '字节跳动', position: '前端开发工程师', time: '明天 14:00', type: '技术面' },
  { id: 2, company: '腾讯', position: 'Web前端开发', time: '周三 10:00', type: 'HR面' },
  { id: 3, company: '阿里巴巴', position: '前端工程师', time: '周五 15:30', type: '笔试' },
];

const recentActivities = [
  { id: 1, company: '美团', action: '收到面试邀请', time: '2小时前', status: 'interview' },
  { id: 2, company: '京东', action: '简历被查看', time: '5小时前', status: 'viewed' },
  { id: 3, company: '拼多多', action: '投递成功', time: '昨天', status: 'applied' },
  { id: 4, company: '网易', action: '收到拒信', time: '2天前', status: 'rejected' },
];

const noResponseAlerts = [
  { id: 1, company: '小红书', days: 7, position: '前端开发' },
  { id: 2, company: '携程', days: 10, position: 'Web前端' },
];

const statusColors = {
  interview: 'text-[var(--info)]',
  viewed: 'text-[var(--primary)]',
  applied: 'text-[var(--success)]',
  rejected: 'text-[var(--error)]',
};

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  return (
    <>
      <AppLayout>
        <Header
          title="欢迎回来，Nerida"
          subtitle="秋招进度：投递 24 家 · 面试 3 场 · Offer 1 个"
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
              <Link href="/applications/new">
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
              每一次投递都是离梦想更近一步，继续加油！✨
            </p>
          </div>

          {/* 统计卡片区域 */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-xl hover:bg-[var(--muted-dark)] transition-smooth cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {interview.company}
                      </p>
                      <p className="text-sm text-[var(--foreground-light)]">
                        {interview.position}
                      </p>
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
            </div>

            {/* 最近动态 */}
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  ⚡ 最近动态
                </h3>
                <Link
                  href="/timeline"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 hover:bg-[var(--muted)] rounded-xl transition-smooth cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="text-[var(--foreground)]">
                        <span className="font-medium">{activity.company}</span>
                        <span className="text-[var(--foreground-light)]">
                          {' - '}{activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {activity.time}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${statusColors[activity.status as keyof typeof statusColors]}`}
                    >
                      {activity.status === 'interview' && '面试'}
                      {activity.status === 'viewed' && '已查看'}
                      {activity.status === 'applied' && '已投递'}
                      {activity.status === 'rejected' && '已拒绝'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI 助手快捷入口 */}
          <div className="mt-6 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">🤖 AI 助手</h3>
                <p className="white/80 text-sm">
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
