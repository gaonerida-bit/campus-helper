'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/Layout/AppLayout';
import Button from '@/components/UI/Button';
import { useApplications, useInterviews, useExams, useOffers } from '@/context/DataContext';

interface PipelineNode {
  id: string;
  name: string;
  type: 'interview' | 'test' | 'screening' | 'other';
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  plannedTime?: string;
  actualTime?: string;
  notes?: string;
}

const nodeTypeConfig = {
  interview: { icon: '🎯', color: 'bg-[var(--warning)]', label: '面试' },
  test: { icon: '📝', color: 'bg-[var(--info)]', label: '笔试' },
  screening: { icon: '📋', color: 'bg-[var(--primary)]', label: '筛选' },
  other: { icon: '📌', color: 'bg-[var(--secondary)]', label: '其他' },
};

const statusConfig = {
  pending: { color: 'bg-[var(--muted)]', textColor: 'text-[var(--foreground-muted)]', label: '待进行' },
  in_progress: { color: 'bg-[var(--warning)]', textColor: 'text-white', label: '进行中' },
  passed: { color: 'bg-[var(--success)]', textColor: 'text-white', label: '已通过' },
  failed: { color: 'bg-[var(--error)]', textColor: 'text-white', label: '未通过' },
  skipped: { color: 'bg-[var(--muted-dark)]', textColor: 'text-[var(--foreground-muted)]', label: '已跳过' },
};

type TabType = 'overview' | 'resume' | 'exam' | 'interview' | 'offer' | 'attachment' | 'timeline';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { applications, update } = useApplications();
  const { interviews } = useInterviews();
  const { exams } = useExams();
  const { offers } = useOffers();

  const application = applications.find(a => a.id === id);

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mock pipeline nodes - in real app this would come from application data
  const [nodes, setNodes] = useState<PipelineNode[]>([
    { id: '1', name: '简历投递', type: 'screening', status: 'passed', actualTime: '6月1日' },
    { id: '2', name: '简历筛选', type: 'screening', status: 'passed', actualTime: '6月3日' },
    { id: '3', name: '在线测评', type: 'test', status: 'passed', actualTime: '6月5日' },
    { id: '4', name: '技术一面', type: 'interview', status: 'in_progress', plannedTime: '明天 14:00' },
    { id: '5', name: '技术二面', type: 'interview', status: 'pending', plannedTime: '待定' },
    { id: '6', name: 'HR面', type: 'interview', status: 'pending', plannedTime: '待定' },
    { id: '7', name: 'Offer', type: 'other', status: 'pending', plannedTime: '待定' },
  ]);

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

  const updateNodeStatus = (nodeId: string, newStatus: PipelineNode['status']) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, status: newStatus };
        if (newStatus === 'passed' || newStatus === 'failed') {
          updatedNode.actualTime = new Date().toLocaleDateString('zh-CN');
        }
        return updatedNode;
      }
      if (newStatus === 'failed') {
        const currentIndex = nodes.findIndex(n => n.id === nodeId);
        const nodeIndex = nodes.findIndex(n => n.id === node.id);
        if (nodeIndex > currentIndex) {
          return { ...node, status: 'skipped' as const };
        }
      }
      return node;
    }));
  };

  // Get related data for this application
  const appInterviews = interviews.filter(i => i.applicationId === id);
  const appExams = exams.filter(e => e.applicationId === id);
  const appOffers = offers.filter(o => o.company === application.company && o.position === application.position);

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
          <Button variant="secondary" size="sm">编辑</Button>
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
                width: `${(nodes.filter(n => n.status === 'passed').length / nodes.length) * 100}%`
              }}
            />

            {/* 节点 */}
            <div className="flex justify-between relative">
              {nodes.map((node) => {
                const typeConfig = nodeTypeConfig[node.type];
                const statusConf = statusConfig[node.status];
                const isActive = node.status === 'in_progress';
                const isFailed = node.status === 'failed';

                return (
                  <div key={node.id} className="flex flex-col items-center" style={{ width: `${100 / nodes.length}%` }}>
                    {/* 节点圆圈 */}
                    <button
                      className={`
                        w-12 h-12 rounded-full ${statusConf.color} flex items-center justify-center text-xl
                        shadow-sm border-4 border-[var(--background)]
                        ${isActive ? 'ring-4 ring-[var(--warning)]/30 animate-pulse' : ''}
                        ${isFailed ? 'opacity-50' : ''}
                      `}
                      onClick={() => {
                        if (node.status === 'pending' || node.status === 'in_progress') {
                          updateNodeStatus(node.id, node.status === 'in_progress' ? 'passed' : 'in_progress');
                        }
                      }}
                    >
                      {typeConfig.icon}
                    </button>

                    {/* 节点信息 */}
                    <div className="mt-3 text-center">
                      <p className={`font-medium text-sm ${statusConf.textColor}`}>
                        {node.name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {node.actualTime || node.plannedTime || typeConfig.label}
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
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h4 className="text-lg font-semibold text-[var(--foreground)] mb-2">功能即将开放</h4>
                  <p className="text-[var(--foreground-muted)]">后续版本将展示完整的操作日志</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
