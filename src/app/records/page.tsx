'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import { useApplications, useInterviews, useExams, useOffers } from '@/context/DataContext';

type TabType = 'interview' | 'exam' | 'offer' | 'resume';
type FilterType = 'all' | 'upcoming' | 'completed';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'interview', label: '面试', icon: '🎤' },
  { id: 'exam', label: '笔试', icon: '✏️' },
  { id: 'offer', label: 'Offer', icon: '💰' },
  { id: 'resume', label: '简历', icon: '📄' },
];

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('interview');
  const [filter, setFilter] = useState<FilterType>('all');

  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { exams } = useExams();
  const { offers } = useOffers();

  // Filter items based on status
  const filterByStatus = <T extends { status: string }>(items: T[]): T[] => {
    if (filter === 'all') return items;
    if (filter === 'upcoming') return items.filter(i => i.status === 'upcoming');
    if (filter === 'completed') return items.filter(i => i.status === 'completed');
    return items;
  };

  const filteredInterviews = filterByStatus(interviews);
  const filteredExams = filterByStatus(exams);
  const filteredOffers = offers; // Offers don't have status field

  // Get application for an item
  const getApplication = (applicationId?: string) => {
    if (!applicationId) return null;
    return applications.find(a => a.id === applicationId);
  };

  return (
    <AppLayout>
      <Header
        title="我的记录"
        subtitle={`面试 ${interviews.length} · 笔试 ${exams.length} · Offer ${offers.length}`}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Tab 导航 */}
        <div className="flex items-center gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                activeTab === tab.id
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          {/* 状态筛选 */}
          <div className="ml-auto flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm focus:outline-none cursor-pointer"
            >
              <option value="all">全部</option>
              <option value="upcoming">待进行</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>

        {/* 面试列表 */}
        {activeTab === 'interview' && (
          <div className="space-y-3">
            {filteredInterviews.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">暂无面试记录</h3>
                <p className="text-[var(--foreground-muted)]">面试记录会在投递详情中添加</p>
              </div>
            ) : (
              filteredInterviews.map(interview => {
                const app = getApplication(interview.applicationId);
                return (
                  <Link
                    key={interview.id}
                    href={app ? `/applications/${app.id}` : '#'}
                    className="block bg-[var(--surface)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-smooth border border-[var(--border)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${
                            interview.status === 'upcoming' ? 'bg-[var(--info)]' :
                            interview.status === 'completed' ? 'bg-[var(--success)]' :
                            'bg-[var(--foreground-muted)]'
                          }`} />
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {interview.company} · {interview.position}
                          </h3>
                        </div>
                        <p className="text-sm text-[var(--foreground-light)] mb-1">
                          {interview.type} · {interview.date} {interview.time}
                        </p>
                        {interview.location && (
                          <p className="text-xs text-[var(--foreground-muted)]">
                            📍 {interview.location}
                          </p>
                        )}
                        {interview.onlineLink && (
                          <p className="text-xs text-[var(--info)]">
                            🔗 线上面试
                          </p>
                        )}
                      </div>
                      <div className="text-[var(--foreground-muted)]">
                        →
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* 笔试列表 */}
        {activeTab === 'exam' && (
          <div className="space-y-3">
            {filteredExams.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">✏️</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">暂无笔试记录</h3>
                <p className="text-[var(--foreground-muted)]">笔试记录会在投递详情中添加</p>
              </div>
            ) : (
              filteredExams.map(exam => {
                const app = getApplication(exam.applicationId);
                return (
                  <Link
                    key={exam.id}
                    href={app ? `/applications/${app.id}` : '#'}
                    className="block bg-[var(--surface)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-smooth border border-[var(--border)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${
                            exam.status === 'upcoming' ? 'bg-[var(--info)]' :
                            exam.status === 'completed' ? 'bg-[var(--success)]' :
                            'bg-[var(--foreground-muted)]'
                          }`} />
                          <h3 className="font-semibold text-[var(--foreground)]">
                            {exam.company} {exam.position && `· ${exam.position}`}
                          </h3>
                        </div>
                        <p className="text-sm text-[var(--foreground-light)] mb-1">
                          {exam.type} · {exam.date} {exam.time}
                        </p>
                        {exam.duration && (
                          <p className="text-xs text-[var(--foreground-muted)]">
                            ⏱️ 时长 {exam.duration}
                          </p>
                        )}
                        {exam.score && (
                          <p className="text-xs text-[var(--success)]">
                            📊 得分 {exam.score}
                          </p>
                        )}
                      </div>
                      <div className="text-[var(--foreground-muted)]">
                        →
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* Offer 列表 */}
        {activeTab === 'offer' && (
          <div className="space-y-3">
            {filteredOffers.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">暂无 Offer</h3>
                <p className="text-[var(--foreground-muted)]">继续加油，Offer 在路上！</p>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div
                  key={offer.id}
                  className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--foreground)] mb-2">
                        {offer.company} · {offer.position}
                      </h3>
                      <p className="text-sm text-[var(--success)] mb-1">
                        💰 薪资 {offer.salary.total ? `${offer.salary.total}k` : `${offer.salary.base}k`}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        📍 {offer.location}
                      </p>
                      {offer.deadline && (
                        <p className="text-xs text-[var(--warning)]">
                          ⏰ 答复截止 {offer.deadline}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-[var(--success)]/10 text-[var(--success)] text-xs font-medium">
                      Offer
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 简历列表 */}
        {activeTab === 'resume' && (
          <div className="space-y-3">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">简历功能即将开放</h3>
              <p className="text-[var(--foreground-muted)]">后续版本将支持在投递详情中管理定制简历</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
