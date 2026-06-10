'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useEvents, CalendarEvent as AppCalendarEvent } from '@/context/DataContext';

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

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const typeConfig = {
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', borderColor: 'border-l-[var(--warning)]' },
  test: { icon: '📝', color: 'bg-[var(--info)]', borderColor: 'border-l-[var(--info)]' },
  deadline: { icon: '⏰', color: 'bg-red-500', borderColor: 'border-l-red-500' },
  milestone: { icon: '🏁', color: 'bg-[var(--primary)]', borderColor: 'border-l-[var(--primary)]' },
  custom: { icon: '📌', color: 'bg-[var(--secondary)]', borderColor: 'border-l-[var(--secondary)]' },
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

function AddEventForm({ onSubmit, onCancel }: { onSubmit: (data: Omit<AppCalendarEvent, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '', type: 'interview' as AppCalendarEvent['type'], company: '', description: '', date: ''
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
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="如：字节跳动技术面" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">日期 *</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">类型</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as AppCalendarEvent['type'] })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]">
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
        <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]" placeholder="如：字节跳动" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">备注</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] h-20 resize-none" placeholder="添加备注..." />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">添加</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { events, add: addEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'calendar' | 'timeline'>('calendar');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < startPadding; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  const getEventsForDate = (date: Date) => events.filter((event) => {
    const eventDate = event.date.split('T')[0];
    const dateStr = date.toISOString().split('T')[0];
    return eventDate === dateStr;
  });
  const isToday = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === todayStr;
  };

  const handleAddEvent = (data: Omit<AppCalendarEvent, 'id' | 'createdAt'>) => {
    addEvent(data);
    setIsAddOpen(false);
  };

  const upcomingEvents = events
    .filter(e => e.date >= todayStr)
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
              <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${view === 'calendar' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📅 日历</button>
              <button onClick={() => setView('timeline')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${view === 'timeline' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📊 时间线</button>
            </div>
            <Button onClick={() => setIsAddOpen(true)}>＋ 添加事件</Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        {view === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center">‹</button>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">{year}年 {month + 1}月</h3>
                  <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth flex items-center justify-center">›</button>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => <div key={day} className="text-center text-sm font-medium text-[var(--foreground-muted)] py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((date, index) => {
                    if (!date) return <div key={`empty-${index}`} className="h-24" />;
                    const events = getEventsForDate(date);
                    const isSelected = selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth();
                    return (
                      <div key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`h-24 p-2 rounded-xl border cursor-pointer transition-smooth ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] hover:border-[var(--primary)]'} ${isToday(date) ? 'ring-2 ring-[var(--primary)]' : ''}`}>
                        <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}>{date.getDate()}</div>
                        <div className="space-y-1">
                          {events.slice(0, 2).map((event) => {
                            const config = typeConfig[event.type];
                            return <div key={event.id} className={`text-xs px-1.5 py-0.5 rounded truncate ${config.color} text-white`}>{config.icon} {event.title}</div>;
                          })}
                          {events.length > 2 && <div className="text-xs text-[var(--foreground-muted)] px-1">+{events.length - 2} 更多</div>}
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
                    const daysUntil = Math.ceil((new Date(event.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={event.id} className={`p-3 rounded-xl border-l-4 ${config.borderColor} bg-[var(--muted)]`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-[var(--foreground)]">{config.icon} {event.title}</p>
                            {event.company && <p className="text-sm text-[var(--foreground-light)]">{event.company}</p>}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-lg ${daysUntil <= 1 ? 'bg-red-500/10 text-red-500' : daysUntil <= 3 ? 'bg-[var(--warning)]/10 text-[var(--warning)]' : 'bg-[var(--muted-dark)] text-[var(--foreground-muted)]'}`}>
                            {daysUntil === 0 ? '今天' : daysUntil === 1 ? '明天' : `${daysUntil}天后`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 事件统计</h3>
                <div className="space-y-3">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const count = events.filter(e => e.type === type).length;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><span>{config.icon}</span><span className="text-sm text-[var(--foreground-light)]">{type === 'interview' ? '面试' : type === 'test' ? '笔试' : type === 'deadline' ? '截止' : type === 'milestone' ? '里程碑' : '自定义'}</span></div>
                        <span className="font-semibold text-[var(--foreground)]">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 shadow-md text-white">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">💡</div>
                <h3 className="font-semibold mb-2">当前阶段</h3>
                <p className="text-white/80 text-sm mb-2">秋招正式批进行中</p>
                <p className="text-white/60 text-xs">8-9月是主力招聘期，大量岗位开放中</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-0.5 bg-[var(--border)]" />
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                      <div className={`p-4 rounded-2xl shadow-sm transition-smooth ${event.isActive ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)]'}`}>
                        <span className={`text-xs px-2 py-1 rounded-lg mb-2 inline-block ${event.isActive ? 'bg-white/20 text-white' : 'bg-[var(--muted)] text-[var(--foreground-muted)]'}`}>{event.period}</span>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <p className={`text-sm ${event.isActive ? 'text-white/80' : 'text-[var(--foreground-light)]'}`}>{event.description}</p>
                        {event.isActive && <div className="mt-2 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span className="text-xs text-white/80">进行中</span></div>}
                      </div>
                    </div>
                    <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${event.isActive ? 'bg-[var(--primary)] border-white' : 'bg-[var(--surface)] border-[var(--border)]'}`} />
                    <div className="w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加事件</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
            </div>
            <div className="p-6"><AddEventForm onSubmit={handleAddEvent} onCancel={() => setIsAddOpen(false)} /></div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
