
import { useState, useEffect } from 'react';
import type { Settings } from '../../types';

interface SettingsSectionProps {
  settings: Settings;
  onSave: (s: Settings) => void;
}

export default function SettingsSection({ settings, onSave }: SettingsSectionProps) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function field(
    key: keyof Settings,
    label: string,
    placeholder: string,
    multiline?: boolean
  ) {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
          {label}
        </label>

        {multiline ? (
          <textarea
            rows={4}
            value={form[key]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [key]: e.target.value }))
            }
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
          />
        ) : (
          <input
            type="text"
            value={form[key]}
            onChange={(e) =>
              setForm((f) => ({ ...f, [key]: e.target.value }))
            }
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 md:px-8 md:py-6 shrink-0">
        <h1 className="font-serif text-xl md:text-2xl font-medium text-foreground">
          Settings
        </h1>

        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your store and payment information.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 md:px-8">
        <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-5">

          {/* Store Details */}
          <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-5">
            <div className="pb-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Store Details
              </p>
            </div>

            {field(
              'storeName',
              'Store Name',
              'e.g. Aurelle Skin'
            )}

            {field(
              'whatsappNumber',
              'WhatsApp Number',
              'e.g. 08012345678'
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-5">
            <div className="pb-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Payment Details
              </p>
            </div>

            {field(
              'bankName',
              'Bank Name',
              'e.g. First Bank Nigeria'
            )}

            {field(
              'accountName',
              'Account Name',
              'e.g. Aurelle Skin Beauty Ltd'
            )}

            {field(
              'accountNumber',
              'Account Number',
              'e.g. 3012345678'
            )}

            {field(
              'paymentInstructions',
              'Payment Instructions',
              'Instructions for customers...',
              true
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl text-sm font-medium transition-colors ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-accent'
            }`}
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>

        </form>
      </div>
    </div>
  );
}

