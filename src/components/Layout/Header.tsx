'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[var(--foreground-muted)]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
