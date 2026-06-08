'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface Interview {
  id: number;
  company: string;
  position: string;
  date: string;
  time: string;
  type: '技术面' | 'HR面' | '笔试' | '综合面';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

interface InterviewQuestion {
  id: number;
  category: string;
  question: string;
  isStarred: boolean;
}

interface InterviewRecord {
  id: number;
  company: string;
  position: string;
  date: string;
  round: string;
  questions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  selfRating: number;
}

const interviews: Interview[] = [
  { id: 1, company: '字节跳动', position: '前端开发工程师', date: '明天', time: '14:00', type: '技术面', status: 'upcoming', notes: '准备手撕算法' },
  { id: 2, company: '腾讯', position: 'Web前端开发', date: '周三', time: '10:00', type: 'HR面', status: 'upcoming' },
  { id: 3, company: '阿里巴巴', position: '前端工程师', date: '周五', time: '15:30', type: '笔试', status: 'upcoming' },
  { id: 4, company: '美团', position: '前端研发', date: '上周', time: '14:00', type: '技术面', status: 'completed', notes: '感觉不错，等待结果' },
  { id: 5, company: '网易', position: 'Web前端', date: '3天前', time: '10:00', type: '笔试', status: 'completed', notes: '通过' },
];

const questionBank: InterviewQuestion[] = [
  { id: 1, category: '项目经历', question: '请介绍一下你最成功的项目，你在里面担任什么角色？', isStarred: true },
  { id: 2, category: '项目经历', question: '项目中遇到的最大挑战是什么？怎么解决的？', isStarred: true },
  { id: 3, category: '技术问题', question: 'React 的生命周期有哪些？', isStarred: false },
  { id: 4, category: '技术问题', question: 'Virtual DOM 的原理是什么？有什么优缺点？', isStarred: false },
  { id: 5, category: '技术问题', question: 'TypeScript 中 interface 和 type 的区别？', isStarred: false },
  { id: 6, category: '场景设计', question: '如何设计一个秒杀系统？', isStarred: true },
  { id: 7, category: '场景设计', question: '如何实现一个前端的埋点系统？', isStarred: false },
  { id: 8, category: '开放问题', question: '为什么选择前端开发？', isStarred: false },
  { id: 9, category: '开放问题', question: '你还有什么问题想问我？', isStarred: true },
  { id: 10, category: '算法问题', question: '手写一个防抖函数', isStarred: false },
];

const interviewRecords: InterviewRecord[] = [
  {
    id: 1,
    company: '美团',
    position: '前端研发',
    date: '2026-06-05',
    round: '技术一面',
    questions: ['React Hooks原理', '项目中的性能优化', '手写Promise'],
    difficulty: 'hard',
    selfRating: 4,
  },
  {
    id: 2,
    company: '网易',
    position: 'Web前端',
    date: '2026-06-03',
    round: '笔试',
    questions: ['CSS盒模型', 'JavaScript闭包', '手写快排'],
    difficulty: 'medium',
    selfRating: 5,
  },
];

const typeConfig = {
  '技术面': { icon: '💻', color: 'bg-[var(--primary)]', textColor: 'text-[var(--primary)]' },
  'HR面': { icon: '👥', color: 'bg-[var(--accent)]', textColor: 'text-[var(--info)]' },
  '笔试': { icon: '📝', color: 'bg-[var(--warning)]', textColor: 'text-[var(--warning)]' },
  '综合面': { icon: '🏆', color: 'bg-[var(--success)]', textColor: 'text-[var(--success)]' },
};

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
  hard: { label: '困难', color: 'text-[var(--error)]' },
};

export default function InterviewPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'questions' | 'records' | 'ai'>('upcoming');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);

  const upcomingInterviews = interviews.filter((i) => i.status === 'upcoming');
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const categories = ['all', ...Object.keys(categoryConfig)];
  const filteredQuestions = filterCategory === 'all'
    ? questionBank
    : questionBank.filter(q => q.category === filterCategory);

  return (
    <AppLayout>
      <Header
        title="面试准备"
        subtitle={`即将面试 ${upcomingInterviews.length} 场 · 收录 ${questionBank.length} 道题目`}
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
            <Button>＋ 添加面试</Button>
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
                  📅 即将面试
                </h3>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => {
                    const config = typeConfig[interview.type];
                    return (
                      <div
                        key={interview.id}
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
              </div>

              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  ✅ 历史面试
                </h3>
                <div className="space-y-3">
                  {completedInterviews.map((interview) => {
                    const config = typeConfig[interview.type];
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
                        {questionBank.filter(q => q.category === cat).length}
                      </span>
                    </div>
                  ))}
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
                    {cat === 'all' ? questionBank.length : questionBank.filter(q => q.category === cat).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q) => {
                const config = categoryConfig[q.category];
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
                          <div className="flex items-center gap-2">
                            {q.isStarred && (
                              <span className="text-[var(--warning)]">⭐</span>
                            )}
                            <Button variant="ghost" size="sm" title="标记重点">
                              {q.isStarred ? '★' : '☆'}
                            </Button>
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
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">面试复盘</h3>
                  <Button size="sm">＋ 添加复盘</Button>
                </div>

                {interviewRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth"
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
                        {record.questions.map((q, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs text-[var(--foreground-light)]">
                            {q}
                          </span>
                        ))}
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
                      <Button variant="ghost" size="sm">查看详情</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
                  <h4 className="font-semibold text-[var(--foreground)] mb-4">📊 面试统计</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">总面试场次</span>
                      <span className="text-2xl font-bold text-[var(--primary)]">{interviewRecords.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">高难度面试</span>
                      <span className="text-[var(--error)]">{interviewRecords.filter(r => r.difficulty === 'hard').length} 场</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-light)]">平均自我评价</span>
                      <span className="text-[var(--warning)]">
                        {(interviewRecords.reduce((a, b) => a + b.selfRating, 0) / interviewRecords.length).toFixed(1)} ★
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm">
                  <h4 className="font-semibold text-[var(--foreground)] mb-4">🔥 高频问题</h4>
                  <div className="space-y-2">
                    {['React Hooks原理', '项目中的性能优化', '职业规划'].map((q, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--muted)]">
                        <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm text-[var(--foreground-light)]">{q}</span>
                      </div>
                    ))}
                  </div>
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
                  <select className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                    <option value="">请选择公司</option>
                    <option value="字节跳动">字节跳动</option>
                    <option value="腾讯">腾讯</option>
                    <option value="阿里巴巴">阿里巴巴</option>
                    <option value="美团">美团</option>
                    <option value="自定义">自定义输入</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    选择面试类型
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['技术一面', '技术二面', 'HR面'].map((type) => (
                      <button
                        key={type}
                        className="px-4 py-3 rounded-xl bg-[var(--muted)] text-sm text-[var(--foreground-light)] hover:bg-[var(--primary)] hover:text-white transition-smooth"
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
                    {['15分钟', '30分钟', '45分钟', '1小时'].map((duration) => (
                      <button
                        key={duration}
                        className="px-4 py-3 rounded-xl bg-[var(--muted)] text-sm text-[var(--foreground-light)] hover:bg-[var(--primary)] hover:text-white transition-smooth"
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full py-4 text-lg">
                🚀 开始 AI 模拟面试
              </Button>

              <p className="text-center text-sm text-[var(--foreground-muted)] mt-4">
                AI 将扮演面试官，通过文字对话进行模拟面试
              </p>
            </div>

            <div className="mt-6 bg-[var(--muted)] rounded-xl p-4">
              <p className="text-sm text-[var(--foreground-light)]">
                📁 已完成 3 次模拟面试，<Button variant="ghost" size="sm" className="inline">查看历史</Button>
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
