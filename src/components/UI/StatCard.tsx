'use client';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

const colorMap = {
  primary: 'bg-[var(--primary)]',
  secondary: 'bg-[var(--secondary)]',
  accent: 'bg-[var(--accent)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
}: CardProps) {
  return (
    <div className="bg-[var(--surface)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--foreground-muted)] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
          {subtitle && (
            <p className="text-sm text-[var(--foreground-light)] mt-1">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
