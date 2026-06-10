'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useExams, Exam as AppExam } from '@/context/DataContext';

interface LocalQuestion {
  id: number;
  category: string;
  type: '选择' | '填空' | '编程' | '简答';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  answer?: string;
  isStarred: boolean;
  isPracticed: boolean;
}

interface MockExam {
  id: number;
  company: string;
  position: string;
  date: string;
  time: string;
  type: string;
  status: string;
  location?: string;
  duration?: string;
  subjects?: string[];
  notes?: string;
  score?: number;
}

const mockExams: MockExam[] = [
  { id: 1, company: '阿里巴巴', position: '前端工程师', date: '2026-06-16', time: '14:00', type: '笔试', status: 'upcoming', location: '在线', duration: '2小时', subjects: ['选择题', '编程题'], notes: '笔试系统已发到邮箱' },
  { id: 2, company: '字节跳动', position: '前端开发', date: '2026-06-14', time: '10:00', type: 'OT', status: 'upcoming', duration: '1小时', subjects: ['逻辑题', '编程题'], notes: '限时测试' },
  { id: 3, company: '腾讯', position: 'Web前端', date: '2026-06-10', time: '15:00', type: '笔试', status: 'upcoming', location: '线下', duration: '3小时', subjects: ['选择题', '填空题', '编程题'] },
  { id: 4, company: '美团', position: '前端研发', date: '2026-06-05', time: '09:00', type: '笔试', status: 'completed', score: 85, subjects: ['选择题', '编程题'] },
  { id: 5, company: '网易', position: 'Web前端', date: '2026-06-03', time: '14:00', type: 'OT', status: 'completed', score: 92 },
];

const questionBank: LocalQuestion[] = [
  { id: 1, category: '前端基础', type: '选择', difficulty: 'easy', question: '以下哪个不是 JavaScript 的数据类型？', answer: 'array', isStarred: false, isPracticed: true },
  { id: 2, category: '前端基础', type: '选择', difficulty: 'medium', question: 'CSS 中 display: none 和 visibility: hidden 的区别是？', answer: '前者不占据空间，后者占据空间', isStarred: true, isPracticed: false },
  { id: 3, category: 'JavaScript', type: '编程', difficulty: 'medium', question: '实现一个深拷贝函数', answer: 'function deepClone(obj) { ... }', isStarred: true, isPracticed: false },
  { id: 4, category: 'JavaScript', type: '编程', difficulty: 'hard', question: '实现一个 Promise.all', answer: 'function promiseAll(promises) { ... }', isStarred: true, isPracticed: false },
  { id: 5, category: 'React', type: '简答', difficulty: 'medium', question: 'React Hooks 的原理是什么？', isStarred: false, isPracticed: true },
  { id: 6, category: 'React', type: '选择', difficulty: 'easy', question: 'useEffect 的第二个参数用于？', answer: '依赖项数组', isStarred: false, isPracticed: true },
  { id: 7, category: '算法', type: '编程', difficulty: 'hard', question: '手写快速排序', answer: 'function quickSort(arr) { ... }', isStarred: true, isPracticed: false },
  { id: 8, category: '算法', type: '编程', difficulty: 'medium', question: '合并两个有序数组', answer: 'function merge(arr1, arr2) { ... }', isStarred: false, isPracticed: false },
  { id: 9, category: '网络', type: '填空', difficulty: 'medium', question: 'HTTP 请求方法中，_____ 用于更新资源。', answer: 'PUT', isStarred: false, isPracticed: true },
  { id: 10, category: '网络', type: '简答', difficulty: 'hard', question: '解释 HTTPS 的工作原理', isStarred: true, isPracticed: false },
  { id: 11, category: '前端基础', type: '选择', difficulty: 'easy', question: 'JavaScript 中 === 和 == 的区别是？', answer: '=== 严格相等，不进行类型转换', isStarred: false, isPracticed: true },
  { id: 12, category: '工程化', type: '简答', difficulty: 'medium', question: 'Webpack 的构建流程是什么？', isStarred: false, isPracticed: false },
];

const categoryConfig: Record<string, { icon: string; color: string }> = {
  '前端基础': { icon: '📚', color: 'bg-[var(--primary)]' },
  'JavaScript': { icon: '🟨', color: 'bg-yellow-500' },
  'React': { icon: '⚛️', color: 'bg-cyan-500' },
  '算法': { icon: '🧮', color: 'bg-[var(--success)]' },
  '网络': { icon: '🌐', color: 'bg-blue-500' },
  '工程化': { icon: '🔧', color: 'bg-purple-500' },
};

const difficultyConfig = {
  easy: { label: '简单', color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10' },
  medium: { label: '中等', color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/10' },
  hard: { label: '困难', color: 'text-red-500', bg: 'bg-red-500/10' },
};

const typeConfig = {
  '选择': { icon: '☑️', color: 'bg-blue-500' },
  '填空': { icon: '✏️', color: 'bg-purple-500' },
  '编程': { icon: '💻', color: 'bg-green-500' },
  '简答': { icon: '📝', color: 'bg-orange-500' },
};

function QuestionDetailModal({ question, onClose }: { question: LocalQuestion; onClose: () => void }) {
  const catConfig = categoryConfig[question.category];
  const type = typeConfig[question.type];
  const diff = difficultyConfig[question.difficulty];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${catConfig.color} flex items-center justify-center text-lg text-white`}>
                {catConfig.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{question.category}</h2>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${type.color} text-white`}>{type.icon} {question.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${diff.bg} ${diff.color}`}>{diff.label}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground-light)] mb-2">📋 题目</h3>
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <p className="text-[var(--foreground)]">{question.question}</p>
            </div>
          </div>
          {question.answer && (
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-light)] mb-2">✅ 参考答案</h3>
              <div className="bg-[var(--success)]/10 rounded-xl p-4">
                <p className="text-[var(--foreground)] font-mono text-sm">{question.answer}</p>
              </div>
            </div>
          )}
          {!question.answer && (
            <div className="bg-[var(--warning)]/10 rounded-xl p-4">
              <p className="text-sm text-[var(--warning)]">💡 还没有参考答案，你可以自己练习或让 AI 生成</p>
            </div>
          )}
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1">🤖 AI 生成答案</Button>
            <Button variant="secondary" className="flex-1">📝 标记已练习</Button>
          </div>
        </div>
        <div className="p-6 border-t border-[var(--border)]">
          <Button onClick={onClose} className="w-full">关闭</Button>
        </div>
      </div>
    </div>
  );
}

function AddExamForm({ onSubmit, onCancel }: { onSubmit: (data: Omit<AppExam, 'id' | 'createdAt'>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    date: '',
    time: '',
    type: '笔试' as AppExam['type'],
    location: '',
    duration: '',
    status: 'upcoming' as const,
  });

  const handleSubmit = () => {
    if (!formData.company || !formData.date) {
      alert('请填写公司和日期');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">公司名称 *</label>
          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="如：字节跳动" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">职位</label>
          <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="如：前端开发" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">日期 *</label>
          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">时间</label>
          <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">类型</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as AppExam['type'] })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
            <option value="笔试">笔试</option>
            <option value="OT">OT</option>
            <option value="测评">测评</option>
            <option value="面试">面试</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">地点/方式</label>
          <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="如：在线/线下" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--foreground-light)] mb-1">时长</label>
          <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" placeholder="如：2小时" />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">添加考试</Button>
        <Button variant="secondary" onClick={onCancel} className="flex-1">取消</Button>
      </div>
    </div>
  );
}

export default function ExamPage() {
  const { exams, add: addExam } = useExams();
  const [activeTab, setActiveTab] = useState<'exams' | 'questions'>('exams');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState(questionBank);
  const [selectedQuestion, setSelectedQuestion] = useState<LocalQuestion | null>(null);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);

  const upcomingExams = exams.filter((e) => e.status === 'upcoming');
  const completedExams = exams.filter((e) => e.status === 'completed');
  const categories = ['all', ...Object.keys(categoryConfig)];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesSearch = q.question.includes(searchQuery) || q.category.includes(searchQuery);
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const toggleStar = (id: number) => setQuestions(questions.map(q => q.id === id ? { ...q, isStarred: !q.isStarred } : q));
  const togglePracticed = (id: number) => setQuestions(questions.map(q => q.id === id ? { ...q, isPracticed: !q.isPracticed } : q));
  const handleAddExam = (data: Omit<AppExam, 'id' | 'createdAt'>) => { addExam(data); setIsAddExamOpen(false); };

  const starredCount = questions.filter(q => q.isStarred).length;
  const practicedCount = questions.filter(q => q.isPracticed).length;

  return (
    <AppLayout>
      <Header
        title="笔试准备"
        subtitle={`${upcomingExams.length} 场考试待完成 · ${questions.length} 道笔试题库`}
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button onClick={() => setActiveTab('exams')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeTab === 'exams' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📅 考试安排</button>
              <button onClick={() => setActiveTab('questions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${activeTab === 'questions' ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm' : 'text-[var(--foreground-light)]'}`}>📝 题库</button>
            </div>
            <Button onClick={() => setIsAddExamOpen(true)}>＋ 添加考试</Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'exams' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📅 即将考试 ({upcomingExams.length})</h3>
                {upcomingExams.length === 0 ? (
                  <div className="text-center py-8"><div className="text-4xl mb-3">🎉</div><p className="text-[var(--foreground-light)]">近期没有考试安排</p></div>
                ) : (
                  <div className="space-y-4">
                    {upcomingExams.map((exam) => {
                      const daysUntil = Math.ceil((new Date(exam.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                      const isUrgent = daysUntil <= 3;
                      return (
                        <div key={exam.id} className={`bg-[var(--muted)] rounded-xl p-4 border-l-4 ${isUrgent ? 'border-red-500' : 'border-[var(--primary)]'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-[var(--foreground)]">{exam.company} - {exam.position}</h4>
                              <div className="flex items-center gap-3 mt-2 text-sm text-[var(--foreground-light)]">
                                <span>📅 {exam.date} {exam.time}</span>
                                <span>⏱️ {exam.duration}</span>
                                {exam.location && <span>📍 {exam.location}</span>}
                              </div>
                              {exam.notes && <p className="mt-2 text-sm text-[var(--foreground-muted)] bg-white/50 rounded-lg px-3 py-2">💡 {exam.notes}</p>}
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${exam.type === 'OT' ? 'bg-purple-500/10 text-purple-500' : exam.type === '笔试' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>{exam.type}</span>
                              {isUrgent && <p className="text-red-500 text-xs mt-2 font-medium">⏰ 还剩 {daysUntil} 天</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">✅ 历史考试 ({completedExams.length})</h3>
                <div className="space-y-3">
                  {completedExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)]">
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{exam.company}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{exam.date} · {exam.type}</p>
                      </div>
                      {exam.score !== undefined && (() => {
                        const scoreNum = parseInt(exam.score || '0');
                        return <div className={`text-xl font-bold ${scoreNum >= 80 ? 'text-[var(--success)]' : scoreNum >= 60 ? 'text-[var(--warning)]' : 'text-red-500'}`}>{exam.score}</div>;
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📊 学习进度</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--foreground-light)]">已练习</span>
                      <span className="text-[var(--foreground)]">{practicedCount}/{questions.length}</span>
                    </div>
                    <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--success)] rounded-full transition-all" style={{ width: `${(practicedCount / questions.length) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-light)]">重点标记</span>
                    <span className="text-[var(--foreground)]">{starredCount} 题</span>
                  </div>
                </div>
              </div>
              <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">📚 分类题库</h3>
                <div className="space-y-2">
                  {Object.entries(categoryConfig).map(([cat, config]) => {
                    const catQuestions = questions.filter(q => q.category === cat);
                    const catPracticed = catQuestions.filter(q => q.isPracticed).length;
                    return (
                      <div key={cat} onClick={() => { setActiveTab('questions'); setFilterCategory(cat); }} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)] cursor-pointer transition-smooth">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white text-sm`}>{config.icon}</span>
                          <span className="text-[var(--foreground)]">{cat}</span>
                        </div>
                        <span className="text-sm text-[var(--foreground-muted)]">{catPracticed}/{catQuestions.length}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[var(--info)] to-[var(--primary)] rounded-2xl p-6 shadow-md text-white">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">开始刷题</h3>
                <p className="text-white/80 text-sm mb-4">从高频题目开始练习</p>
                <Button className="w-full bg-white text-[var(--primary)] hover:bg-white/90" onClick={() => setActiveTab('questions')}>开始练习</Button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="bg-[var(--surface)] rounded-2xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <input type="text" placeholder="搜索题目..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${filterCategory === cat ? 'bg-[var(--primary)] text-white' : 'bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)]'}`}>
                      {cat === 'all' ? '📚' : categoryConfig[cat]?.icon} {cat === 'all' ? '全部' : cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <button key={diff} onClick={() => setFilterDifficulty(diff)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth ${filterDifficulty === diff ? diff === 'easy' ? 'bg-[var(--success)] text-white' : diff === 'medium' ? 'bg-[var(--warning)] text-white' : 'bg-red-500 text-white' : 'bg-[var(--muted)] text-[var(--foreground-light)] hover:bg-[var(--muted-dark)]'}`}>
                      {diff === 'all' ? '全部' : difficultyConfig[diff as keyof typeof difficultyConfig].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredQuestions.map((q) => {
                const catConfig = categoryConfig[q.category];
                const diff = difficultyConfig[q.difficulty];
                const type = typeConfig[q.type];
                return (
                  <div key={q.id} onClick={() => setSelectedQuestion(q)} className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${catConfig.color} flex items-center justify-center text-lg text-white`}>{catConfig.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-xs text-[var(--foreground-muted)]">{q.category}</span>
                            <h4 className="font-medium text-[var(--foreground)] line-clamp-2">{q.question}</h4>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); togglePracticed(q.id); }} className={`px-2 py-1 rounded text-xs ${q.isPracticed ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--muted)] text-[var(--foreground-muted)]'}`} title="标记已练习">✓</button>
                            <button onClick={(e) => { e.stopPropagation(); toggleStar(q.id); }} className="p-2 rounded hover:bg-[var(--muted)]" title="标记重点">{q.isStarred ? '⭐' : '☆'}</button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${type.color} text-white`}>{type.icon} {q.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${diff.bg} ${diff.color}`}>{diff.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {selectedQuestion && <QuestionDetailModal question={selectedQuestion} onClose={() => setSelectedQuestion(null)} />}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAddExamOpen(false)} />
          <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">添加考试</h2>
              <button onClick={() => setIsAddExamOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-smooth text-[var(--foreground-muted)]">✕</button>
            </div>
            <div className="p-6"><AddExamForm onSubmit={handleAddExam} onCancel={() => setIsAddExamOpen(false)} /></div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
