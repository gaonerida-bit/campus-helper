'use client';

import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/Layout/AppLayout';
import Header from '@/components/Layout/Header';
import Button from '@/components/UI/Button';
import { useChatHistory } from '@/context/DataContext';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  type?: 'text' | 'suggestion' | 'action';
}

interface Conversation {
  id: number;
  title: string;
  preview: string;
  date: string;
  unread?: boolean;
}

const quickActions = [
  { id: 1, icon: '📝', title: '优化简历', description: 'AI 帮你优化简历内容', prompt: '请帮我优化简历中的项目经历' },
  { id: 2, icon: '🔍', title: '分析 JD', description: '解读岗位要求', prompt: '请帮我分析这个岗位的要求' },
  { id: 3, icon: '🎯', title: '模拟面试', description: '实时对话练习', prompt: '我想进行一场模拟面试' },
  { id: 4, icon: '📊', title: '进度分析', description: '分析投递策略', prompt: '请分析我的秋招投递策略' },
];

const suggestedQuestions = [
  '帮我看看简历有什么可以改进的',
  '前端开发面试一般问什么',
  '如何准备字节跳动的面试',
  '这个薪资待遇合理吗',
];

const aiResponses: Record<string, string> = {
  default: '收到！让我帮你分析一下...\n\n根据你的情况，我有以下建议：\n\n1. **简历优化**：突出项目成果，用数据说话\n2. **面试准备**：多刷算法题，理解底层原理\n3. **投递策略**：海投+精投结合\n\n需要我详细展开哪一点？',
  resume: '好的，让我帮你看看简历！\n\n**优化建议：**\n\n1. **项目经历**：建议用 STAR 法则描述，突出你的贡献和成果\n\n2. **技术栈**：把熟练使用的技术放在前面\n\n3. **量化成果**：例如"提升了30%页面加载速度"\n\n你可以把简历内容发给我，我帮你逐条优化！',
  interview: '前端面试一般包括以下几个部分：\n\n**1. 手撕算法** (30-40%)\n- 数组、链表、二叉树\n- 动态规划、贪心\n\n**2. 前端基础** (30%)\n- React/Vue 原理\n- JavaScript 核心概念\n- CSS 布局\n\n**3. 项目经历** (20%)\n- 深挖项目细节\n- 性能优化经验\n\n**4. 系统设计** (10%)\n- 架构设计能力\n\n需要我针对某个部分详细讲解吗？',
};

export default function AIPage() {
  const { chatHistory, addMessage } = useChatHistory();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message if no history
  useEffect(() => {
    if (chatHistory.length === 0) {
      addMessage({
        role: 'assistant',
        content: '你好！我是你的校招 AI 助手 🤖\n\n我可以帮你：\n• 优化简历内容\n• 分析 JD 岗位要求\n• 模拟面试问答\n• 制定投递策略\n\n有什么我可以帮你的吗？',
      });
    }
  }, []);

  // Convert chatHistory to display format
  const messages: Message[] = chatHistory.map((msg, idx) => ({
    id: idx,
    role: msg.role,
    content: msg.content,
    time: '刚刚',
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    addMessage({ role: 'user', content: inputValue });
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let response = aiResponses.default;
      const lowerInput = inputValue.toLowerCase();
      if (lowerInput.includes('简历') || lowerInput.includes('优化')) response = aiResponses.resume;
      else if (lowerInput.includes('面试') || lowerInput.includes('准备')) response = aiResponses.interview;

      addMessage({ role: 'assistant', content: response });
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInputValue(action.prompt);
  };

  const handleSuggestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <AppLayout>
      <Header title="AI 助手" subtitle="你的智能校招伙伴" />
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-medium ${message.role === 'user' ? 'bg-[var(--primary)] text-white' : 'bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] text-white'}`}>
                {message.role === 'user' ? 'N' : '🤖'}
              </div>
              <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block px-5 py-3 rounded-2xl ${message.role === 'user' ? 'bg-[var(--primary)] text-white rounded-tr-sm' : 'bg-[var(--surface)] border border-[var(--border)] rounded-tl-sm shadow-sm'}`}>
                  <p className="whitespace-pre-wrap text-[var(--foreground)]">{message.content}</p>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">{message.time}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-medium bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] text-white">🤖</div>
              <div className="inline-block px-5 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] rounded-tl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--foreground-muted)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--foreground-muted)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--foreground-muted)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 快捷建议 */}
        {messages.length === 1 && !isTyping && (
          <div className="px-6 pb-2">
            <p className="text-sm text-[var(--foreground-muted)] mb-2">试试这样问：</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSuggestion(q)} className="px-3 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--foreground-light)] hover:bg-[var(--muted)] hover:border-[var(--primary)] transition-smooth">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 快捷功能 */}
        <div className="px-6 pb-2">
          <p className="text-sm text-[var(--foreground-muted)] mb-2">快捷功能：</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action) => (
              <button key={action.id} onClick={() => handleQuickAction(action)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-smooth whitespace-nowrap">
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm text-[var(--foreground)]">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="输入你的问题..." className="flex-1 px-5 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]" />
            <Button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="px-6">
              {isTyping ? '思考中...' : '发送'}
            </Button>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] text-center mt-2">AI 助手会尽可能帮助你，但建议核实重要信息</p>
        </div>
      </div>
    </AppLayout>
  );
}
