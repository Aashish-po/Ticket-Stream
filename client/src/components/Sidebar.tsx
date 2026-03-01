import { useState } from 'react';
import { Menu, X, BarChart3, Ticket, MessageSquare, BookOpen, Settings } from 'lucide-react';
import { useLocation } from 'wouter';

/**
 * Sidebar Navigation Component
 * Design: Gradient Elegance - Floating sidebar with smooth transitions
 * Features: Responsive toggle, active route highlighting, smooth animations
 */
export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/', id: 'dashboard' },
    { icon: Ticket, label: 'Tickets', href: '/tickets', id: 'tickets' },
    { icon: MessageSquare, label: 'Chat', href: '/chat', id: 'chat' },
    { icon: BookOpen, label: 'Knowledge Base', href: '/knowledge-base', id: 'kb' },
    { icon: Settings, label: 'Settings', href: '/settings', id: 'settings' },
  ];

  const isActive = (href: string) => location === href;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-white hover:shadow-lg transition-shadow"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-border z-40 transform transition-transform duration-300 md:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
              <Ticket className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-foreground">TicketStream</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${active
                    ? 'bg-gradient-to-r from-primary/10 to-cyan-400/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
              >
                <Icon
                  size={20}
                  className={`transition-transform group-hover:scale-110 ${
                    active ? 'text-primary' : ''
                  }`}
                />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border">
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
            <p className="text-sm font-medium text-foreground mb-2">Support</p>
            <p className="text-xs text-muted-foreground mb-3">
              Need help? Check our documentation or contact support.
            </p>
            <button className="w-full py-2 px-3 bg-primary text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow">
              Get Help
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64" />
    </>
  );
}
