'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles = {
  primary:
    'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] shadow-sm',
  secondary:
    'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted-dark)]',
  ghost:
    'bg-transparent text-[var(--foreground-light)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-medium
        transition-smooth disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
