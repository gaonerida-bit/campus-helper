'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/components/UI/Button';
import { getKimiService, getApiKey, KimiMessage } from '@/lib/kimi';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIMockInterviewProps {
  company: string;
  position: string;
  interviewType: string;
  duration: number; // minutes
  onClose: () => void;
}

export default function AIMockInterview({
  company,
  position,
  interviewType,
  duration,
  onClose,
}: AIMockInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getInterviewSystemPrompt = () => {
    const basePrompt = `你是一位专业的${company}公司的面试官，正在面试一位应聘${position}岗位的候选人。

面试规则：
1. 先做一个简短的自我介绍（30秒）
2. 然后我会开始正式面试
3. 每次问1-2个问题，等我回答后再继续
4. 问题包括：技术问题、场景题、行为面试题
5. 根据我的回答给予简短反馈

面试类型：${interviewType}

现在开始面试，请先做自我介绍并介绍今天的面试流程。`;

    return basePrompt;
  };

  const startInterview = async () => {
    const kimiService = getKimiService();
    const apiKey = getApiKey();

    if (!apiKey) {
      setError('请先在设置页面配置 Kimi API Key');
      return;
    }

    setIsStarted(true);
    setError(null);

    const systemMessage: Message = {
      id: 'system',
      role: 'system',
      content: '🎙️ 面试官已就位，请做好准备',
      timestamp: new Date(),
    };
    setMessages([systemMessage]);

    try {
      setIsTyping(true);
      const introMessage: KimiMessage = {
        role: 'system',
        content: getInterviewSystemPrompt(),
      };

      const response = await kimiService.chat([introMessage]);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '启动面试失败');
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const kimiService = getKimiService();
      const conversationHistory: KimiMessage[] = [
        { role: 'system', content: getInterviewSystemPrompt() },
        ...messages.slice(1).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: userMessage.content },
      ];

      const response = await kimiService.chat(conversationHistory);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败');
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEndInterview = () => {
    const summaryPrompt = `请对这次面试做一个简短的总结，包括：
1. 候选人的表现亮点
2. 需要改进的地方
3. 面试建议

格式简洁，用bullet points。`;

    // Send summary request
    const kimiService = getKimiService();
    const apiKey = getApiKey();

    if (apiKey) {
      kimiService.chat([
        { role: 'system', content: '你是一位专业的面试官总结助手。' },
        { role: 'user', content: summaryPrompt },
      ]).then((summary) => {
        const summaryMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `📋 面试总结：\n\n${summary}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, summaryMessage]);
      });
    }
  };

  // Pre-interview screen
  if (!isStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            🤖 AI 模拟面试
          </h2>

          <div className="space-y-4 mb-6">
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--foreground-muted)]">公司</span>
                  <p className="font-medium text-[var(--foreground)]">{company}</p>
                </div>
                <div>
                  <span className="text-[var(--foreground-muted)]">职位</span>
                  <p className="font-medium text-[var(--foreground)]">{position}</p>
                </div>
                <div>
                  <span className="text-[var(--foreground-muted)]">面试类型</span>
                  <p className="font-medium text-[var(--foreground)]">{interviewType}</p>
                </div>
                <div>
                  <span className="text-[var(--foreground-muted)]">时长</span>
                  <p className="font-medium text-[var(--foreground)]">{duration} 分钟</p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--warning)]/10 rounded-xl p-4">
              <p className="text-sm text-[var(--warning)]">
                💡 提示：建议选择安静的环境，准备好纸笔记录要点
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 rounded-xl p-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              取消
            </Button>
            <Button onClick={startInterview} className="flex-1">
              🚀 开始面试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Interview screen
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              🤖 AI 模拟面试
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              {company} - {position}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
              timeLeft <= 60 ? 'bg-red-500/10 text-red-500' : 'bg-[var(--muted)] text-[var(--foreground)]'
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            <Button variant="secondary" size="sm" onClick={handleEndInterview}>
              结束面试
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[var(--primary)] text-white'
                    : message.role === 'system'
                    ? 'bg-[var(--muted)] text-[var(--foreground-muted)] text-center w-full'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.role !== 'system' && (
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/60' : 'text-[var(--foreground-muted)]'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-500/10 rounded-xl px-4 py-2 text-red-500 text-sm">
                {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-[var(--surface)] border-t border-[var(--border)] p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的回答... (Enter 发送, Shift+Enter 换行)"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              rows={2}
              disabled={isTyping}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="self-end"
            >
              发送
            </Button>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] mt-2 text-center">
            {timeLeft <= 60 ? '⚠️ 时间不多了，请尽快回答' : '💡 按 Enter 快速发送，长按 Shift+Enter 换行'}
          </p>
        </div>
      </div>
    </div>
  );
}
