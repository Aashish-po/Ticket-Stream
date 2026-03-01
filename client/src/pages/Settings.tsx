import { Settings as SettingsIcon } from 'lucide-react';

/**
 * Settings Page
 * Design: Gradient Elegance - Settings and configuration placeholder
 * Note: This is a placeholder for account and system settings
 */

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences.</p>
      </div>

      <div className="glass-card p-12 text-center animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
        <SettingsIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
        <p className="text-foreground font-medium mb-2">Settings Coming Soon</p>
        <p className="text-muted-foreground mb-6">
          Configure your account, integrations, and system preferences here.
        </p>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Learn More
        </button>
      </div>
    </div>
  );
}
