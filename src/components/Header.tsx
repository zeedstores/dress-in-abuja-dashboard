import { useEffect, useState } from 'react';
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
  }>;
}

export default function Header({ section, storeName }: HeaderProps) {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;

    setInstallPrompt(null);
  };

  return (
    <header className="md:hidden flex items-center justify-between px-5 py-4 bg-card border-b border-border shrink-0">
      <div>
        <span className="font-serif text-lg font-medium text-primary">
          Zeed
        </span>
        <span className="text-muted-foreground text-sm ml-2">
          · {storeName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {installPrompt && (
          <button
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
          >
            Install
          </button>
        )}

        <span className="text-sm font-medium text-foreground">
          {sectionTitles[section]}
        </span>
      </div>
    </header>
  );
}
