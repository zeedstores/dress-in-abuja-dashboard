import type { Section } from '../types';

const sectionTitles: Record<Section, string> = {
  products: 'Products',
  orders: 'Orders',
  settings: 'Settings',
};

interface HeaderProps {
  section: Section;
  storeName: string;
}

export default function Header({ section, storeName }: HeaderProps) {
  return (
    <header className="md:hidden flex items-center justify-between px-5 py-4 bg-card border-b border-border shrink-0">
      <div>
        <span className="font-serif text-lg font-medium text-primary">Zeed</span>
        <span className="text-muted-foreground text-sm ml-2">· {storeName}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{sectionTitles[section]}</span>
    </header>
  );
}
