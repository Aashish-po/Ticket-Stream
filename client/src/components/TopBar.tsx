import { Bell, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';

/**
 * TopBar Component
 * Design: Gradient Elegance - Clean header with search, notifications, and user menu
 * Features: Search functionality, notification badge, user dropdown
 */
export default function TopBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-30 md:ml-64 backdrop-blur-sm bg-white/95">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search tickets, articles..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors group">
            <Bell size={20} className="text-muted-foreground group-hover:text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">John Doe</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border overflow-hidden animate-slide-in-top">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@ticketstream.com</p>
                </div>
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors">
                  <User size={16} />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-secondary flex items-center gap-2 transition-colors border-t border-border">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
