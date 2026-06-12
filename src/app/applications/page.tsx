'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import ViewToggle from '@/components/UI/ViewToggle';
import Button from '@/components/UI/Button';
import { useApplications, Application as AppApplication } from '@/context/DataContext';

// 视图选项
const viewOptions = [
  { id: 'kanban', label: '看板', icon: '📊' },
  { id: 'table', label: '表格', icon: '📋' },
  { id: 'card', label: '卡片', icon: '🃏' },
];

type ApplicationStatus = 'pending' | 'interviewing' | 'offer' | 'rejected';

const statusLabels: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待回复', color: 'text-[var(--foreground-muted)]', bgColor: 'bg-[var(--muted)]' },
  interviewing: { label: '面试中', color: 'text-[var(--warning)]', bgColor: 'bg-[var(--warning)]/10' },
  offer: { label: '已Offer', color: 'text-[var(--success)]', bgColor: 'bg-[var(--success)]/10' },
  rejected: { label: '已拒绝', color: 'text-[var(--error)]', bgColor: 'bg-[var(--error)]/10' },
};

const stageLabels: Record<string, string> = {
  '未投递': '未投递',
  '投递': '已投递',
  '筛选': '筛选中',
  '笔试': '笔试中',
  '一面': '一面',
  '二面': '二面',
  '三面': '三面',
  'HR面': 'HR面',
  '签约': '签约',
  'offer': 'Offer',
  '拒绝': '已拒绝',
  '库': '人才库',
};

// 添加投递表单
function AddApplicationForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: Omit<AppApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<{
    company: string;
    position: string;
    location: string;
    salary: string;
    stage: '未投递' | '投递' | '筛选' | '笔试' | '一面' | '二面' | '三面' | 'HR面' | '签约' | 'offer' | '拒绝' | '库';
    status: 'pending' | 'interviewing' | 'offer' | 'rejected';
    appliedDate: string;
    hrContact: string;
    notes: string;
    source: string;
    url: string;
  }>({
    company: '',
    position: '',
    location: '',
    salary: '',
    stage: '投递',
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0],
    hrContact: '',
    notes: '',
    source: '',
    url: '',
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.position) {
      alert('请填写公司和岗位');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司名称 *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            placeholder="如：字节跳动"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">岗位名称 *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            placeholder="如：前端开发工程师"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">工作地点</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            placeholder="如：北京"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">薪资范围</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
            placeholder="如：25-35k"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">🌐 投递链接</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          placeholder="https://jobs.bytedance.com/..."
        />
        <p className="text-xs text-[var(--foreground-muted)] mt-1">粘贴招聘帖子的链接，快速跳转查看详情</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">当前阶段</label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as AppApplication['stage'] })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          >
            {Object.entries(stageLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">投递日期</label>
          <input
            type="date"
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">HR联系人</label>
        <input
          type="text"
          value={formData.hrContact}
          onChange={(e) => setFormData({ ...formData, hrContact: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          placeholder="可选"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">备注</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

// 看板视图
function KanbanView({ apps, onTogglePool }: { apps: AppApplication[]; onTogglePool: (id: string, stage: string) => void }) {
  const columns: ApplicationStatus[] = ['pending', 'interviewing', 'offer', 'rejected'];

  const handleJump = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
            <div className="space-y-3 min-h-[200px]">
              {columnApps.length === 0 ? (
                <div className="text-center py-8 text-[var(--foreground-muted)] text-sm">
                  暂无投递
                </div>
              ) : (
                columnApps.map((app) => (
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
                      <span>📍 {app.location || '-'}</span>
                    </div>
                    {app.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJump(app.url!);
                        }}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--primary)]/90 transition-smooth"
                      >
                        🔗 一键跳转
                      </button>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-[var(--foreground-muted)]">
                        {app.stage === '库' ? '📥 备选' : app.stage}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePool(app.id, app.stage);
                        }}
                        className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--warning)]/10 hover:text-[var(--warning)] transition-smooth"
                        title={app.stage === '未投递' ? '转为已投递' : '加入备选库'}
                      >
                        {app.stage === '未投递' ? '📤 投递' : ' 备选'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 表格视图
function TableView({ apps, onTogglePool }: { apps: AppApplication[]; onTogglePool: (id: string, stage: string) => void }) {
  const handleJump = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">公司</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">岗位</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">薪资</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">地点</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">阶段</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">状态</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--foreground)]">操作</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => {
            const status = app.status as ApplicationStatus;
            const { label, color, bgColor } = statusLabels[status] || statusLabels.pending;
            return (
              <tr
                key={app.id}
                className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-smooth"
              >
                <td className="py-3 px-4">
                  <span className="font-medium text-[var(--foreground)]">{app.company}</span>
                </td>
                <td className="py-3 px-4 text-[var(--foreground-light)]">{app.position}</td>
                <td className="py-3 px-4 text-[var(--success)] font-medium">{app.salary || '-'}</td>
                <td className="py-3 px-4 text-[var(--foreground-light)]">{app.location || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-xs ${app.stage === '库' ? 'text-[var(--warning)]' : 'text-[var(--foreground-light)]'}`}>
                    {app.stage === '库' ? '📥 备选' : app.stage}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${bgColor} ${color}`}>
                    {label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {app.url ? (
                      <button
                        onClick={() => handleJump(app.url!)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--primary)]/90 transition-smooth"
                      >
                        🔗 跳转
                      </button>
                    ) : (
                      <span className="text-[var(--foreground-muted)] text-xs">-</span>
                    )}
                    <button
                      onClick={() => onTogglePool(app.id, app.stage)}
                      className="px-2 py-1.5 rounded-lg text-xs bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--warning)]/10 hover:text-[var(--warning)] transition-smooth"
                      title={app.stage === '未投递' ? '转为已投递' : '加入备选库'}
                    >
                      {app.stage === '未投递' ? '📤' : ''}
                    </button>
                  </div>
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
function CardView({ apps, onTogglePool }: { apps: AppApplication[]; onTogglePool: (id: string, stage: string) => void }) {
  const handleJump = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {apps.map((app) => {
        const status = app.status as ApplicationStatus;
        const { label, color, bgColor } = statusLabels[status] || statusLabels.pending;
        return (
          <div
            key={app.id}
            className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-smooth cursor-pointer border border-[var(--border)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">{app.company}</h4>
                <p className="text-sm text-[var(--foreground-light)]">{app.position}</p>
              </div>
              <span className="text-2xl">🏢</span>
            </div>
            <div className="space-y-2 mb-4">
              {app.salary && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--foreground-muted)]">💰</span>
                  <span className="text-[var(--success)] font-medium">{app.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--foreground-muted)]">📍</span>
                <span className="text-[var(--foreground-light)]">{app.location || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--foreground-muted)]">📋</span>
                <span className={app.stage === '库' ? 'text-[var(--warning)]' : 'text-[var(--foreground-light)]'}>
                  {app.stage === '库' ? '📥 备选' : app.stage}
                </span>
              </div>
            </div>
            {app.url && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJump(app.url!);
                }}
                className="w-full mb-3 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:bg-[var(--primary)]/90 transition-smooth"
              >
                🔗 一键跳转查看详情
              </button>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${bgColor} ${color}`}>
                {label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePool(app.id, app.stage);
                }}
                className="text-xs px-2 py-1 rounded-lg bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--warning)]/10 hover:text-[var(--warning)] transition-smooth"
                title={app.stage === '未投递' ? '转为已投递' : '加入备选库'}
              >
                {app.stage === '未投递' ? '📤 投递' : ' 备选'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ApplicationsPage() {
  const { applications, add, update } = useApplications();
  const [activeView, setActiveView] = useState('kanban');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [poolFilter, setPoolFilter] = useState<'all' | 'applied' | 'pool'>('all');

  const handleAddApplication = (data: Omit<AppApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
    add(data);
    setIsAddOpen(false);
  };

  // 切换投递/备选状态
  const handleTogglePool = (id: string, currentStage: string) => {
    const newStage = currentStage === '未投递' ? '投递' : '未投递';
    update(id, { stage: newStage as AppApplication['stage'] });
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch = !searchQuery ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    // 备选库筛选：stage === '未投递' 表示备选
    const matchesPool = poolFilter === 'all' ||
      (poolFilter === 'pool' && app.stage === '未投递') ||
      (poolFilter === 'applied' && app.stage !== '未投递');
    return matchesSearch && matchesStatus && matchesPool;
  });

  // 统计
  const poolCount = applications.filter(a => a.stage === '未投递').length;
  const appliedCount = applications.filter(a => a.stage !== '未投递').length;

  return (
    <AppLayout>
      <Header
        title="投递管理"
        subtitle={`已投递 ${appliedCount} · 备选库 ${poolCount} · 共 ${applications.length}`}
        actions={<Button onClick={() => setIsAddOpen(true)}>＋ 添加</Button>}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* 投递/备选筛选标签 + 视图切换 */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPoolFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                poolFilter === 'all'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              全部 ({applications.length})
            </button>
            <button
              onClick={() => setPoolFilter('applied')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                poolFilter === 'applied'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              已投递 ({appliedCount})
            </button>
            <button
              onClick={() => setPoolFilter('pool')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                poolFilter === 'pool'
                  ? 'bg-[var(--warning)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)] border border-[var(--border)]'
              }`}
            >
              📥 备选库 ({poolCount})
            </button>
          </div>
          <ViewToggle
            views={viewOptions}
            activeView={activeView}
            onChange={setActiveView}
          />
        </div>

        {/* 搜索和状态筛选 */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="搜索公司或岗位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none cursor-pointer"
          >
            <option value="">全部状态</option>
            <option value="pending">待回复</option>
            <option value="interviewing">面试中</option>
            <option value="offer">已Offer</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>

        {/* 视图内容 */}
        {filteredApps.length === 0 && applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">还没有投递记录</h3>
            <p className="text-[var(--foreground-muted)] mb-6">开始记录你的投递情况吧</p>
            <Button onClick={() => setIsAddOpen(true)}>＋ 添加第一个投递</Button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">{poolFilter === 'pool' ? '📥' : '🔍'}</div>
            <p className="text-[var(--foreground-light)] mb-1">
              {poolFilter === 'pool' ? '备选库还是空的' : '没有符合条件的投递'}
            </p>
            <p className="text-sm text-[var(--foreground-muted)]">
              {poolFilter === 'pool' ? '添加岗位时状态选择「未投递」即可收藏' : '试试调整筛选条件'}
            </p>
          </div>
        ) : (
          <>
            {activeView === 'kanban' && <KanbanView apps={filteredApps} onTogglePool={handleTogglePool} />}
            {activeView === 'table' && <TableView apps={filteredApps} onTogglePool={handleTogglePool} />}
            {activeView === 'card' && <CardView apps={filteredApps} onTogglePool={handleTogglePool} />}
          </>
        )}
      </div>

      {/* 添加投递弹窗 */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加投递</h2>
              <button onClick={() => setIsAddOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
            </div>
            <div className="p-6">
              <AddApplicationForm onSubmit={handleAddApplication} onCancel={() => setIsAddOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
