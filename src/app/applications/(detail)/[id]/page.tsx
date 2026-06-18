'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/Layout/AppLayout';
import Button from '@/components/UI/Button';
import { useApplications, useInterviews, useExams, useOffers, useActivities, Application as AppApplication } from '@/context/DataContext';
import { usePipeline } from '@/context/PipelineContext';

const nodeTypeConfig = {
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', label: '面试' },
  test: { icon: '📝', color: 'bg-[var(--info)]', label: '笔试' },
  screening: { icon: '📋', color: 'bg-[var(--primary)]', label: '筛选' },
  offer: { icon: '🎉', color: 'bg-[var(--success)]', label: 'Offer' },
  other: { icon: '📌', color: 'bg-[var(--secondary)]', label: '其他' },
};

type TabType = 'overview' | 'resume' | 'exam' | 'interview' | 'offer' | 'attachment' | 'timeline';

// 编辑投递表单
function EditApplicationForm({
  application,
  onSubmit,
  onCancel
}: {
  application: AppApplication;
  onSubmit: (data: Partial<AppApplication>) => void;
  onCancel: () => void;
}) {
  const { nodes: pipelineNodes } = usePipeline();

  const [formData, setFormData] = useState({
    company: application.company,
    position: application.position,
    location: application.location || '',
    salary: application.salary || '',
    stage: application.stage,
    status: application.status,
    appliedDate: application.appliedDate,
    hrContact: application.hrContact || '',
    notes: application.notes || '',
    source: application.source || '',
    url: application.url || '',
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">岗位名称 *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">薪资范围</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
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
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">当前阶段</label>
          <select
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)]"
          >
            {pipelineNodes.map((node) => (
              <option key={node.id} value={node.name}>{node.name}</option>
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
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">备注</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] h-20 resize-none"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">保存</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { applications, update, remove } = useApplications();
  const { interviews } = useInterviews();
  const { exams } = useExams();
  const { offers } = useOffers();
  const { activities } = useActivities();
  const { nodes: pipelineNodes } = usePipeline();

  const application = applications.find(a => a.id === id);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!application) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">未找到投递记录</h2>
            <Link href="/applications">
              <Button>返回投递管理</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleStageChange = (newStage: string) => {
    update(id, { stage: newStage, updatedAt: new Date().toISOString() });
  };

  const handleEdit = (data: Partial<AppApplication>) => {
    update(id, { ...data, updatedAt: new Date().toISOString() });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    remove(id);
    setIsDeleteConfirmOpen(false);
    router.push('/applications');
  };

  // Get related data for this application
  const appInterviews = interviews.filter(i => i.applicationId === id);
  const appExams = exams.filter(e => e.applicationId === id);
  const appOffers = offers.filter(o => o.company === application.company && o.position === application.position);

  // Build timeline events for this application
  type TimelineEvent = { time: string; icon: string; color: string; title: string; detail?: string };
  const timelineEvents: TimelineEvent[] = [];

  // Application creation
  timelineEvents.push({
    time: application.createdAt,
    icon: '📮',
    color: 'border-[var(--primary)]',
    title: '创建投递记录',
    detail: `${application.company} · ${application.position}`,
  });

  // Activities related to this application
  activities
    .filter(a => a.company === application.company || a.position === application.position)
    .forEach(a => {
      const iconMap: Record<string, string> = { application: '📮', interview: '📅', offer: '🏆', contact: '🤝', update: '🔄' };
      const colorMap: Record<string, string> = {
        application: 'border-[var(--primary)]',
        interview: 'border-[var(--warning)]',
        offer: 'border-[var(--success)]',
        contact: 'border-[var(--info)]',
        update: 'border-[var(--foreground-muted)]',
      };
      timelineEvents.push({
        time: a.timestamp,
        icon: iconMap[a.type] || '📌',
        color: colorMap[a.type] || 'border-[var(--foreground-muted)]',
        title: a.action,
        detail: [a.company, a.position].filter(Boolean).join(' · '),
      });
    });

  // Interviews
  appInterviews.forEach(i => {
    timelineEvents.push({
      time: `${i.date}T${i.time}`,
      icon: i.type === '技术面' ? '💻' : i.type === 'HR面' ? '👤' : '🎤',
      color: 'border-[var(--warning)]',
      title: `${i.type} ${i.status === 'completed' ? '已完成' : i.status === 'upcoming' ? '待进行' : i.status}`,
      detail: `${i.date} ${i.time}${i.interviewer ? ` · ${i.interviewer}` : ''}`,
    });
  });

  // Exams
  appExams.forEach(e => {
    timelineEvents.push({
      time: `${e.date}T${e.time}`,
      icon: '✏️',
      color: 'border-[var(--info)]',
      title: `${e.type} ${e.status === 'completed' ? '已完成' : e.status === 'upcoming' ? '待进行' : e.status}`,
      detail: `${e.date} ${e.time}`,
    });
  });

  // Offers
  appOffers.forEach(o => {
    timelineEvents.push({
      time: o.createdAt,
      icon: '🏆',
      color: 'border-[var(--success)]',
      title: '收到 Offer',
      detail: `薪资 ${o.salary.total ? `${o.salary.total}k` : `${o.salary.base}k`} · ${o.location}`,
    });
  });

  // Sort by time descending (newest first)
  timelineEvents.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const tabs: { id: TabType; label: string; icon: string; disabled?: boolean }[] = [
    { id: 'overview', label: '概览', icon: '📌' },
    { id: 'resume', label: '简历', icon: '📄' },
    { id: 'exam', label: '笔试', icon: '✏️' },
    { id: 'interview', label: '面试', icon: '🎤' },
    { id: 'offer', label: 'Offer', icon: '💰' },
    { id: 'attachment', label: '附件', icon: '📎' },
    { id: 'timeline', label: '时间线', icon: '📝' },
  ];

  return (
    <AppLayout>
      {/* 顶部导航 */}
      <div className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/applications" className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]">
            ← 返回
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              {application.company}
            </h1>
            <p className="text-sm text-[var(--foreground-light)]">
              {application.position}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
            application.stage === 'offer' ? 'bg-[var(--success)]/10 text-[var(--success)]' :
            application.stage === '拒绝' ? 'bg-[var(--error)]/10 text-[var(--error)]' :
            'bg-[var(--primary)]/10 text-[var(--primary)]'
          }`}>
            {application.stage}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setIsEditOpen(true)}>编辑</Button>
          <Button variant="secondary" size="sm" onClick={() => setIsDeleteConfirmOpen(true)} className="text-[var(--error)] hover:bg-[var(--error)]/10">删除</Button>
        </div>
      </div>

      {/* 流程进度条 */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* 进度线 */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-[var(--border)] rounded-full" />
            <div
              className="absolute top-6 left-0 h-1 bg-[var(--success)] rounded-full transition-all"
              style={{
                width: `${(pipelineNodes.findIndex(n => n.name === application.stage) / (pipelineNodes.length - 1)) * 100}%`
              }}
            />

            {/* 节点 */}
            <div className="flex justify-between relative">
              {pipelineNodes.map((node) => {
                const currentStageIndex = pipelineNodes.findIndex(n => n.name === application.stage);
                const nodeIndex = pipelineNodes.findIndex(n => n.name === node.name);
                const isPassed = nodeIndex < currentStageIndex;
                const isCurrent = nodeIndex === currentStageIndex;
                const isFailed = application.stage === '拒绝' && node.name === '拒绝';

                return (
                  <div key={node.id} className="flex flex-col items-center" style={{ width: `${100 / pipelineNodes.length}%` }}>
                    {/* 节点圆圈 */}
                    <button
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-xl
                        shadow-sm border-4 border-[var(--background)] transition-all
                        ${isPassed ? 'bg-[var(--success)] text-white' : ''}
                        ${isCurrent ? 'ring-4 ring-[var(--primary)]/30 animate-pulse' : ''}
                        ${isFailed ? 'bg-[var(--error)] text-white opacity-75' : ''}
                        ${!isPassed && !isCurrent && !isFailed ? 'bg-[var(--muted)] text-[var(--foreground-muted)]' : ''}
                      `}
                      style={{
                        backgroundColor: isCurrent ? node.color : isPassed ? 'var(--success)' : isFailed ? 'var(--error)' : undefined
                      }}
                      onClick={() => {
                        if (node.name !== application.stage) {
                          handleStageChange(node.name);
                        }
                      }}
                    >
                      {node.icon}
                    </button>

                    {/* 节点信息 */}
                    <div className="mt-3 text-center">
                      <p className={`font-medium text-sm ${
                        isCurrent ? 'text-[var(--primary)] font-semibold' :
                        isPassed ? 'text-[var(--success)]' :
                        isFailed ? 'text-[var(--error)]' :
                        'text-[var(--foreground-muted)]'
                      }`}>
                        {node.name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {nodeTypeConfig[node.type].label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域：左侧 Tab + 右侧内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧 Tab 导航 */}
        <div className="w-48 bg-[var(--surface)] border-r border-[var(--border)] py-4">
          <nav className="space-y-1 px-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth
                  ${tab.disabled
                    ? 'text-[var(--foreground-muted)] cursor-not-allowed opacity-50'
                    : activeTab === tab.id
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-[var(--foreground-light)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 overflow-auto p-6">
          {/* 概览 Tab */}
          {activeTab === 'overview' && (
            <div className="max-w-3xl space-y-6">
              {/* 基本信息 */}
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">基本信息</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground-muted)]">公司</span>
                    <p className="font-medium text-[var(--foreground)]">{application.company}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">岗位</span>
                    <p className="font-medium text-[var(--foreground)]">{application.position}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">地点</span>
                    <p className="font-medium text-[var(--foreground)]">{application.location || '未填写'}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">薪资</span>
                    <p className="font-medium text-[var(--success)]">{application.salary || '未填写'}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">投递日期</span>
                    <p className="font-medium text-[var(--foreground)]">{application.appliedDate}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">来源</span>
                    <p className="font-medium text-[var(--foreground)]">{application.source || '未填写'}</p>
                  </div>
                </div>
              </div>

              {/* 备注 */}
              {application.notes && (
                <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">备注</h3>
                  <p className="text-[var(--foreground-light)] whitespace-pre-wrap">{application.notes}</p>
                </div>
              )}

              {/* 相关数据概览 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-3xl mb-2">🎤</div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{appInterviews.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">面试</p>
                </div>
                <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-3xl mb-2">✏️</div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{appExams.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">笔试</p>
                </div>
                <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm text-center">
                  <div className="text-3xl mb-2">💰</div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{appOffers.length}</p>
                  <p className="text-sm text-[var(--foreground-muted)]">Offer</p>
                </div>
              </div>
            </div>
          )}

          {/* 简历 Tab */}
          {activeTab === 'resume' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📄 简历</h3>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">功能即将开放</h4>
                  <p className="text-[var(--foreground-muted)]">后续版本将支持在此管理定制简历</p>
                </div>
              </div>
            </div>
          )}

          {/* 笔试 Tab */}
          {activeTab === 'exam' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">✏️ 笔试记录</h3>
                {appExams.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">暂无笔试记录</h4>
                    <p className="text-[var(--foreground-muted)]">后续版本将支持在此添加笔试记录</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appExams.map(exam => (
                      <div key={exam.id} className="p-4 bg-[var(--muted)] rounded-xl">
                        <p className="font-medium text-[var(--foreground)]">{exam.type}</p>
                        <p className="text-sm text-[var(--foreground-light)]">{exam.date} {exam.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 面试 Tab */}
          {activeTab === 'interview' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">🎤 面试记录</h3>
                {appInterviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">暂无面试记录</h4>
                    <p className="text-[var(--foreground-muted)]">后续版本将支持在此添加面试复盘</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appInterviews.map(interview => (
                      <div key={interview.id} className="p-4 bg-[var(--muted)] rounded-xl">
                        <p className="font-medium text-[var(--foreground)]">{interview.type}</p>
                        <p className="text-sm text-[var(--foreground-light)]">{interview.date} {interview.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Offer Tab */}
          {activeTab === 'offer' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">💰 Offer 详情</h3>
                {appOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">暂无 Offer</h4>
                    <p className="text-[var(--foreground-muted)]">继续加油，Offer 在路上！</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appOffers.map(offer => (
                      <div key={offer.id} className="p-4 bg-[var(--muted)] rounded-xl">
                        <p className="font-medium text-[var(--success)]">
                          薪资 {offer.salary.total ? `${offer.salary.total}k` : `${offer.salary.base}k`}
                        </p>
                        <p className="text-sm text-[var(--foreground-light)]">{offer.location}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 附件 Tab */}
          {activeTab === 'attachment' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📎 附件</h3>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">功能即将开放</h4>
                  <p className="text-[var(--foreground-muted)]">后续版本将支持上传和管理相关文件</p>
                </div>
              </div>
            </div>
          )}

          {/* 时间线 Tab */}
          {activeTab === 'timeline' && (
            <div className="max-w-3xl">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📝 时间线</h3>
                {timelineEvents.length > 0 ? (
                  <div className="relative pl-8">
                    {/* Vertical line */}
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
                    <div className="space-y-6">
                      {timelineEvents.map((event, i) => (
                        <div key={i} className="relative">
                          {/* Dot */}
                          <div className={`absolute -left-5 top-1 w-4 h-4 rounded-full border-2 bg-[var(--background)] ${event.color}`} />
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{event.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[var(--foreground)]">{event.title}</p>
                              {event.detail && (
                                <p className="text-sm text-[var(--foreground-light)] mt-0.5">{event.detail}</p>
                              )}
                              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                                {new Date(event.time).toLocaleString('zh-CN', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">暂无时间线记录</h4>
                    <p className="text-[var(--foreground-muted)]">投递后的操作将自动记录在此</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 编辑投递弹窗 */}
      {isEditOpen && application && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">编辑投递</h2>
              <button onClick={() => setIsEditOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
            </div>
            <div className="p-6">
              <EditApplicationForm
                application={application}
                onSubmit={handleEdit}
                onCancel={() => setIsEditOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {isDeleteConfirmOpen && application && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">确认删除</h3>
                <p className="text-[var(--foreground-light)]">
                  确定要删除 <span className="font-medium text-[var(--foreground)]">{application.company}</span> 的投递记录吗？
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-2">此操作不可撤销</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-[var(--error)] hover:bg-[var(--error)]/90 text-white"
                >
                  确认删除
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
