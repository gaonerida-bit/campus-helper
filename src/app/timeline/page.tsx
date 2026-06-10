'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useApplications, useInterviews, useActivities } from '@/context/DataContext';

const typeConfig = {
  applied: { icon: '📮', color: 'bg-[var(--primary)]', textColor: 'text-[var(--primary)]', label: '投递' },
  viewed: { icon: '👀', color: 'bg-[var(--accent)]', textColor: 'text-[var(--info)]', label: '查看' },
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', textColor: 'text-[var(--warning)]', label: '面试' },
  offer: { icon: '🏆', color: 'bg-[var(--success)]', textColor: 'text-[var(--success)]', label: 'Offer' },
  rejected: { icon: '❌', color: 'bg-[var(--error)]', textColor: 'text-[var(--error)]', label: '拒信' },
  other: { icon: '📝', color: 'bg-[var(--secondary)]', textColor: 'text-[var(--secondary)]', label: '其他' },
};

// 将状态转换为类型
const statusToType = (status: string) => {
  switch (status) {
    case 'offer': return 'offer';
    case 'rejected': return 'rejected';
    case 'interviewing': return 'interview';
    default: return 'applied';
  }
};

export default function TimelinePage() {
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { activities } = useActivities();
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

  // 从 activities 生成时间线数据
  const timelineData = useMemo(() => {
    const items: Array<{
      id: string;
      date: string;
      fullDate: string;
      time: string;
      company: string;
      position?: string;
      action: string;
      type: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'other';
      description?: string;
    }> = [];

    // 从投递记录生成
    applications.forEach(app => {
      items.push({
        id: `app-${app.id}`,
        date: formatRelativeDate(app.appliedDate),
        fullDate: app.appliedDate,
        time: '09:00',
        company: app.company,
        position: app.position,
        action: '投递成功',
        type: statusToType(app.status) as any,
      });
    });

    // 从面试记录生成
    interviews.forEach(interview => {
      items.push({
        id: `int-${interview.id}`,
        date: formatRelativeDate(interview.date),
        fullDate: interview.date,
        time: interview.time || '10:00',
        company: interview.company,
        position: interview.position,
        action: interview.status === 'completed' ? '完成面试' : '面试待参加',
        type: 'interview',
        description: interview.notes,
      });
    });

    // 从活动记录生成
    activities.forEach(activity => {
      let type: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'other' = 'other';
      if (activity.action.includes('投递')) type = 'applied';
      else if (activity.action.includes('Offer')) type = 'offer';
      else if (activity.action.includes('面试')) type = 'interview';

      items.push({
        id: `act-${activity.id}`,
        date: formatRelativeDate(activity.timestamp.split('T')[0]),
        fullDate: activity.timestamp.split('T')[0],
        time: activity.timestamp.split('T')[1]?.substring(0, 5) || '12:00',
        company: activity.company || '',
        position: activity.position,
        action: activity.action,
        type,
      });
    });

    // 按日期排序，最新的在前
    return items.sort((a, b) => b.fullDate.localeCompare(a.fullDate));
  }, [applications, interviews, activities]);

  // 格式化相对日期
  function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 14) return '1周前';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }

  const filteredData = filterType === 'all'
    ? timelineData
    : timelineData.filter(item => item.type === filterType);

  // 统计数据
  const stats = {
    total: timelineData.length,
    applied: timelineData.filter(t => t.type === 'applied').length,
    viewed: timelineData.filter(t => t.type === 'viewed').length,
    interview: timelineData.filter(t => t.type === 'interview').length,
    offer: timelineData.filter(t => t.type === 'offer').length,
    rejected: timelineData.filter(t => t.type === 'rejected').length,
  };

  return (
    <AppLayout>
      <Header
        title="时间线"
        subtitle={`${timelineData.length} 条动态记录`}
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                  viewMode === 'timeline'
                    ? 'bg-[var(--surface)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📍 时间线
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                  viewMode === 'list'
                    ? 'bg-[var(--surface)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📋 列表
              </button>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm"
            >
              <option value="all">全部类型</option>
              <option value="applied">投递</option>
              <option value="viewed">查看</option>
              <option value="interview">面试</option>
              <option value="offer">Offer</option>
              <option value="rejected">拒信</option>
            </select>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {Object.entries(stats).map(([key, value]) => {
              if (key === 'total') return null;
              const config = typeConfig[key as keyof typeof typeConfig];
              if (!config) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilterType(filterType === key ? 'all' : key)}
                  className={`bg-[var(--surface)] rounded-xl p-4 text-center transition-smooth hover:scale-105 ${
                    filterType === key ? 'ring-2 ring-[var(--primary)]' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                    {config.icon}
                  </div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">{config.label}</p>
                </button>
              );
            })}
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">暂无动态记录</h3>
              <p className="text-[var(--foreground-muted)]">开始添加投递记录，这里会显示你的所有动态</p>
            </div>
          ) : viewMode === 'timeline' ? (
            /* 时间线视图 */
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

              <div className="space-y-6">
                {filteredData.map((item, index) => {
                  const config = typeConfig[item.type] || typeConfig.other;
                  const isFirst = index === 0;

                  return (
                    <div key={item.id} className="relative flex gap-4">
                      <div className={`relative z-10 w-12 h-12 rounded-full ${config.color} flex items-center justify-center text-xl shadow-sm ${isFirst ? 'ring-4 ring-[var(--primary)]/20' : ''}`}>
                        {config.icon}
                      </div>

                      <div className={`flex-1 bg-[var(--surface)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-smooth cursor-pointer ${isFirst ? 'ring-2 ring-[var(--primary)]/30' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`text-sm font-medium ${config.textColor}`}>
                              {item.action}
                            </span>
                            <h4 className="font-semibold text-[var(--foreground)]">
                              {item.company}
                            </h4>
                            {item.position && (
                              <p className="text-sm text-[var(--foreground-muted)]">
                                {item.position}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-[var(--foreground-light)]">{item.date}</p>
                            <p className="text-[var(--foreground-muted)]">{item.time}</p>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[var(--foreground-light)] bg-[var(--muted)] rounded-lg px-3 py-2 mt-2">
                            💬 {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 列表视图 */
            <div className="space-y-3">
              {filteredData.map((item) => {
                const config = typeConfig[item.type] || typeConfig.other;
                return (
                  <div
                    key={item.id}
                    className="bg-[var(--surface)] rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-smooth cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-xl`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--foreground)]">{item.company}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${config.color} text-white`}>
                          {config.label}
                        </span>
                      </div>
                      {item.position && (
                        <p className="text-sm text-[var(--foreground-muted)]">{item.position}</p>
                      )}
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-[var(--foreground-light)]">{item.date}</p>
                      <p className="text-[var(--foreground-muted)]">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
