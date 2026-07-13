'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcuts {
  [key: string]: {
    keys: string;
    description: string;
    action: () => void;
  };
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: KeyboardShortcuts = {
    'k': {
      keys: '⌘K',
      description: '打开全局搜索',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-search'));
      },
    },
    'n': {
      keys: '⌘N',
      description: '新建投递',
      action: () => router.push('/applications/new'),
    },
    'd': {
      keys: '⌘D',
      description: '仪表盘',
      action: () => router.push('/dashboard'),
    },
    's': {
      keys: '⌘S',
      description: '设置',
      action: () => router.push('/settings'),
    },
    'i': {
      keys: '⌘I',
      description: '面试准备',
      action: () => router.push('/interview'),
    },
    '?': {
      keys: '?',
      description: '显示快捷键帮助',
      action: () => setShowHelp(true),
    },
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key) {
        e.preventDefault();
        const key = e.key.toLowerCase();
        if (shortcuts[key]) {
          shortcuts[key].action();
        }
      }

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp(true);
      }

      if (e.key === 'Escape') {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { shortcuts, showHelp, setShowHelp };
}

export function KeyboardShortcutsHelp({ shortcuts, onClose }: {
  shortcuts: { [key: string]: { keys: string; description: string } } | null;
  onClose: () => void;
}) {
  if (!shortcuts) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">⌨️ 键盘快捷键</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--muted)]">✕</button>
        </div>
        <div className="space-y-2">
          {Object.entries(shortcuts).map(([key, shortcut]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <span className="text-[var(--foreground-light)]">{shortcut.description}</span>
              <kbd className="px-3 py-1 rounded-lg bg-[var(--muted)] text-sm font-mono text-[var(--foreground)]">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--foreground-muted)] mt-4 text-center">
          按 ESC 或点击外部区域关闭
        </p>
      </div>
    </div>
  );
}
