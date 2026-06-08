'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface TimelineItem {
  id: number;
  date: string;
  fullDate: string;
  time: string;
  company: string;
  position?: string;
  action: string;
  type: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'other';
  description?: string;
}

const timelineData: TimelineItem[] = [
  { id: 1, date: '今天', fullDate: '2026-06-08', time: '14:30', company: '字节跳动', position: '前端开发工程师', action: '收到面试邀请', type: 'interview', description: '技术面，定于明天下午2点' },
  { id: 2, date: '今天', fullDate: '2026-06-08', time: '10:15', company: '美团', position: '前端研发', action: '简历被查看', type: 'viewed', description: 'HR 查看了你的简历' },
  { id: 3, date: '昨天', fullDate: '2026-06-07', time: '16:20', company: '腾讯', position: 'Web前端开发', action: '面试安排更新', type: 'interview', description: 'HR面改期为周三上午10点' },
  { id: 4, date: '昨天', fullDate: '2026-06-07', time: '09:30', company: '阿里巴巴', position: '前端工程师', action: '投递成功', type: 'applied' },
  { id: 5, date: '2天前', fullDate: '2026-06-06', time: '15:00', company: '拼多多', position: '前端开发', action: '收到拒信', type: 'rejected', description: '感谢参与，已进入人才库' },
  { id: 6, date: '3天前', fullDate: '2026-06-05', time: '11:00', company: '京东', position: '前端开发工程师', action: '投递成功', type: 'applied' },
  { id: 7, date: '4天前', fullDate: '2026-06-04', time: '14:00', company: '网易', position: 'Web前端', action: '收到面试邀请', type: 'interview', description: '笔试通过，等待技术面通知' },
  { id: 8, date: '5天前', fullDate: '2026-06-03', time: '10:00', company: '快手', position: '前端开发', action: '简历被查看', type: 'viewed' },
  { id: 9, date: '1周前', fullDate: '2026-06-01', time: '16:30', company: '滴滴', position: '前端工程师', action: '投递成功', type: 'applied' },
  { id: 10, date: '1周前', fullDate: '2026-06-01', time: '09:00', company: '美团', position: '前端研发', action: '收到Offer', type: 'offer', description: '薪资待遇：28k×15薪' },
];

const typeConfig = {
  applied: { icon: '📮', color: 'bg-[var(--primary)]', textColor: 'text-[var(--primary)]', label: '投递' },
  viewed: { icon: '👀', color: 'bg-[var(--accent)]', textColor: 'text-[var(--info)]', label: '查看' },
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', textColor: 'text-[var(--warning)]', label: '面试' },
  offer: { icon: '🏆', color: 'bg-[var(--success)]', textColor: 'text-[var(--success)]', label: 'Offer' },
  rejected: { icon: '❌', color: 'bg-[var(--error)]', textColor: 'text-[var(--error)]', label: '拒信' },
  other: { icon: '📝', color: 'bg-[var(--secondary)]', textColor: 'text-[var(--secondary)]', label: '其他' },
};

export default function TimelinePage() {
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');

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
        subtitle="所有投递动态一览"
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

          {viewMode === 'timeline' ? (
            /* 时间线视图 */
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

              <div className="space-y-6">
                {filteredData.map((item, index) => {
                  const config = typeConfig[item.type];
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
                const config = typeConfig[item.type];
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

          {/* 加载更多 */}
          <div className="mt-8 text-center">
            <Button variant="secondary">加载更多</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
