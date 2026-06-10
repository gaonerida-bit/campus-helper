'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 导航项配置
const navItems = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/dashboard', label: '数据', icon: '📊' },
  { href: '/applications', label: '投递', icon: '📋' },
  { href: '/calendar', label: '日历', icon: '📅' },
  { href: '/offer', label: 'Offer', icon: '🏆' },
];

const moreNavItems = [
  { href: '/resume', label: '简历', icon: '📄' },
  { href: '/interview', label: '面试', icon: '🎯' },
  { href: '/exam', label: '笔试', icon: '✏️' },
  { href: '/contacts', label: '联系人', icon: '🤝' },
  { href: '/pool', label: '备选库', icon: '📥' },
  { href: '/ai', label: 'AI助手', icon: '🤖' },
  { href: '/settings', label: '设置', icon: '⚙️' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  // 移动端底部导航
  if (isMobile) {
    return (
      <>
        <main className="flex-1 flex flex-col overflow-hidden pb-16">
          <NavigationContent />
        </main>
        {/* 底部标签栏 */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] z-50 safe-area-inset-bottom">
          <div className="flex items-center justify-around h-14">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-16 h-full ${
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </Link>
              );
            })}
            {/* 更多按钮 */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={`flex flex-col items-center justify-center w-16 h-full ${
                showMore ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'
              }`}
            >
              <span className="text-xl">{showMore ? '✕' : '⋮⋮'}</span>
              <span className="text-[10px] mt-0.5">更多</span>
            </button>
          </div>
        </nav>
        {/* 更多菜单弹窗 */}
        {showMore && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMore(false)}
            />
            <div className="fixed bottom-14 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] z-50 rounded-t-2xl max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 p-4">
                {moreNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMore(false)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl ${
                        isActive
                          ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                          : 'text-[var(--foreground-light)] hover:bg-[var(--muted)]'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // 桌面端侧边栏导航
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
          {[...navItems, ...moreNavItems].map((item) => {
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

// 抽取内容区域
function NavigationContent() {
  return <></>;
}
