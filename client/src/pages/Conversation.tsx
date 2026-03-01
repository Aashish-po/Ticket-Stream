import { useState } from 'react';
import { Send, Lock, Globe, ArrowLeft, Clock, User, FileText } from 'lucide-react';
import FileUpload from '@/components/FileUpload';

/**
 * Conversation Page
 * Design: Gradient Elegance - Thread view with customer messages, internal notes, and reply interface
 * Features: Message thread, internal notes toggle, rich reply composer, customer info sidebar
 */

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  isInternal: boolean;
  isCustomer: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    author: 'John Smith',
    avatar: 'JS',
    content: 'Hi, I\'m unable to log into my account. I\'ve tried resetting my password but it\'s not working.',
    timestamp: '2 hours ago',
    isInternal: false,
    isCustomer: true,
  },
  {
    id: '2',
    author: 'Sarah Chen',
    avatar: 'SC',
    content: 'I\'ve checked the account and there seems to be a database sync issue. Let me escalate this to the engineering team.',
    timestamp: '1 hour 45 minutes ago',
    isInternal: false,
    isCustomer: false,
  },
  {
    id: '3',
    author: 'Sarah Chen',
    avatar: 'SC',
    content: 'Customer is on the Enterprise plan - priority support applies. Need to resolve within 2 hours.',
    timestamp: '1 hour 30 minutes ago',
    isInternal: true,
    isCustomer: false,
  },
  {
    id: '4',
    author: 'Engineering Team',
    avatar: 'ET',
    content: 'Database sync issue identified and fixed. User should be able to log in now.',
    timestamp: '1 hour ago',
    isInternal: false,
    isCustomer: false,
  },
  {
    id: '5',
    author: 'John Smith',
    avatar: 'JS',
    content: 'Perfect! I can log in now. Thank you for the quick response!',
    timestamp: '45 minutes ago',
    isInternal: false,
    isCustomer: true,
  },
];

export default function Conversation() {
  const [messages, setMessages] = useState(mockMessages);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [showInternal, setShowInternal] = useState(true);

  const handleSendReply = () => {
    if (replyText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        author: 'Sarah Chen',
        avatar: 'SC',
        content: replyText,
        timestamp: 'just now',
        isInternal,
        isCustomer: false,
      };
      setMessages([...messages, newMessage]);
      setReplyText('');
    }
  };

  const visibleMessages = showInternal ? messages : messages.filter((m) => !m.isInternal);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
      {/* Header */}
      <div className="animate-slide-in-top">
        <div className="flex items-center gap-4 mb-4">
          <a href="/tickets" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="text-muted-foreground" size={20} />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ticket #1248</h1>
            <p className="text-muted-foreground">Login page not loading on mobile</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Conversation Thread */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col overflow-hidden animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
          {/* Controls */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Conversation</h2>
            <button
              onClick={() => setShowInternal(!showInternal)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                showInternal
                  ? 'bg-primary/10 text-primary'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {showInternal ? <Globe size={16} /> : <Lock size={16} />}
              {showInternal ? 'All' : 'Public Only'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {visibleMessages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${message.isCustomer ? 'flex-row' : 'flex-row-reverse'}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                    message.isCustomer
                      ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                      : 'bg-gradient-to-br from-primary to-cyan-400'
                  }`}
                >
                  {message.avatar}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 ${message.isCustomer ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-md rounded-lg p-4 ${
                      message.isInternal
                        ? 'bg-yellow-50 border border-yellow-200'
                        : message.isCustomer
                          ? 'bg-secondary'
                          : 'bg-gradient-to-br from-primary/10 to-cyan-400/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-foreground text-sm">{message.author}</p>
                      {message.isInternal && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">
                          <Lock size={12} />
                          Internal
                        </span>
                      )}
                    </div>
                    <p className="text-foreground text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* File Upload Section */}
          <div className="border-t border-border pt-4 pb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Attachments</h3>
            <FileUpload ticketId="#1248" />
          </div>

          {/* Reply Composer */}
          <div className="border-t border-border pt-4 space-y-3">
            {/* Toggle Internal */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internal-note"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="internal-note" className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                <Lock size={14} />
                Internal note only
              </label>
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="w-full p-3 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={3}
              />
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
          {/* Ticket Info */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-bold text-foreground">Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Status</p>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">In Progress</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Priority</p>
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-foreground">Critical</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                    SC
                  </div>
                  <span className="text-sm font-medium text-foreground">Sarah Chen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <User size={16} />
              Customer
            </h3>
            <div>
              <p className="text-sm font-semibold text-foreground">John Smith</p>
              <p className="text-xs text-muted-foreground">john@acmecorp.com</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Company</p>
              <p className="text-sm font-medium text-foreground">Acme Corporation</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">Plan</p>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-cyan-400/20 text-primary rounded-full text-xs font-bold">
                Enterprise
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-4 space-y-2">
            <h3 className="font-bold text-foreground mb-3">Actions</h3>
            <button className="w-full py-2 px-3 bg-primary text-white rounded-lg font-medium hover:shadow-lg transition-all">
              Resolve Ticket
            </button>
            <button className="w-full py-2 px-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-border transition-all">
              Add Tag
            </button>
            <button className="w-full py-2 px-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-border transition-all">
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
