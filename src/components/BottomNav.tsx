import type { Section } from '../types';

interface BottomNavProps {
  section: Section;
  onNavigate: (s: Section) => void;
}

const navItems: { id: Section; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'products',
    label: 'Products',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={active ? 2 : 1.4} fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
        <rect x="10.5" y="1.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={active ? 2 : 1.4} fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
        <rect x="1.5" y="10.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={active ? 2 : 1.4} fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
        <rect x="10.5" y="10.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth={active ? 2 : 1.4} fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0}/>
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
        <path d="M2.5 4h13M2.5 9h13M2.5 14h8" stroke="currentColor" strokeWidth={active ? 2 : 1.4} strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (_active) => (
  <img
    src="/src/imports/settings-icon.png"
    alt="Settings"
    className="w-5 h-5 object-contain"
  />
),
  },
];

export default function BottomNav({ section, onNavigate }: BottomNavProps) {
  return (
    <nav className="md:hidden shrink-0 flex items-center bg-card border-t border-border">
      {navItems.map((item) => {
        const active = section === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
              active ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {item.icon(active)}
            <span className={`text-xs font-medium ${active ? 'text-primary' : ''}`}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
