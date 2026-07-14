'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useInterviews, useQuestions, useApplications, Interview as AppInterview } from '@/context/DataContext';
import { getAppliedCompanies } from '@/lib/application-selectors';
import AIMockInterview from '@/components/AI/AIMockInterview';

interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  answer?: string;
  isStarred: boolean;
  isPracticed: boolean;
}

interface InterviewRecord {
  id: number;
  company: string;
  position: string;
  date: string;
  round: string;
  type: string;
  questions: Array<{ q: string; a?: string }>;
  difficulty: 'easy' | 'medium' | 'hard';
  selfRating: number;
  feedback: string;
  improvements: string[];
  nextSteps: string;
}


const categoryConfig: Record<string, { icon: string; color: string }> = {
  '项目经历': { icon: '🚀', color: 'bg-[var(--primary)]' },
  '技术问题': { icon: '💻', color: 'bg-[var(--info)]' },
  '场景设计': { icon: '🎯', color: 'bg-[var(--warning)]' },
  '开放问题': { icon: '💬', color: 'bg-[var(--accent)]' },
  '算法问题': { icon: '🧮', color: 'bg-[var(--success)]' },
};

const difficultyConfig = {
  easy: { label: '简单', color: 'text-[var(--success)]' },
  medium: { label: '中等', color: 'text-[var(--warning)]' },
  hard: { label: '困难', color: 'text-red-500' },
};

const typeConfig: Record<string, { icon: string; color: string; bgColor: string; textColor: string }> = {
  '技术面': { icon: '💻', color: 'text-[var(--info)]', bgColor: 'bg-[var(--info)]/10', textColor: 'text-[var(--info)]' },
  'HR面': { icon: '👔', color: 'text-[var(--accent)]', bgColor: 'bg-[var(--accent)]/10', textColor: 'text-[var(--accent)]' },
  '群面': { icon: '👥', color: 'text-[var(--warning)]', bgColor: 'bg-[var(--warning)]/10', textColor: 'text-[var(--warning)]' },
  '笔试': { icon: '📝', color: 'text-[var(--primary)]', bgColor: 'bg-[var(--primary)]/10', textColor: 'text-[var(--primary)]' },
  '性格测试': { icon: '🧠', color: 'text-[var(--success)]', bgColor: 'bg-[var(--success)]/10', textColor: 'text-[var(--success)]' },
  '其他': { icon: '📌', color: 'text-[var(--foreground-muted)]', bgColor: 'bg-[var(--muted)]', textColor: 'text-[var(--foreground-muted)]' },
};

// No hardcoded question bank or interview records.
// Questions come from useQuestions() (DataContext).
// Interview records (复盘) are user-created — start empty.

// 面试详情模态框
function InterviewDetailModal({
  interview,
  onClose,
  onStartReview,
  onComplete
}: {
  interview: AppInterview;
  onClose: () => void;
  onStartReview: () => void;
  onComplete: () => void;
}) {
  const daysUntil = Math.ceil((new Date(interview.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{interview.company}</h2>
              <p className="text-[var(--foreground-light)]">{interview.position}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-muted)]">✕</button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">面试类型</p>
              <p className="font-medium">{interview.type}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">面试日期</p>
              <p className="font-medium">{interview.date}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)] mb-1">面试时间</p>
              <p className="font-medium">{interview.time}</p>
            </div>
          </div>
          {interview.notes && (
            <div className="bg-[var(--primary)]/5 rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">{interview.notes}</p>
            </div>
          )}
          {interview.reminder && (
            <div className="bg-[var(--warning)]/10 rounded-xl p-4">
              <p className="text-sm text-[var(--warning)]">🔔 {interview.reminder}</p>
            </div>
          )}
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <p className="text-sm text-[var(--foreground-muted)]">
              距离面试还有 <span className="font-bold text-[var(--primary)]">{daysUntil}</span> 天
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-[var(--border)] flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">关闭</Button>
          <Button onClick={onStartReview} className="flex-1">📝 开始准备</Button>
          <Button onClick={onComplete} className="flex-1">✅ 标记已完成</Button>
        </div>
      </div>
    </div>
  );
}

// 面试复盘详情模态框
function RecordDetailModal({
  record,
  onClose
}: {
  record: InterviewRecord;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{record.company} - {record.round}</h2>
              <p className="text-[var(--foreground-light)]">{record.position}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground-muted)]">✕</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">日期</p>
              <p className="font-medium text-sm">{record.date}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">类型</p>
              <p className="font-medium text-sm">{record.type}</p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">难度</p>
              <p className={`font-medium text-sm ${difficultyConfig[record.difficulty].color}`}>
                {difficultyConfig[record.difficulty].label}
              </p>
            </div>
            <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--foreground-muted)]">自我评价</p>
              <p className="text-[var(--warning)]">{'★'.repeat(record.selfRating)}</p>
            </div>
          </div>

          {/* 问题与回答 */}
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-3">📝 面试问题</h3>
            <div className="space-y-3">
              {record.questions.map((item, i) => (
                <div key={i} className="bg-[var(--muted)] rounded-xl p-4">
                  <p className="text-sm font-medium text-[var(--foreground)] mb-2">Q: {item.q}</p>
                  {item.a && (
                    <p className="text-sm text-[var(--foreground-light)]">A: {item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 面试反馈 */}
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-3">💬 面试反馈</h3>
            <div className="bg-[var(--primary)]/5 rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">{record.feedback}</p>
            </div>
          </div>

          {/* 待改进 */}
          {record.improvements.length > 0 && (
            <div>
              <h3 className="font-medium text-[var(--foreground)] mb-3">📈 待改进</h3>
              <div className="flex flex-wrap gap-2">
                {record.improvements.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-[var(--warning)]/10 text-[var(--warning)] text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 下一步 */}
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-3">🔮 下一步</h3>
            <div className="bg-[var(--success)]/10 rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">{record.nextSteps}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[var(--border)]">
          <Button onClick={onClose} className="w-full">关闭</Button>
        </div>
      </div>
    </div>
  );
}

// 添加复盘表单
function AddReviewForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (data: Partial<InterviewRecord>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    date: '',
    round: '',
    type: '技术面',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    selfRating: 3,
    feedback: '',
    nextSteps: '',
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.position) {
      alert('请填写公司名称和职位');
      return;
    }
    onSubmit({
      ...formData,
      questions: [],
    });
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
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：字节跳动"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位 *</label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：前端开发工程师"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">日期</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">面试轮次</label>
          <input
            type="text"
            value={formData.round}
            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="如：技术一面"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">面试类型</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="技术面">技术面</option>
            <option value="HR面">HR面</option>
            <option value="笔试">笔试</option>
            <option value="综合面">综合面</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">难度</label>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFormData({ ...formData, difficulty: d })}
              className={`flex-1 px-4 py-2 rounded-xl text-sm transition-smooth ${
                formData.difficulty === d
                  ? d === 'easy' ? 'bg-[var(--success)] text-white' :
                    d === 'medium' ? 'bg-[var(--warning)] text-white' :
                    'bg-red-500 text-white'
                  : 'bg-[var(--muted)] text-[var(--foreground-light)]'
              }`}
            >
              {difficultyConfig[d].label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">自我评价</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setFormData({ ...formData, selfRating: star })}
              className={`text-2xl ${star <= formData.selfRating ? 'text-[var(--warning)]' : 'text-[var(--muted-dark)]'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">面试反馈</label>
        <textarea
          value={formData.feedback}
          onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24 resize-none"
          placeholder="记录面试中的表现、感受..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">下一步</label>
        <textarea
          value={formData.nextSteps}
          onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-20 resize-none"
          placeholder="如：等待二面通知，预计1周内出结果"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">保存复盘</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  const { interviews, update: updateInterview } = useInterviews();
  const { questions: contextQuestions, toggleStar: contextToggleStar } = useQuestions();
  const { applications } = useApplications();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'questions' | 'records' | 'ai'>('upcoming');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<AppInterview | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<InterviewRecord | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  // Questions come from DataContext; local state is only for isPracticed (client-only)
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [showAIMock, setShowAIMock] = useState(false);
  // Derive available companies from real application data
  const appliedCompanies = getAppliedCompanies(applications);
  const [mockConfig, setMockConfig] = useState({
    company: appliedCompanies[0] || '',
    position: '',
    type: '技术一面',
    duration: 30,
  });

  // Questions come from DataContext only — no hardcoded fallback
  const questions: InterviewQuestion[] = contextQuestions.map(q => ({
    id: parseInt(q.id) || 0,
    category: q.category,
    question: q.question,
    answer: q.answer,
    isStarred: q.starred || false,
    isPracticed: practicedIds.has(q.id),
  }));

  const upcomingInterviews = interviews.filter((i) => i.status === 'upcoming');
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const categories = ['all', ...Object.keys(categoryConfig)];
  const filteredQuestions = filterCategory === 'all'
    ? questions
    : questions.filter(q => q.category === filterCategory);

  const toggleStar = (id: number) => {
    contextToggleStar(String(id));
  };

  const togglePracticed = (id: number) => {
    const strId = String(id);
    setPracticedIds(prev => {
      const next = new Set(prev);
      if (next.has(strId)) next.delete(strId); else next.add(strId);
      return next;
    });
  };

  const handleAddReview = (data: Partial<InterviewRecord>) => {
    const newRecord: InterviewRecord = {
      id: Date.now(),
      ...data,
      questions: [],
      improvements: [],
    } as InterviewRecord;
    setRecords([newRecord, ...records]);
    setIsAddReviewOpen(false);
  };

  const handleCompleteInterview = (id: string) => {
    updateInterview(id, { status: 'completed' });
    setSelectedInterview(null);
    setIsAddReviewOpen(true);
  };

  // Stats derived from real data
  const starredCount = questions.filter(q => q.isStarred).length;
  const practicedCount = questions.filter(q => q.isPracticed).length;
  const avgRating = records.length > 0
    ? (records.reduce((a, b) => a + b.selfRating, 0) / records.length).toFixed(1)
    : '--';
  // High-frequency questions: most-starred questions from real question bank
  const topQuestions = [...questions]
    .filter(q => q.isStarred)
    .slice(0, 3)
    .map(q => q.question);

  // Get type config for an interview
  const getTypeConfig = (type: string) => {
    return typeConfig[type as keyof typeof typeConfig] || typeConfig['其他'];
  };

  return (
    <AppLayout>
      <Header
        title="面试准备"
        subtitle={`即将面试 ${upcomingInterviews.length} 场 · 收录 ${questions.length} 道题目`}
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'upcoming'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📅 面试
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'questions'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📝 题库
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'records'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                📋 记录
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'ai'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                🤖 AI
              </button>
            </div>
            <Button onClick={() => setIsAddReviewOpen(true)}>＋ 添加复盘</Button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        {/* 即将面试 Tab */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  📅 即将面试 ({upcomingInterviews.length})
                </h3>
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-[var(--foreground-light)]">近期没有面试安排</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => {
                      const config = getTypeConfig(interview.type);
                      const daysUntil = Math.ceil((new Date(interview.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      return (
                        <div
                          key={interview.id}
                          onClick={() => setSelectedInterview(interview)}
                          className="bg-[var(--muted)] rounded-xl p-4 hover:bg-[var(--muted-dark)] transition-smooth cursor-pointer"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl ${config.color} flex items-center justify-center text-xl`}>
                              {config.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-[var(--foreground)]">
                                    {interview.company}
                                  </h4>
                                  <p className="text-sm text-[var(--foreground-light)]">
                                    {interview.position}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.textColor} bg-white/50`}>
                                  {interview.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="text-[var(--foreground-light)]">
                                  📅 {interview.date}
                                </span>
                                <span className="text-[var(--foreground-light)]">
                                  🕐 {interview.time}
                                </span>
                                {daysUntil <= 3 && daysUntil >= 0 && (
                                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs">
                                    还剩 {daysUntil} 天
                                  </span>
                                )}
                              </div>
                              {interview.notes && (
                                <p className="mt-2 text-sm text-[var(--foreground-muted)] bg-white/50 rounded-lg px-3 py-2">
                                  💡 {interview.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  ✅ 历史面试 ({completedInterviews.length})
                </h3>
                <div className="space-y-3">
                  {completedInterviews.map((interview) => {
                    const config = getTypeConfig(interview.type);
                    return (
                      <div
                        key={interview.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)] transition-smooth cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{config.icon}</span>
                          <div>
                            <p className="font-medium text-[var(--foreground)]">
                              {interview.company}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">
                              {interview.type} · {interview.date}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          查看复盘
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  📚 面试题库
                </h3>
                <div className="space-y-3">
                  {Object.entries(categoryConfig).map(([cat, config]) => (
                    <div
                      key={cat}
                      onClick={() => { setActiveTab('questions'); setFilterCategory(cat); }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)] transition-smooth cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white text-sm`}>
                          {config.icon}
                        </span>
                        <span className="text-[var(--foreground)]">{cat}</span>
                      </div>
                      <span className="text-[var(--foreground-muted)]">
                        {questions.filter(q => q.category === cat).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  📊 准备进度
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--foreground-light)]">已练习</span>
                      <span className="text-[var(--foreground)]">{practicedCount}/{questions.length}</span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--success)] rounded-full transition-all"
                        style={{ width: questions.length > 0 ? `${(practicedCount / questions.length) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--foreground-light)]">重点标记</span>
                      <span className="text-[var(--foreground)]">{starredCount} 题</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl p-6 shadow-md text-white">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl mb-4">
                  🤖
                </div>
                <h3 className="font-semibold mb-2">AI 模拟面试</h3>
                <p className="text-white/80 text-sm mb-4">
                  和 AI 进行实时对话练习
                </p>
                <Button
                  className="w-full bg-white text-[var(--primary)] hover:bg-white/90"
                  onClick={() => setActiveTab('ai')}
                >
                  开始模拟
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 题库 Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth flex items-center gap-2 ${
                    filterCategory === cat
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--surface)] text-[var(--foreground-light)] hover:bg-[var(--muted)]'
                  }`}
                >
                  {cat === 'all' ? '📚' : categoryConfig[cat]?.icon} {cat === 'all' ? '全部' : cat}
                  <span className="text-xs opacity-70">
                    {cat === 'all' ? questions.length : questions.filter(q => q.category === cat).length}
                  </span>
                </button>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-16 bg-[var(--surface)] rounded-2xl">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-[var(--foreground-light)] mb-2">题库还没有内容</p>
                <p className="text-sm text-[var(--foreground-muted)]">在投递详情或记录页添加面试题目后将显示在这里</p>
              </div>
            )}
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const config = categoryConfig[q.category] || categoryConfig['技术问题'];
                return (
                  <div
                    key={q.id}
                    className={`bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer ${
                      selectedQuestion?.id === q.id ? 'ring-2 ring-[var(--primary)]' : ''
                    }`}
                    onClick={() => setSelectedQuestion(selectedQuestion?.id === q.id ? null : q)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center text-lg text-white`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs text-[var(--foreground-muted)]">{q.category}</span>
                            <h4 className="font-medium text-[var(--foreground)]">
                              {q.question}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePracticed(q.id); }}
                              className={`px-2 py-1 rounded text-xs ${
                                q.isPracticed
                                  ? 'bg-[var(--success)]/10 text-[var(--success)]'
                                  : 'bg-[var(--muted)] text-[var(--foreground-muted)]'
                              }`}
                              title="标记已练习"
                            >
                              ✓ 已练习
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleStar(q.id); }}
                              className="p-2 rounded hover:bg-[var(--muted)]"
                              title="标记重点"
                            >
                              {q.isStarred ? '⭐' : '☆'}
                            </button>
                          </div>
                        </div>
                        {selectedQuestion?.id === q.id && (
                          <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            <p className="text-sm text-[var(--foreground-light)] mb-3">
                              💡 点击下方按钮，让 AI 帮你生成参考答案
                            </p>
                            <div className="flex gap-2">
                              <Button variant="secondary" size="sm">🤖 AI生成答案</Button>
                              <Button variant="secondary" size="sm">📝 练习模式</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 面试记录 Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">面试复盘 ({records.length})</h3>
                  <Button size="sm" onClick={() => setIsAddReviewOpen(true)}>＋ 添加复盘</Button>
                </div>

                {records.length === 0 ? (
                  <div className="bg-[var(--surface)] rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-[var(--foreground-light)] mb-2">还没有面试复盘</p>
                    <p className="text-sm text-[var(--foreground-muted)]">完成面试后记得记录复盘哦</p>
                  </div>
                ) : (
                  records.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecord(record)}
                      className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[var(--foreground)]">
                            {record.company}
                          </h4>
                          <p className="text-sm text-[var(--foreground-light)]">
                            {record.position} · {record.round}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--foreground-muted)]">
                            {record.date}
                          </p>
                          <span className={`text-xs ${difficultyConfig[record.difficulty].color}`}>
                            {difficultyConfig[record.difficulty].label}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-[var(--foreground-muted)] mb-2">被问到的问题：</p>
                        <div className="flex flex-wrap gap-2">
                          {record.questions.slice(0, 3).map((q, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs text-[var(--foreground-light)]">
                              {q.q}
                            </span>
                          ))}
                          {record.questions.length > 3 && (
                            <span className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs text-[var(--foreground-muted)]">
                              +{record.questions.length - 3} 更多
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--foreground-muted)]">自我评价：</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= record.selfRating ? 'text-[var(--warning)]' : 'text-[var(--muted-dark)]'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">查看详情 →</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
                  <h4 className="font-semibold text-[var(--foreground)] mb-4">📊 面试统计</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">总面试场次</span>
                      <span className="text-2xl font-bold text-[var(--primary)]">{records.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">高难度面试</span>
                      <span className="text-red-500">{records.filter(r => r.difficulty === 'hard').length} 场</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">平均自我评价</span>
                      <span className="text-[var(--warning)]">{avgRating} ★</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
                  <h4 className="font-semibold text-[var(--foreground)] mb-4">⭐ 重点题目</h4>
                  {topQuestions.length > 0 ? (
                    <div className="space-y-2">
                      {topQuestions.map((q, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--muted)]">
                          <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-sm text-[var(--foreground-light)]">{q}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--foreground-muted)] text-center py-2">
                      在题库中标星即可显示重点题目
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI 模拟面试 Tab */}
        {activeTab === 'ai' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6 text-center">
                🤖 AI 模拟面试
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    选择目标公司
                  </label>
                  {appliedCompanies.length > 0 ? (
                    <select
                      value={mockConfig.company}
                      onChange={(e) => setMockConfig({ ...mockConfig, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option value="">请选择公司</option>
                      {appliedCompanies.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm text-[var(--foreground-muted)]">
                      请先在投递页面添加投递记录
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    面试类型
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['技术一面', '技术二面', 'HR面'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setMockConfig({ ...mockConfig, type })}
                        className={`px-4 py-3 rounded-xl text-sm transition-smooth ${
                          mockConfig.type === type
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    面试时长
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: '15分钟', value: 15 },
                      { label: '30分钟', value: 30 },
                      { label: '45分钟', value: 45 },
                      { label: '1小时', value: 60 },
                    ].map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => setMockConfig({ ...mockConfig, duration: value })}
                        className={`px-4 py-3 rounded-xl text-sm transition-smooth ${
                          mockConfig.duration === value
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full py-4 text-lg" onClick={() => setShowAIMock(true)}>
                🚀 开始 AI 模拟面试
              </Button>

              <p className="text-center text-sm text-[var(--foreground-muted)] mt-4">
                AI 将扮演面试官，通过文字对话进行模拟面试
              </p>
            </div>

            <div className="mt-6 bg-[var(--muted)] rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">
                💡 提示：在设置页面配置 Kimi API Key 后即可使用 AI 模拟面试功能
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 面试详情模态框 */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onStartReview={() => {
            setSelectedInterview(null);
            setActiveTab('questions');
          }}
          onComplete={() => handleCompleteInterview(selectedInterview.id)}
        />
      )}

      {/* 复盘详情模态框 */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {/* 添加复盘表单 */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddReviewOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加面试复盘</h2>
              <button
                onClick={() => setIsAddReviewOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <AddReviewForm
                onSubmit={handleAddReview}
                onCancel={() => setIsAddReviewOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI 模拟面试 */}
      {showAIMock && (
        <AIMockInterview
          company={mockConfig.company}
          position={mockConfig.position}
          interviewType={mockConfig.type}
          duration={mockConfig.duration}
          onClose={() => setShowAIMock(false)}
        />
      )}
    </AppLayout>
  );
}
