'use client';

import { useState } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface CompanyProfile {
  id: number;
  name: string;
  industry: string;
  size: string;
  tags?: string[];
  salary?: string;
  deadline?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reviews?: number;
}

interface Conversation {
  id: number;
  title: string;
  preview: string;
  date: string;
  unread?: boolean;
}

const quickActions = [
  { id: 1, icon: '📝', title: '优化简历', description: 'AI 帮你优化简历内容' },
  { id: 2, icon: '🔍', title: '分析 JD', description: '解读岗位要求' },
  { id: 3, icon: '🎯', title: '模拟面试', description: '实时对话练习' },
  { id: 4, icon: '📊', title: '进度分析', description: '分析投递策略' },
];

const suggestedQuestions = [
  '帮我优化这段项目经历...',
  '这个岗位适合我吗？',
  '如何准备技术面试？',
  '我的简历有什么问题？',
];

const companyProfiles: CompanyProfile[] = [
  { id: 1, name: '字节跳动', industry: '互联网', size: '10000+人', salary: '35-60k', difficulty: 'hard', reviews: 156, tags: ['大厂', '加班多', '成长快'] },
  { id: 2, name: '腾讯', industry: '互联网', size: '10000+人', salary: '30-55k', difficulty: 'hard', reviews: 203, tags: ['大厂', '福利好', '稳定'] },
  { id: 3, name: '美团', industry: '互联网', size: '10000+人', salary: '25-45k', difficulty: 'medium', reviews: 89, tags: ['本地生活', '发展快'] },
  { id: 4, name: '蚂蚁集团', industry: '金融科技', size: '10000+人', salary: '28-50k', difficulty: 'hard', reviews: 67, tags: ['金融科技', '高薪'] },
  { id: 5, name: 'Shopee', industry: '电商', size: '5000-10000人', salary: '22-40k', difficulty: 'medium', reviews: 45, tags: ['电商', '国际化'] },
];

const conversations: Conversation[] = [
  { id: 1, title: '简历优化建议', preview: '根据你的简历，我建议...', date: '今天', unread: true },
  { id: 2, title: '字节跳动 JD 分析', preview: '这个岗位的核心要求是...', date: '昨天' },
  { id: 3, title: '面试技巧咨询', preview: '关于技术一面，可以这样准备...', date: '3天前' },
];

const difficultyConfig = {
  easy: { label: '较易', color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10' },
  medium: { label: '中等', color: 'text-[var(--warning)]', bg: 'bg-[var(--warning)]/10' },
  hard: { label: '较难', color: 'text-[var(--error)]', bg: 'bg-[var(--error)]/10' },
};

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'companies'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是你的校招 AI 助手 🤖\n\n我可以帮你：\n• 优化简历内容\n• 分析 JD 岗位要求\n• 模拟面试问答\n• 制定投递策略\n\n有什么我可以帮你的吗？',
      time: '刚刚',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [searchCompany, setSearchCompany] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      time: '刚刚',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '收到你的问题！让我来帮你分析一下...\n\n（AI 正在思考中...）',
        time: '刚刚',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleQuickAction = (title: string) => {
    setInputValue(`帮我${title}`);
  };

  const filteredCompanies = companyProfiles.filter(c =>
    c.name.includes(searchCompany) || c.industry.includes(searchCompany)
  );

  return (
    <AppLayout>
      <Header
        title="AI 助手"
        subtitle="你的智能校招伙伴"
        actions={
          <div className="flex gap-2">
            <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'chat'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                💬 对话
              </button>
              <button
                onClick={() => setActiveTab('companies')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  activeTab === 'companies'
                    ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-light)]'
                }`}
              >
                🏢 公司库
              </button>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'chat' && (
          <>
            {/* 左侧快捷操作 */}
            <div className="w-72 bg-[var(--surface)] border-r border-[var(--border)] p-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] mb-3">
                历史对话
              </h3>
              <div className="space-y-2 mb-6">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[var(--foreground)] truncate">
                          {conv.title}
                        </p>
                        {conv.unread && (
                          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] truncate">
                        {conv.preview}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--foreground-muted)]">{conv.date}</span>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] mb-3">
                快捷功能
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.title)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] hover:bg-[var(--muted-dark)] transition-smooth text-left"
                  >
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {action.title}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">
                        {action.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--foreground-muted)] mb-3">
                  本月使用
                </h3>
                <div className="bg-[var(--muted)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--foreground-light)]">
                      对话次数
                    </span>
                    <span className="font-semibold text-[var(--primary)]">23次</span>
                  </div>
                  <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--primary)] rounded-full"
                      style={{ width: '23%' }}
                    />
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2">
                    剩余 ¥77 / ¥100
                  </p>
                </div>
              </div>
            </div>

            {/* 右侧聊天区域 */}
            <div className="flex-1 flex flex-col">
              {/* 消息区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-medium ${
                        message.role === 'user'
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--accent)] text-white'
                      }`}
                    >
                      {message.role === 'user' ? 'N' : '🤖'}
                    </div>
                    <div
                      className={`max-w-[70%] ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-[var(--primary)] text-white rounded-tr-sm'
                            : 'bg-[var(--surface)] border border-[var(--border)] rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] mt-1">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestedQuestions.map((question, i) => (
                      <button
                        key={i}
                        onClick={() => setInputValue(question)}
                        className="px-3 py-1.5 rounded-lg bg-[var(--muted)] text-sm text-[var(--foreground-light)] hover:bg-[var(--muted-dark)] transition-smooth"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="输入你的问题..."
                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <Button onClick={handleSend} disabled={!inputValue.trim()}>
                    发送
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'companies' && (
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto">
              {/* 搜索 */}
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    placeholder="搜索公司..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              {/* 公司列表 */}
              <div className="space-y-4">
                {filteredCompanies.map((company) => {
                  const diff = difficultyConfig[company.difficulty];
                  return (
                    <div
                      key={company.id}
                      className="bg-[var(--surface)] rounded-2xl p-5 shadow-sm border border-[var(--border)] hover:border-[var(--primary)] transition-smooth"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-2xl">
                            🏢
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--foreground)]">
                              {company.name}
                            </h3>
                            <p className="text-sm text-[var(--foreground-light)]">
                              {company.industry} · {company.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-lg ${diff.bg} ${diff.color} text-xs font-medium`}>
                            {diff.label}
                          </span>
                          {company.salary && (
                            <span className="text-[var(--success)] font-semibold">
                              {company.salary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {company.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-lg bg-[var(--muted)] text-xs text-[var(--foreground-light)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                        <span className="text-sm text-[var(--foreground-muted)]">
                          {company.reviews} 条面经
                        </span>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm">📝 面经</Button>
                          <Button variant="secondary" size="sm">🤖 问AI</Button>
                          <Button size="sm">投递</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI 公司分析入口 */}
              <div className="mt-6 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                    🤖
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">AI 公司分析</h3>
                    <p className="text-white/80 text-sm">
                      让 AI 帮你分析目标公司的面试难度、薪资水平、适合度
                    </p>
                  </div>
                  <Button className="bg-white text-[var(--primary)] hover:bg-white/90">
                    开始分析
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
