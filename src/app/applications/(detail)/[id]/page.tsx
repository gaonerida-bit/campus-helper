'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';
import Button from '@/components/UI/Button';

interface PipelineNode {
  id: string;
  name: string;
  type: 'interview' | 'test' | 'screening' | 'other';
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  plannedTime?: string;
  actualTime?: string;
  notes?: string;
}

const mockApplication = {
  id: '1',
  company: '字节跳动',
  position: '前端开发工程师',
  salary: '35-50k',
  location: '北京',
  tags: ['互联网', '心仪'],
  referrer: '张学长',
  appliedDate: '2026-06-01',
  jd: `岗位职责：
1. 负责公司核心业务的前端开发工作
2. 参与前端技术架构设计与优化
3. 解决产品开发过程中的技术难题

任职要求：
1. 本科及以上学历，计算机相关专业
2. 熟练掌握 React/Vue 等主流框架
3. 有良好的代码风格和团队协作能力`,
  notes: '内推渠道，张学长在一面组',
};

const pipelineNodes: PipelineNode[] = [
  { id: '1', name: '简历投递', type: 'screening', status: 'passed', actualTime: '6月1日' },
  { id: '2', name: '简历筛选', type: 'screening', status: 'passed', actualTime: '6月3日' },
  { id: '3', name: '在线测评', type: 'test', status: 'passed', actualTime: '6月5日' },
  { id: '4', name: '技术一面', type: 'interview', status: 'in_progress', plannedTime: '明天 14:00', actualTime: '' },
  { id: '5', name: '技术二面', type: 'interview', status: 'pending', plannedTime: '待定' },
  { id: '6', name: 'HR面', type: 'interview', status: 'pending', plannedTime: '待定' },
  { id: '7', name: 'Offer', type: 'other', status: 'pending', plannedTime: '待定' },
];

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

type TabType = 'jd' | 'pipeline' | 'resume' | 'review' | 'notes';

export default function ApplicationDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pipeline');
  const [nodes, setNodes] = useState(pipelineNodes);

  const updateNodeStatus = (nodeId: string, newStatus: PipelineNode['status']) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        const updatedNode = { ...node, status: newStatus };
        if (newStatus === 'passed' || newStatus === 'failed') {
          updatedNode.actualTime = new Date().toLocaleDateString('zh-CN');
        }
        return updatedNode;
      }
      // 如果当前节点标记为失败，后续节点自动灰显
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

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'jd', label: 'JD', icon: '📄' },
    { id: 'pipeline', label: '流程', icon: '🔗' },
    { id: 'resume', label: '简历', icon: '📋' },
    { id: 'review', label: '复盘', icon: '📝' },
    { id: 'notes', label: '备注', icon: '💬' },
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
              {mockApplication.company}
            </h1>
            <p className="text-sm text-[var(--foreground-light)]">
              {mockApplication.position}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mockApplication.tags.map(tag => (
            <span key={tag} className="px-2 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
              {tag}
            </span>
          ))}
          <Button variant="secondary" size="sm">编辑</Button>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-6">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                activeTab === tab.id
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--foreground-light)] hover:text-[var(--foreground)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'jd' && (
          <div className="max-w-3xl">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">职位描述</h3>
              <pre className="whitespace-pre-wrap text-[var(--foreground-light)] leading-relaxed font-sans">
                {mockApplication.jd}
              </pre>
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <h4 className="font-medium text-[var(--foreground)] mb-2">基本信息</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">薪资范围</span>
                    <span className="text-[var(--success)]">{mockApplication.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">工作地点</span>
                    <span>{mockApplication.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">投递日期</span>
                    <span>{mockApplication.appliedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">内推人</span>
                    <span>{mockApplication.referrer}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="max-w-4xl">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">流程节点</h3>
                <Button variant="secondary" size="sm">＋ 添加节点</Button>
              </div>

              {/* 流程时间线 */}
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
                  {nodes.map((node, index) => {
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
                          {isActive && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[var(--warning)]/10 text-[var(--warning)] text-xs">
                              点击标记完成
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 暖心提示（当有节点标记为失败时） */}
              {nodes.some(n => n.status === 'failed') && (
                <div className="mt-6 p-4 bg-[var(--error)]/10 rounded-xl border border-[var(--error)]/20">
                  <p className="text-[var(--error)]">
                    💚 这只是一次经历，不代表能力。继续投递，下一家在等你！
                  </p>
                </div>
              )}
            </div>

            {/* 快捷操作 */}
            <div className="mt-6 bg-[var(--muted)] rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)] mb-3">快速操作</p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm">📋 面试准备</Button>
                <Button variant="secondary" size="sm">📝 写复盘</Button>
                <Button variant="secondary" size="sm">📄 生成简历</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="max-w-3xl">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">已投递简历</h3>
                <Button size="sm">🤖 AI 生成定制简历</Button>
              </div>
              <div className="bg-[var(--muted)] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">通用前端简历_v3.2.pdf</p>
                    <p className="text-sm text-[var(--foreground-muted)]">投递时间：6月1日</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="max-w-3xl">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">面试复盘</h3>
              <p className="text-[var(--foreground-muted)] mb-4">暂无复盘记录</p>
              <Button>＋ 添加复盘</Button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="max-w-3xl">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">备注</h3>
              <textarea
                className="w-full h-40 px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="记录一些关于这家公司的备注..."
                defaultValue={mockApplication.notes}
              />
              <div className="mt-4 flex justify-end">
                <Button>保存备注</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
