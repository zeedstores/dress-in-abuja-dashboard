import type { Section } from '../types';

interface SidebarProps {
  section: Section;
  onNavigate: (s: Section) => void;
  storeName: string;
}

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'products',
    label: 'Products',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1.5" y="10.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="10.5" y="10.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2.5 4h13M2.5 9h13M2.5 14h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
  <img
  src="/settings-icon.png"
  alt="Settings"
  className="w-[18px] h-[18px] object-contain"
/>
),
  },
];

export default function Sidebar({ section, onNavigate, storeName }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-full bg-card border-r border-border">
      <div className="px-6 py-6 border-b border-border">
        <span className="font-serif text-xl font-medium text-primary tracking-tight">Zeed</span>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{storeName}</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-colors ${
              section === item.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">Zeed Dashboard</p>
      </div>
    </aside>
  );
}
