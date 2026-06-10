'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApplications, useContacts, useResumes, useOffers, useInterviews } from '@/context/DataContext';

interface SearchResult {
  id: string;
  type: 'application' | 'resume' | 'interview' | 'contact' | 'offer';
  title: string;
  subtitle: string;
  icon: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { applications } = useApplications();
  const { contacts } = useContacts();
  const { resumes } = useResumes();
  const { offers } = useOffers();
  const { interviews } = useInterviews();

  // Build searchable index from real data
  const allResults = useMemo(() => {
    const items: SearchResult[] = [];

    // Applications
    applications.forEach(app => {
      items.push({
        id: app.id,
        type: 'application',
        title: app.company,
        subtitle: `${app.position} · ${app.stage}`,
        icon: '🏢',
        url: `/applications/${app.id}`,
      });
    });

    // Contacts
    contacts.forEach(contact => {
      items.push({
        id: contact.id,
        type: 'contact',
        title: contact.name,
        subtitle: `${contact.company} · ${contact.position}`,
        icon: '👤',
        url: `/contacts`,
      });
    });

    // Resumes
    resumes.forEach(resume => {
      items.push({
        id: resume.id,
        type: 'resume',
        title: resume.title,
        subtitle: `版本 ${resume.version}`,
        icon: '📄',
        url: `/resume`,
      });
    });

    // Offers
    offers.forEach(offer => {
      items.push({
        id: offer.id,
        type: 'offer',
        title: offer.company,
        subtitle: `${offer.position} · ${offer.salary.total ? `总包 ${offer.salary.total}万` : '待评估'}`,
        icon: '🏆',
        url: `/offer`,
      });
    });

    // Interviews
    interviews.forEach(interview => {
      items.push({
        id: interview.id,
        type: 'interview',
        title: `${interview.company} ${interview.type}`,
        subtitle: `${interview.date} · ${interview.time}`,
        icon: '🎯',
        url: `/interview`,
      });
    });

    return items;
  }, [applications, contacts, resumes, offers, interviews]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const filtered = allResults.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerQuery) ||
          r.subtitle.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, allResults]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('open-search'));
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        router.push(results[selectedIndex].url);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  const typeLabels = {
    application: '投递',
    resume: '简历',
    interview: '面试',
    contact: '联系人',
    offer: 'Offer',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* 搜索弹窗 */}
      <div className="relative w-full max-w-2xl bg-[var(--surface)] rounded-2xl shadow-2xl overflow-hidden">
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <span className="text-2xl">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索公司、岗位、联系人..."
            className="flex-1 bg-transparent text-lg text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none"
          />
          <kbd className="px-2 py-1 rounded bg-[var(--muted)] text-xs text-[var(--foreground-muted)]">
            ESC
          </kbd>
        </div>

        {/* 搜索结果 */}
        {query && (
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      router.push(result.url);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth ${
                      index === selectedIndex
                        ? 'bg-[var(--primary)]/10'
                        : 'hover:bg-[var(--muted)]'
                    }`}
                  >
                    <span className="text-xl">{result.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--foreground)]">
                        {result.title}
                      </p>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--foreground-muted)]">
                      {typeLabels[result.type]}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-[var(--foreground-muted)]">没有找到相关结果</p>
              </div>
            )}
          </div>
        )}

        {/* 底部提示 */}
        {!query && (
          <div className="py-6 px-4 text-center text-[var(--foreground-muted)]">
            <p className="text-sm">输入关键词开始搜索</p>
            <div className="flex justify-center gap-4 mt-3">
              <span className="text-xs">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)]">↑↓</kbd> 导航
              </span>
              <span className="text-xs">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)]">↵</kbd> 选择
              </span>
              <span className="text-xs">
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)]">ESC</kbd> 关闭
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
