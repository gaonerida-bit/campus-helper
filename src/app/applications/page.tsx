'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import ViewToggle from '@/components/UI/ViewToggle';
import Button from '@/components/UI/Button';

// 视图选项
const viewOptions = [
  { id: 'kanban', label: '看板', icon: '📊' },
  { id: 'table', label: '表格', icon: '📋' },
  { id: 'card', label: '卡片', icon: '🃏' },
];

// 投递状态
type ApplicationStatus = 'pending' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: number;
  company: string;
  position: string;
  salary?: string;
  location: string;
  status: ApplicationStatus;
  updateTime: string;
  hrContact?: string;
  notes?: string;
}

// 模拟数据
const applications: Application[] = [
  { id: 1, company: '字节跳动', position: '前端开发工程师', salary: '35-50k', location: '北京', status: 'interview', updateTime: '今天', hrContact: '张经理' },
  { id: 2, company: '腾讯', position: 'Web前端开发', salary: '30-45k', location: '深圳', status: 'interview', updateTime: '昨天' },
  { id: 3, company: '阿里巴巴', position: '前端工程师', salary: '40-60k', location: '杭州', status: 'pending', updateTime: '3天前' },
  { id: 4, company: '美团', position: '前端研发', salary: '28-40k', location: '北京', status: 'offer', updateTime: '2天前', notes: '等结果' },
  { id: 5, company: '京东', position: '前端开发', salary: '25-35k', location: '北京', status: 'pending', updateTime: '5天前' },
  { id: 6, company: '拼多多', position: '前端工程师', salary: '45-70k', location: '上海', status: 'rejected', updateTime: '1周前' },
  { id: 7, company: '网易', position: 'Web前端', salary: '25-38k', location: '杭州', status: 'pending', updateTime: '1周前' },
  { id: 8, company: '快手', position: '前端开发工程师', salary: '35-55k', location: '北京', status: 'interview', updateTime: '今天' },
];

const statusLabels: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待回复', color: 'text-[var(--foreground-muted)]', bgColor: 'bg-[var(--muted)]' },
  interview: { label: '面试中', color: 'text-[var(--warning)]', bgColor: 'bg-[var(--warning)]/10' },
  offer: { label: '已Offer', color: 'text-[var(--success)]', bgColor: 'bg-[var(--success)]/10' },
  rejected: { label: '已拒绝', color: 'text-[var(--error)]', bgColor: 'bg-[var(--error)]/10' },
};

// 看板视图
function KanbanView({ apps }: { apps: Application[] }) {
  const columns: ApplicationStatus[] = ['pending', 'interview', 'offer', 'rejected'];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((status) => {
        const columnApps = apps.filter((app) => app.status === status);
        const { label, color, bgColor } = statusLabels[status];

        return (
          <div key={status} className="flex-shrink-0 w-72">
            <div className={`${bgColor} rounded-xl p-3 mb-3`}>
              <h3 className={`font-semibold ${color}`}>
                {label} ({columnApps.length})
              </h3>
            </div>
            <div className="space-y-3">
              {columnApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-[var(--surface)] rounded-xl p-4 shadow-sm hover:shadow-md transition-smooth cursor-pointer border border-[var(--border)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-[var(--foreground)]">
                      {app.company}
                    </h4>
                    {app.salary && (
                      <span className="text-xs text-[var(--success)] font-medium">
                        {app.salary}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--foreground-light)] mb-2">
                    {app.position}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                    <span>📍 {app.location}</span>
                    <span>·</span>
                    <span>{app.updateTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 表格视图
function TableView({ apps }: { apps: Application[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              公司
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              岗位
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              薪资
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              地点
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              状态
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">
              更新时间
            </th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => {
            const { label, color, bgColor } = statusLabels[app.status];
            return (
              <tr
                key={app.id}
                className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-smooth cursor-pointer"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-[var(--foreground)]">
                    {app.company}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--foreground-light)]">
                  {app.position}
                </td>
                <td className="py-3 px-4 text-[var(--success)] font-medium">
                  {app.salary || '-'}
                </td>
                <td className="py-3 px-4 text-[var(--foreground-light)]">
                  {app.location}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${bgColor} ${color}`}
                  >
                    {label}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--foreground-muted)] text-sm">
                  {app.updateTime}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 卡片视图
function CardView({ apps }: { apps: Application[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {apps.map((app) => {
        const { label, color, bgColor } = statusLabels[app.status];
        return (
          <div
            key={app.id}
            className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-smooth cursor-pointer border border-[var(--border)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">
                  {app.company}
                </h4>
                <p className="text-sm text-[var(--foreground-light)]">
                  {app.position}
                </p>
              </div>
              <span className="text-2xl">🏢</span>
            </div>
            <div className="space-y-2 mb-4">
              {app.salary && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--foreground-muted)]">💰</span>
                  <span className="text-[var(--success)] font-medium">
                    {app.salary}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--foreground-muted)]">📍</span>
                <span className="text-[var(--foreground-light)]">
                  {app.location}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-medium ${bgColor} ${color}`}
              >
                {label}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {app.updateTime}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ApplicationsPage() {
  const [activeView, setActiveView] = useState('kanban');

  return (
    <AppLayout>
      <Header
        title="投递管理"
        subtitle={`共 ${applications.length} 家公司的投递记录`}
        actions={
          <Button>＋ 添加投递</Button>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* 视图切换器 */}
        <div className="flex items-center justify-between mb-6">
          <ViewToggle
            views={viewOptions}
            activeView={activeView}
            onChange={setActiveView}
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="搜索公司或岗位..."
              className="px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64"
            />
            <select className="px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none cursor-pointer">
              <option value="">全部状态</option>
              <option value="pending">待回复</option>
              <option value="interview">面试中</option>
              <option value="offer">已Offer</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        {/* 视图内容 */}
        {activeView === 'kanban' && <KanbanView apps={applications} />}
        {activeView === 'table' && <TableView apps={applications} />}
        {activeView === 'card' && <CardView apps={applications} />}
      </div>
    </AppLayout>
  );
}
