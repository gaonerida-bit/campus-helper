'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface PoolJob {
  id: string;
  company: string;
  position: string;
  salary: string;
  location: string;
  deadline: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  hasTracked: boolean;
  savedAt: string;
  notes: string;
  jdPreview: string;
}

// 不再使用模拟数据 - 用户数据完全由自己添加
const EMPTY_POOL: PoolJob[] = [];

// 来源平台图标映射
const sourceIcons: Record<string, string> = {
  'Boss直聘': '👔',
  '实习僧': '🎓',
  '牛客网': '💻',
  '官网': '🏢',
  '前程无忧': '📋',
  '脉脉': '💬',
};

// 详情模态框
function JobDetailModal({
  job,
  onClose,
  onApply,
  onDelete
}: {
  job: PoolJob;
  onClose: () => void;
  onApply: () => void;
  onDelete: () => void;
}) {
  const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{job.position}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  daysLeft > 7 ? 'bg-[var(--success)]/10 text-[var(--success)]' :
                  daysLeft > 3 ? 'bg-[var(--warning)]/10 text-[var(--warning)]' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  还剩 {daysLeft} 天
                </span>
              </div>
              <h3 className="text-lg text-[var(--foreground-light)]">{job.company}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">薪资</p>
              <p className="font-medium text-[var(--foreground)]">{job.salary}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">地点</p>
              <p className="font-medium text-[var(--foreground)]">{job.location}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">截止</p>
              <p className="font-medium text-[var(--foreground)]">{job.deadline}</p>
            </div>
          </div>

          {/* 来源 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--foreground-muted)]">来源：</span>
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--muted)] text-sm text-[var(--primary)] hover:underline"
            >
              <span>{sourceIcons[job.source] || '📌'}</span>
              {job.source}
            </a>
            <span className="text-xs text-[var(--foreground-muted)]">保存于 {job.savedAt}</span>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* JD 预览 */}
          <div>
            <h4 className="font-medium text-[var(--foreground)] mb-2">职位描述</h4>
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)] whitespace-pre-line">
                {job.jdPreview}
              </p>
              <button className="mt-3 text-sm text-[var(--primary)] hover:underline">
                查看完整 JD  →
              </button>
            </div>
          </div>

          {/* 备注 */}
          {job.notes && (
            <div>
              <h4 className="font-medium text-[var(--foreground)] mb-2">我的备注</h4>
              <div className="bg-[var(--warning)]/5 border border-[var(--warning)]/20 rounded-xl p-4">
                <p className="text-sm text-[var(--foreground-light)]">{job.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--border)]">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-smooth"
          >
            🗑️ 删除
          </button>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              关闭
            </Button>
            <Button onClick={onApply}>
              📮 立即投递
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 添加岗位表单
function AddJobForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (job: Partial<PoolJob>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<PoolJob>>({
    company: '',
    position: '',
    salary: '',
    location: '',
    deadline: '',
    source: 'Boss直聘',
    tags: [],
    notes: '',
    jdPreview: '',
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.position) {
      alert('请填写公司和职位信息');
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
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：字节跳动"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位名称 *</label>
          <input
            type="text"
            value={formData.position || ''}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：前端开发工程师"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">薪资范围</label>
          <input
            type="text"
            value={formData.salary || ''}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：400-600/天"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">工作地点</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：北京"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">截止日期</label>
          <input
            type="date"
            value={formData.deadline || ''}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">来源平台</label>
          <select
            value={formData.source || 'Boss直聘'}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="Boss直聘">👔 Boss直聘</option>
            <option value="实习僧">🎓 实习僧</option>
            <option value="牛客网">💻 牛客网</option>
            <option value="官网">🏢 官网</option>
            <option value="前程无忧">📋 前程无忧</option>
            <option value="其他">📌 其他</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位描述</label>
        <textarea
          value={formData.jdPreview || ''}
          onChange={(e) => setFormData({ ...formData, jdPreview: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
          placeholder="粘贴职位描述..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">个人备注</label>
        <input
          type="text"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          placeholder="记录重要信息，如面试注意事项..."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">添加</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function PoolPage() {
  const [jobs, setJobs] = useState<PoolJob[]>(EMPTY_POOL);
  const [filter, setFilter] = useState<'all' | 'urgent' | 'tracked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<PoolJob | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // 筛选逻辑
  const filteredJobs = jobs.filter(job => {
    // 搜索过滤
    const matchesSearch = searchQuery === '' ||
      job.company.includes(searchQuery) ||
      job.position.includes(searchQuery) ||
      job.tags.some(tag => tag.includes(searchQuery));

    // 分类过滤
    if (filter === 'urgent') {
      const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return matchesSearch && daysLeft <= 7;
    }
    if (filter === 'tracked') {
      return matchesSearch && job.hasTracked;
    }
    return matchesSearch;
  });

  // 统计
  const stats = {
    total: jobs.length,
    urgent: jobs.filter(j => {
      const daysLeft = Math.ceil((new Date(j.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 7;
    }).length,
    tracked: jobs.filter(j => j.hasTracked).length,
  };

  const handleAddJob = (jobData: Partial<PoolJob>) => {
    const newJob: PoolJob = {
      id: Date.now().toString(),
      company: jobData.company || '',
      position: jobData.position || '',
      salary: jobData.salary || '面议',
      location: jobData.location || '待定',
      deadline: jobData.deadline || '',
      source: jobData.source || '其他',
      sourceUrl: '#',
      tags: jobData.tags || [],
      hasTracked: false,
      savedAt: new Date().toISOString().split('T')[0],
      notes: jobData.notes || '',
      jdPreview: jobData.jdPreview || '',
    };
    setJobs([newJob, ...jobs]);
    setIsAddFormOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('确定要从备选库删除这个岗位吗？')) {
      setJobs(jobs.filter(j => j.id !== id));
      setSelectedJob(null);
    }
  };

  const handleApply = (job: PoolJob) => {
    // 这里可以跳转到投递页面或创建投递记录
    alert(`已将「${job.position}」添加到投递记录！`);
    setJobs(jobs.filter(j => j.id !== job.id));
    setSelectedJob(null);
  };

  const toggleTrack = (id: string) => {
    setJobs(jobs.map(j =>
      j.id === id ? { ...j, hasTracked: !j.hasTracked } : j
    ));
  };

  return (
    <AppLayout>
      <Header
        title="备选库"
        subtitle="岗位信息暂存区，投递前先收藏"
        actions={
          <div className="flex gap-3">
            <Button onClick={() => setIsAddFormOpen(true)}>＋ 添加岗位</Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.total}</p>
                <p className="text-sm text-[var(--foreground-muted)]">备选岗位</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-2xl">
                ⏰
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{stats.urgent}</p>
                <p className="text-sm text-[var(--foreground-muted)]">即将截止</p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/10 flex items-center justify-center text-2xl">
                🔔
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stats.tracked}</p>
                <p className="text-sm text-[var(--foreground-muted)]">已关注</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索公司、职位、标签..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                filter === 'all'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth flex items-center gap-1 ${
                filter === 'urgent'
                  ? 'bg-red-500 text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
              }`}
            >
              ⏰ 即将截止
            </button>
            <button
              onClick={() => setFilter('tracked')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth flex items-center gap-1 ${
                filter === 'tracked'
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
              }`}
            >
              🔔 已关注
            </button>
          </div>
        </div>

        {/* 岗位列表 */}
        <div className="space-y-3">
          {filteredJobs.length === 0 ? (
            <div className="bg-[var(--surface)] rounded-2xl p-12 text-center border border-dashed border-[var(--border)]">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-[var(--foreground-light)] mb-2">暂无岗位</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                点击右上角「添加岗位」开始收藏
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const daysLeft = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-smooth cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-xl">
                      {sourceIcons[job.source] || '📌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-[var(--foreground)]">{job.position}</h3>
                          <p className="text-sm text-[var(--foreground-muted)]">{job.company}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {daysLeft <= 7 && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              daysLeft <= 3 ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'
                            }`}>
                              还剩 {daysLeft} 天
                            </span>
                          )}
                          {job.hasTracked && (
                            <span className="px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                              🔔 已关注
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--foreground-light)]">
                        <span>{job.salary}</span>
                        <span>·</span>
                        <span>{job.location}</span>
                        <span>·</span>
                        <span>{job.source}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {job.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-[var(--muted)] text-xs text-[var(--foreground-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleTrack(job.id); }}
                      className={`p-2 rounded-lg transition-smooth ${
                        job.hasTracked
                          ? 'bg-[var(--warning)]/10 text-[var(--warning)]'
                          : 'hover:bg-[var(--muted)] text-[var(--foreground-muted)]'
                      }`}
                      title={job.hasTracked ? '取消关注' : '关注'}
                    >
                      {job.hasTracked ? '🔔' : '🔕'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 底部提示 */}
        {filteredJobs.length > 0 && (
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              💡 提示：点击岗位卡片查看详情，点击「立即投递」可将岗位转为正式投递记录
            </p>
          </div>
        )}
      </div>

      {/* 岗位详情模态框 */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => handleApply(selectedJob)}
          onDelete={() => handleDeleteJob(selectedJob.id)}
        />
      )}

      {/* 添加岗位表单模态框 */}
      {isAddFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddFormOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加岗位</h2>
              <button
                onClick={() => setIsAddFormOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <AddJobForm
                onSubmit={handleAddJob}
                onCancel={() => setIsAddFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
