'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface CalendarEvent {
  id: number;
  date: Date;
  title: string;
  type: 'interview' | 'test' | 'deadline' | 'milestone' | 'custom';
  company?: string;
  description?: string;
}

interface TimelineEvent {
  id: number;
  period: string;
  title: string;
  description: string;
  isActive: boolean;
}

const timelineEvents: TimelineEvent[] = [
  { id: 1, period: '6-7月', title: '秋招提前批', description: '部分大厂提前批开放', isActive: false },
  { id: 2, period: '7-8月', title: '暑期实习转正', description: '实习期结束，转正答辩', isActive: false },
  { id: 3, period: '8-9月', title: '秋招正式批', description: '主力招聘期，大量岗位开放', isActive: true },
  { id: 4, period: '9-10月', title: '笔试高峰期', description: '集中笔试阶段', isActive: false },
  { id: 5, period: '10-11月', title: '秋招补录', description: '部分岗位补招', isActive: false },
  { id: 6, period: '11-12月', title: 'Offer发放', description: '签offer高峰期', isActive: false },
  { id: 7, period: '2-3月', title: '春招提前批', description: '春招启动', isActive: false },
  { id: 8, period: '3-5月', title: '春招正式批', description: '春招主力期', isActive: false },
];

// 生成模拟事件
const today = new Date();
const mockEvents: CalendarEvent[] = [
  { id: 1, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), title: '字节跳动技术面', type: 'interview', company: '字节跳动' },
  { id: 2, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), title: '腾讯HR面', type: 'interview', company: '腾讯' },
  { id: 3, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3), title: '阿里巴巴笔试', type: 'test', company: '阿里巴巴' },
  { id: 4, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), title: '美团网申截止', type: 'deadline', company: '美团' },
  { id: 5, date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), title: '网易面试', type: 'interview', company: '网易' },
];

const typeConfig = {
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', borderColor: 'border-l-[var(--warning)]' },
  test: { icon: '📝', color: 'bg-[var(--info)]', borderColor: 'border-l-[var(--info)]' },
  deadline: { icon: '⏰', color: 'bg-[var(--error)]', borderColor: 'border-l-[var(--error)]' },
  milestone: { icon: '🏁', color: 'bg-[var(--primary)]', borderColor: 'border-l-[var(--primary)]' },
  custom: { icon: '📌', color: 'bg-[var(--secondary)]', borderColor: 'border-l-[var(--secondary)]' },
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // 生成日历网格
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startPadding; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <AppLayout>
      <Header
        title="校招日历"
        subtitle="把握校招节奏，不错过关键窗口"
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  view === 'calendar'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📅 日历
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  view === 'timeline'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📊 时间线
              </button>
            </div>
            <Button>＋ 添加事件</Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 日历主区域 */}
            <div className="lg:col-span-2">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                {/* 月份导航 */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevMonth}
                    className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {year}年 {month + 1}月
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>

                {/* 星期标题 */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-[var(--foreground-muted)] py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 日期网格 */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="h-24" />;
                    }

                    const events = getEventsForDate(date);
                    const isSelected =
                      selectedDate &&
                      date.getDate() === selectedDate.getDate() &&
                      date.getMonth() === selectedDate.getMonth();
                    const today = isToday(date);

                    return (
                      <div
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          h-24 p-2 rounded-xl border cursor-pointer transition-smooth
                          ${
                            isSelected
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                              : 'border-[var(--border)] hover:border-[var(--primary)]'
                          }
                          ${today ? 'ring-2 ring-[var(--primary)]' : ''}
                        `}
                      >
                        <div
                          className={`
                          text-sm font-medium mb-1
                          ${today ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}
                        `}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event) => {
                            const config = typeConfig[event.type];
                            return (
                              <div
                                key={event.id}
                                className={`text-xs px-1.5 py-0.5 rounded truncate ${config.color} text-white`}
                              >
                                {config.icon} {event.title}
                              </div>
                            );
                          })}
                          {events.length > 2 && (
                            <div className="text-xs text-[var(--foreground-muted)] px-1">
                              +{events.length - 2} 更多
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 右侧：待办事项 */}
            <div className="space-y-6">
              {/* 即将到来 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  📌 即将到来
                </h3>
                <div className="space-y-3">
                  {mockEvents.slice(0, 4).map((event) => {
                    const config = typeConfig[event.type];
                    const daysUntil =
                      Math.ceil(
                        (event.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                      );

                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-xl border-l-4 ${config.borderColor} bg-[var(--muted)]`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">
                              {config.icon} {event.title}
                            </p>
                            {event.company && (
                              <p className="text-sm text-[var(--foreground-light)]">
                                {event.company}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-lg ${
                              daysUntil <= 1
                                ? 'bg-[var(--error)]/10 text-[var(--error)]'
                                : daysUntil <= 3
                                ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                                : 'bg-[var(--muted-dark)] text-[var(--foreground-muted)]'
                            }`}
                          >
                            {daysUntil === 0
                              ? '今天'
                              : daysUntil === 1
                              ? '明天'
                              : `${daysUntil}天后`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 校招阶段提示 */}
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 shadow-md text-white">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">
                  💡
                </div>
                <h3 className="font-semibold mb-2">当前阶段</h3>
                <p className="text-white/80 text-sm mb-2">
                  秋招正式批进行中
                </p>
                <p className="text-white/60 text-xs">
                  8-9月是主力招聘期，大量岗位开放中
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* 时间线视图 */
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* 时间线竖线 */}
              <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[var(--border)]" />

              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* 左侧内容 */}
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                      <div
                        className={`
                          p-4 rounded-2xl shadow-sm transition-smooth
                          ${
                            event.isActive
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-[var(--surface)]'
                          }
                        `}
                      >
                        <span
                          className={`
                          text-xs px-2 py-1 rounded-lg mb-2 inline-block
                          ${event.isActive ? 'bg-white/20 text-white' : 'bg-[var(--muted)] text-[var(--foreground-muted)]'}
                        `}
                        >
                          {event.period}
                        </span>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p
                          className={`text-sm ${
                            event.isActive
                              ? 'text-white/80'
                              : 'text-[var(--foreground-light)]'
                          }`}
                        >
                          {event.description}
                        </p>
                        {event.isActive && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-xs text-white/80">进行中</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 中间节点 */}
                    <div
                      className={`
                        absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2
                        ${
                          event.isActive
                            ? 'bg-[var(--primary)] border-white'
                            : 'bg-[var(--surface)] border-[var(--border)]'
                        }
                      `}
                    />

                    {/* 右侧占位 */}
                    <div className="w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
