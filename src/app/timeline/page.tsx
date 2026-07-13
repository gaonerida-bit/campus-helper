'use client';

import { useState, useMemo } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useApplications, useInterviews, useActivities, useOffers } from '@/context/DataContext';

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
  const { offers } = useOffers();
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'journey'>('journey');

  // Career journey stages
  const journeyStages = [
    { id: 'preparing', label: '准备阶段', icon: '📚', description: '简历制作、投递准备' },
    { id: 'applied', label: '投递中', icon: '📮', description: '积极投递中' },
    { id: 'screening', label: '笔试/一面', icon: '💻', description: '通过筛选' },
    { id: 'interviewing', label: '面试中', icon: '🎯', description: '多轮面试' },
    { id: 'offer', label: '收获Offer', icon: '🏆', description: '等待签约' },
  ];

  // Calculate current stage based on data
  const getCurrentStage = () => {
    if (offers.length > 0) return 4;
    const interviewingCount = applications.filter(a => a.status === 'interviewing').length;
    if (interviewingCount > 0) return 3;
    const hasInterviews = interviews.some(i => i.status === 'completed');
    if (hasInterviews) return 2;
    if (applications.length > 0) return 1;
    return 0;
  };

  const currentStage = getCurrentStage();

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
                onClick={() => setViewMode('journey')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${
                  viewMode === 'journey'
                    ? 'bg-[var(--surface)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                🗺️ 求职历程
              </button>
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

          {filteredData.length === 0 && viewMode !== 'journey' ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">暂无动态记录</h3>
              <p className="text-[var(--foreground-muted)]">开始添加投递记录，这里会显示你的所有动态</p>
            </div>
          ) : viewMode === 'journey' ? (
            /* 求职历程视图 */
            <div className="space-y-6">
              {/* 求职进度卡 */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">🎯 求职进度</h3>
                    <p className="text-white/80 text-sm mt-1">秋招第 {Math.ceil((Date.now() - new Date('2026-08-01').getTime()) / (1000 * 60 * 60 * 24))} 天</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{stats.applied}</p>
                    <p className="text-white/80 text-sm">累计投递</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${Math.min(100, (currentStage / 4) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round((currentStage / 4) * 100)}%</span>
                </div>
              </div>

              {/* 求职历程图 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">🗺️ 求职历程</h3>
                <div className="flex items-start justify-between">
                  {journeyStages.map((stage, index) => {
                    const isCompleted = index <= currentStage;
                    const isCurrent = index === currentStage;
                    return (
                      <div key={stage.id} className="flex-1 flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                          isCompleted
                            ? 'bg-[var(--primary)] text-white shadow-lg'
                            : isCurrent
                            ? 'bg-[var(--warning)] text-white shadow-lg animate-pulse'
                            : 'bg-[var(--muted)] text-[var(--foreground-muted)]'
                        }`}>
                          {stage.icon}
                        </div>
                        {index < journeyStages.length - 1 && (
                          <div className={`h-1 w-full mt-4 mb-2 ${
                            index < currentStage ? 'bg-[var(--primary)]' : 'bg-[var(--muted)]'
                          }`} />
                        )}
                        <p className={`text-sm font-medium text-center mt-2 ${
                          isCompleted ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'
                        }`}>
                          {stage.label}
                        </p>
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] mt-1">
                            进行中
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 数据统计卡 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-[var(--primary)]">{applications.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">投递总数</p>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-[var(--warning)]">{interviews.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">面试总数</p>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-[var(--success)]">{offers.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">收到Offer</p>
                </div>
                <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-[var(--accent)]">{applications.filter(a => a.status === 'rejected').length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">收到拒信</p>
                </div>
              </div>

              {/* 转化率漏斗 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 转化漏斗</h3>
                <div className="space-y-3">
                  {[
                    { label: '投递', count: applications.length, color: 'bg-[var(--primary)]', width: 100 },
                    { label: '简历通过', count: Math.round(applications.length * 0.6), color: 'bg-[var(--info)]', width: 60 },
                    { label: '笔试通过', count: Math.round(applications.length * 0.35), color: 'bg-[var(--warning)]', width: 35 },
                    { label: '面试通过', count: Math.round(applications.length * 0.15), color: 'bg-[var(--accent)]', width: 15 },
                    { label: 'Offer', count: offers.length, color: 'bg-[var(--success)]', width: Math.max(5, (offers.length / applications.length) * 100) },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-[var(--foreground-light)]">{item.label}</span>
                      <div className="flex-1 h-6 bg-[var(--muted)] rounded-lg overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-lg transition-all flex items-center justify-end pr-2`}
                          style={{ width: `${item.width}%` }}
                        >
                          <span className="text-xs font-medium text-white">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 最近动态 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📌 最近动态</h3>
                <div className="space-y-3">
                  {timelineData.slice(0, 5).map((item) => {
                    const config = typeConfig[item.type] || typeConfig.other;
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl">
                        <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-lg`}>
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-[var(--foreground)]">{item.company}</p>
                          <p className="text-sm text-[var(--foreground-muted)]">{item.action}</p>
                        </div>
                        <span className="text-sm text-[var(--foreground-muted)]">{item.date}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() => setViewMode('timeline')}
                className="w-full"
                variant="secondary"
              >
                查看完整时间线 →
              </Button>
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
