'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useEvents, CalendarEvent as AppCalendarEvent } from '@/context/DataContext';

// ─── Timeline event data structure ──────────────────────────────────────────

interface TimelineEvent {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  title: string;
  description: string;
  isActive: boolean;
}

const TIMELINE_STORAGE_KEY = 'campus-timeline-events';

const RAW_TIMELINE_STAGES: Omit<TimelineEvent, 'isActive'>[] = [
  { id: '1', startDate: '2026-06-01', endDate: '2026-07-31', title: '秋招提前批',   description: '部分大厂提前批开放'         },
  { id: '2', startDate: '2026-07-01', endDate: '2026-08-31', title: '暑期实习转正', description: '实习期结束，转正答辩'         },
  { id: '3', startDate: '2026-08-01', endDate: '2026-09-30', title: '秋招正式批',   description: '主力招聘期，大量岗位开放'     },
  { id: '4', startDate: '2026-09-01', endDate: '2026-10-31', title: '笔试高峰期',   description: '集中笔试阶段'               },
  { id: '5', startDate: '2026-10-01', endDate: '2026-11-30', title: '秋招补录',     description: '部分岗位补招'               },
  { id: '6', startDate: '2026-11-01', endDate: '2026-12-31', title: 'Offer发放',    description: '签offer高峰期'              },
  { id: '7', startDate: '2027-02-01', endDate: '2027-03-31', title: '春招提前批',   description: '春招启动'                   },
  { id: '8', startDate: '2027-03-01', endDate: '2027-05-31', title: '春招正式批',   description: '春招主力期'                 },
];

/** Auto-detect isActive based on today's date when used as defaults. */
function buildDefaultTimelineEvents(): TimelineEvent[] {
  const today = new Date().toISOString().split('T')[0];
  return RAW_TIMELINE_STAGES.map(s => ({
    ...s,
    isActive: today >= s.startDate && today <= s.endDate,
  }));
}

const defaultTimelineEvents: TimelineEvent[] = buildDefaultTimelineEvents();

// ─── Shared helpers ──────────────────────────────────────────────────────────

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const typeConfig = {
  interview: { icon: '🎯', color: 'bg-[var(--warning)]',   borderColor: 'border-l-[var(--warning)]'   },
  test:      { icon: '📝', color: 'bg-[var(--info)]',      borderColor: 'border-l-[var(--info)]'      },
  deadline:  { icon: '⏰', color: 'bg-red-500',            borderColor: 'border-l-red-500'            },
  milestone: { icon: '🏁', color: 'bg-[var(--primary)]',   borderColor: 'border-l-[var(--primary)]'   },
  custom:    { icon: '📌', color: 'bg-[var(--secondary)]', borderColor: 'border-l-[var(--secondary)]' },
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Calendar event form (unchanged) ─────────────────────────────────────────

function AddEventForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<AppCalendarEvent, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'interview' as AppCalendarEvent['type'],
    company: '',
    description: '',
    date: '',
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.date) {
      alert('请填写标题和日期');
      return;
    }
    onSubmit({
      title: formData.title,
      type: formData.type,
      company: formData.company || undefined,
      description: formData.description || undefined,
      date: formData.date,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">事件标题 *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          placeholder="如：字节跳动技术面"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">日期 *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">类型</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as AppCalendarEvent['type'] })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          >
            <option value="interview">🎯 面试</option>
            <option value="test">📝 笔试</option>
            <option value="deadline">⏰ 截止</option>
            <option value="milestone">🏁 里程碑</option>
            <option value="custom">📌 自定义</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          placeholder="如：字节跳动"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">备注</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] h-20 resize-none"
          placeholder="添加备注..."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">添加</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// ─── Timeline event form (shared between add & edit) ─────────────────────────

function TimelineEventForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: Omit<TimelineEvent, 'id'>;
  submitLabel: string;
  onSubmit: (data: Omit<TimelineEvent, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({ ...initial });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('请填写阶段标题');
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert('请填写开始日期和结束日期');
      return;
    }
    if (formData.startDate > formData.endDate) {
      alert('开始日期不能晚于结束日期');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">阶段标题 *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          placeholder="如：秋招正式批"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">开始日期 *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">结束日期 *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">阶段描述</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] h-20 resize-none"
          placeholder="简要描述这个阶段..."
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 rounded accent-[var(--primary)]"
        />
        <span className="text-sm text-[var(--foreground-light)]">标记为「进行中」</span>
      </label>
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSubmit} className="flex-1">{submitLabel}</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

// ─── Edit modal ───────────────────────────────────────────────────────────────

function EditTimelineModal({
  event,
  onSave,
  onClose,
}: {
  event: TimelineEvent;
  onSave: (updated: TimelineEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">编辑阶段</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-light)]">✕</button>
        </div>
        <div className="p-6">
          <TimelineEventForm
            initial={{ title: event.title, startDate: event.startDate, endDate: event.endDate, description: event.description, isActive: event.isActive }}
            submitLabel="保存"
            onSubmit={(data) => onSave({ ...data, id: event.id })}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Add modal ────────────────────────────────────────────────────────────────

function AddTimelineModal({
  onSave,
  onClose,
}: {
  onSave: (event: TimelineEvent) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">新增阶段</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-light)]">✕</button>
        </div>
        <div className="p-6">
          <TimelineEventForm
            initial={{ title: '', startDate: '', endDate: '', description: '', isActive: false }}
            submitLabel="添加"
            onSubmit={(data) => onSave({ ...data, id: generateId() })}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { events, add: addEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // ── Timeline state ──────────────────────────────────────────────────────────
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(defaultTimelineEvents);
  const [isTimelineHydrated, setIsTimelineHydrated] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [isAddTimelineOpen, setIsAddTimelineOpen] = useState(false);

  // Load timeline from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(TIMELINE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimelineEvents(parsed);
        }
      } catch { /* ignore malformed data */ }
    }
    setIsTimelineHydrated(true);
  }, []);

  // Persist timeline to localStorage whenever it changes
  useEffect(() => {
    if (isTimelineHydrated) {
      localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(timelineEvents));
    }
  }, [timelineEvents, isTimelineHydrated]);

  // Timeline CRUD handlers
  const handleUpdateTimelineEvent = (updated: TimelineEvent) => {
    setTimelineEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setEditingEvent(null);
  };

  const handleDeleteTimelineEvent = (id: string) => {
    setTimelineEvents((prev) => prev.filter((e) => e.id !== id));
    setDeletingEventId(null);
  };

  const handleAddTimelineEvent = (event: TimelineEvent) => {
    setTimelineEvents((prev) => [...prev, event]);
    setIsAddTimelineOpen(false);
  };

  // Sort by startDate ascending
  const sortedTimelineEvents = [...timelineEvents].sort((a, b) =>
    a.startDate.localeCompare(b.startDate)
  );

  // ── Calendar helpers ────────────────────────────────────────────────────────
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startPadding; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  const getEventsForDate = (date: Date) =>
    events.filter((event) => event.date.split('T')[0] === date.toISOString().split('T')[0]);

  const isToday = (date: Date) => date.toISOString().split('T')[0] === todayStr;

  const handleAddEvent = (data: Omit<AppCalendarEvent, 'id' | 'createdAt'>) => {
    addEvent(data);
    setIsAddOpen(false);
  };

  const upcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <AppLayout>
      <Header
        title="校招日历"
        subtitle={`${upcomingEvents.length} 个待办事件 · 秋招进行中`}
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${view === 'calendar' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}
              >
                📅 日历
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${view === 'timeline' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}
              >
                📊 时间线
              </button>
            </div>
            {view === 'calendar' ? (
              <Button onClick={() => setIsAddOpen(true)}>＋ 添加事件</Button>
            ) : (
              <Button onClick={() => setIsAddTimelineOpen(true)}>＋ 新增阶段</Button>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* ── Calendar view ───────────────────────────────────────────────── */}
        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                    className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {year}年 {month + 1}月
                  </h3>
                  <button
                    onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                    className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-[var(--foreground-muted)] py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`} className="h-24" />;
                    const dayEvents = getEventsForDate(date);
                    const isSelected =
                      selectedDate &&
                      date.getDate() === selectedDate.getDate() &&
                      date.getMonth() === selectedDate.getMonth();
                    return (
                      <div
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`h-24 p-2 rounded-xl border cursor-pointer transition-smooth ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary)]'} ${isToday(date) ? 'ring-2 ring-[var(--primary)]' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => {
                            const config = typeConfig[event.type];
                            return (
                              <div key={event.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${config.color} text-white`}>
                                {config.icon} {event.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-[var(--foreground-muted)] px-1">
                              +{dayEvents.length - 2} 更多
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📌 即将到来</h3>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const config = typeConfig[event.type];
                    const daysUntil = Math.ceil(
                      (new Date(event.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={event.id} className={`p-3 rounded-xl border-l-4 ${config.borderColor} bg-[var(--muted)]`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">
                              {config.icon} {event.title}
                            </p>
                            {event.company && (
                              <p className="text-sm text-[var(--foreground-light)]">{event.company}</p>
                            )}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-lg ${
                              daysUntil <= 1
                                ? 'bg-red-500/10 text-red-500'
                                : daysUntil <= 3
                                ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                                : 'bg-[var(--muted-dark)] text-[var(--foreground-muted)]'
                            }`}
                          >
                            {daysUntil === 0 ? '今天' : daysUntil === 1 ? '明天' : `${daysUntil}天后`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-[var(--foreground-muted)] text-center py-4">暂无待办事件</p>
                  )}
                </div>
              </div>

              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 事件统计</h3>
                <div className="space-y-3">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const count = events.filter((e) => e.type === type).length;
                    const label =
                      type === 'interview' ? '面试'
                      : type === 'test' ? '笔试'
                      : type === 'deadline' ? '截止'
                      : type === 'milestone' ? '里程碑'
                      : '自定义';
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{config.icon}</span>
                          <span className="text-sm text-[var(--foreground-light)]">{label}</span>
                        </div>
                        <span className="font-semibold text-[var(--foreground)]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {(() => {
                const activeEvent = sortedTimelineEvents.find(e => e.isActive)
                  ?? sortedTimelineEvents.find(e => todayStr >= e.startDate && todayStr <= e.endDate);
                return (
                  <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 shadow-md text-white">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">💡</div>
                    <h3 className="font-semibold mb-2">当前阶段</h3>
                    {activeEvent ? (
                      <>
                        <p className="text-white/80 text-sm mb-2">{activeEvent.title}进行中</p>
                        <p className="text-white/60 text-xs">{activeEvent.description}</p>
                      </>
                    ) : (
                      <p className="text-white/80 text-sm">暂无进行中的校招阶段，可在时间线视图中设置</p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          /* ── Timeline view ─────────────────────────────────────────────── */
          <div className="max-w-4xl mx-auto">
            {sortedTimelineEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">还没有时间线阶段</h3>
                <p className="text-[var(--foreground-muted)] mb-6">点击右上角「新增阶段」开始规划校招时间线</p>
                <Button onClick={() => setIsAddTimelineOpen(true)}>＋ 新增阶段</Button>
              </div>
            ) : (
              <div className="relative">
                {/* Center line */}
                <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[var(--border)]" />

                <div className="space-y-8">
                  {sortedTimelineEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      {/* Card */}
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                        <div
                          className={`group relative p-4 rounded-2xl shadow-sm transition-smooth ${
                            event.isActive
                              ? 'bg-[var(--primary)] text-white'
                              : 'bg-[var(--surface)]'
                          }`}
                        >
                          {/* ── Precise date range ── */}
                          <div className="mb-2 pr-16">
                            <span
                              className={`text-xs px-2 py-1 rounded-lg inline-block font-mono ${
                                event.isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[var(--muted)] text-[var(--foreground-muted)]'
                              }`}
                            >
                              {event.startDate} 至 {event.endDate}
                            </span>
                          </div>

                          <h4
                            className={`font-semibold mb-1 ${
                              event.isActive ? 'text-white' : 'text-[var(--foreground)]'
                            }`}
                          >
                            {event.title}
                          </h4>
                          <p
                            className={`text-sm ${
                              event.isActive ? 'text-white/80' : 'text-[var(--foreground-light)]'
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

                          {/* ── Action buttons / delete confirm ── */}
                          {deletingEventId === event.id ? (
                            /* Inline delete confirmation */
                            <div className="absolute top-3 right-3 flex items-center gap-1">
                              <span
                                className={`text-xs ${
                                  event.isActive ? 'text-white/80' : 'text-[var(--foreground-muted)]'
                                }`}
                              >
                                确认删除？
                              </span>
                              <button
                                onClick={() => handleDeleteTimelineEvent(event.id)}
                                className="px-2 py-0.5 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                确认
                              </button>
                              <button
                                onClick={() => setDeletingEventId(null)}
                                className={`px-2 py-0.5 text-xs rounded-md transition-colors ${
                                  event.isActive
                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                    : 'bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground-muted)]'
                                }`}
                              >
                                取消
                              </button>
                            </div>
                          ) : (
                            /* Edit / Delete hover buttons */
                            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingEvent(event);
                                }}
                                title="编辑"
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${
                                  event.isActive
                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                    : 'bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground-light)]'
                                }`}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingEventId(event.id);
                                }}
                                title="删除"
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-colors ${
                                  event.isActive
                                    ? 'bg-white/20 hover:bg-red-400 text-white'
                                    : 'bg-[var(--muted)] hover:bg-red-100 text-[var(--foreground-light)] hover:text-red-500'
                                }`}
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Center dot */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                          event.isActive
                            ? 'bg-[var(--primary)] border-[var(--surface)]'
                            : 'bg-[var(--surface)] border-[var(--border)]'
                        }`}
                      />

                      {/* Spacer for opposite side */}
                      <div className="w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {/* Calendar event add modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加事件</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-light)]">✕</button>
            </div>
            <div className="p-6">
              <AddEventForm onSubmit={handleAddEvent} onCancel={() => setIsAddOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Timeline event edit modal */}
      {editingEvent && (
        <EditTimelineModal
          event={editingEvent}
          onSave={handleUpdateTimelineEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {/* Timeline event add modal */}
      {isAddTimelineOpen && (
        <AddTimelineModal
          onSave={handleAddTimelineEvent}
          onClose={() => setIsAddTimelineOpen(false)}
        />
      )}
    </AppLayout>
  );
}
