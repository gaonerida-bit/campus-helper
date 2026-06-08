'use client';

interface ViewToggleProps {
  views: { id: string; label: string; icon: string }[];
  activeView: string;
  onChange: (viewId: string) => void;
}

export default function ViewToggle({ views, activeView, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex bg-[var(--muted)] rounded-xl p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onChange(view.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-smooth
            ${
              activeView === view.id
                ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                : 'text-[var(--foreground-light)] hover:text-[var(--foreground)]'
            }
          `}
        >
          <span>{view.icon}</span>
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
}
