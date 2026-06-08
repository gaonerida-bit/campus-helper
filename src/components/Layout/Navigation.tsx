'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 导航项配置
const navItems = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/dashboard', label: '数据看板', icon: '📊' },
  { href: '/applications', label: '投递管理', icon: '📋' },
  { href: '/calendar', label: '校招日历', icon: '📅' },
  { href: '/resume', label: '简历库', icon: '📄' },
  { href: '/interview', label: '面试准备', icon: '🎯' },
  { href: '/contacts', label: '联系人', icon: '🤝' },
  { href: '/offer', label: 'Offer对比', icon: '🏆' },
  { href: '/ai', label: 'AI助手', icon: '🤖' },
];

const bottomNavItems = [
  { href: '/settings', label: '设置', icon: '⚙️' },
];

export default function Navigation() {
  const pathname = usePathname();

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <aside className="w-64 min-h-screen bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">
      {/* Logo 区域 */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <h1 className="text-xl font-semibold text-[var(--foreground)]">
          🎓 校招助手
        </h1>
      </div>

      {/* 快捷搜索 */}
      <div className="px-3 py-3">
        <button
          onClick={openSearch}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--muted-dark)] transition-smooth text-sm"
        >
          <span>🔍</span>
          <span className="flex-1 text-left">搜索...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--background)] text-xs">⌘K</kbd>
        </button>
      </div>

      {/* 导航列表 */}
      <nav className="flex-1 py-2 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl
                    text-base font-medium
                    transition-smooth
                    ${
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-md'
                        : 'text-[var(--foreground-light)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部导航 */}
      <div className="py-2 px-3 border-t border-[var(--border)]">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-xl
                    text-base font-medium
                    transition-smooth
                    ${
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-md'
                        : 'text-[var(--foreground-light)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 底部用户信息 */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--muted)]">
          <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium">
            N
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">
              Nerida
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              秋招进行中
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
