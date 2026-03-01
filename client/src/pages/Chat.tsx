import { MessageSquare } from 'lucide-react';

/**
 * Chat Page
 * Design: Gradient Elegance - Live chat interface placeholder
 * Note: This is a placeholder for the live chat feature
 */

export default function Chat() {
  return (
    <div className="space-y-6">
      <div className="animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground mb-2">Live Chat</h1>
        <p className="text-muted-foreground">Manage real-time conversations with customers.</p>
      </div>

      <div className="glass-card p-12 text-center animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
        <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
        <p className="text-foreground font-medium mb-2">Live Chat Feature</p>
        <p className="text-muted-foreground mb-6">
          This feature is coming soon. Real-time chat functionality will allow you to communicate directly with customers.
        </p>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Learn More
        </button>
      </div>
    </div>
  );
}
