import { Github, Slack, Zap, BookOpen, Code, Mail, Twitter, Linkedin } from 'lucide-react';

/**
 * Footer Component
 * Design: Gradient Elegance - Footer with integrations, API docs, and company links
 * Features: Integration badges, quick links, social media, newsletter signup
 */

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold">
                TS
              </div>
              <span className="text-lg font-bold text-foreground">TicketStream</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Modern helpdesk SaaS for managing support tickets, live chat, and knowledge base.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Security', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {[
                { label: 'Documentation', icon: BookOpen },
                { label: 'API Reference', icon: Code },
                { label: 'Help Center', icon: Mail },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                      <Icon size={14} />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to get the latest updates and tips.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="py-8 border-t border-border">
          <h3 className="font-bold text-foreground mb-4">Popular Integrations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Slack', icon: Slack },
              { name: 'GitHub', icon: Github },
              { name: 'Zapier', icon: Zap },
              { name: 'API', icon: Code },
            ].map((integration) => {
              const Icon = integration.icon;
              return (
                <a
                  key={integration.name}
                  href="#"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary hover:bg-border transition-colors group"
                >
                  <Icon className="text-muted-foreground group-hover:text-primary transition-colors" size={18} />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
                    {integration.name}
                  </span>
                </a>
              );
            })}
          </div>
          <a href="#" className="inline-block mt-4 text-sm text-primary font-medium hover:underline">
            View all integrations →
          </a>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TicketStream. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Status Page
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
