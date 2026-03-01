import { useState } from 'react';
import { Search, Filter, ChevronRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Tickets Page
 * Design: Gradient Elegance - Ticket queue with filters, priority tags, and assignee info
 * Features: Searchable queue, priority filtering, status badges, assignee avatars
 */

interface Ticket {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee: { name: string; avatar: string };
  customer: string;
  createdAt: string;
  responseTime?: string;
}

const mockTickets: Ticket[] = [
  {
    id: '#1248',
    title: 'Login page not loading on mobile',
    priority: 'critical',
    status: 'in-progress',
    assignee: { name: 'Sarah Chen', avatar: 'SC' },
    customer: 'Acme Corp',
    createdAt: '2 hours ago',
    responseTime: '15 min',
  },
  {
    id: '#1247',
    title: 'Feature request: Dark mode',
    priority: 'low',
    status: 'open',
    assignee: { name: 'Mike Johnson', avatar: 'MJ' },
    customer: 'Tech Startup Inc',
    createdAt: '4 hours ago',
  },
  {
    id: '#1246',
    title: 'API rate limiting issue',
    priority: 'high',
    status: 'in-progress',
    assignee: { name: 'Alex Rodriguez', avatar: 'AR' },
    customer: 'Global Solutions',
    createdAt: '6 hours ago',
    responseTime: '8 min',
  },
  {
    id: '#1245',
    title: 'Payment processing error',
    priority: 'critical',
    status: 'open',
    assignee: { name: 'Sarah Chen', avatar: 'SC' },
    customer: 'E-commerce Plus',
    createdAt: '8 hours ago',
  },
  {
    id: '#1244',
    title: 'Documentation update needed',
    priority: 'medium',
    status: 'resolved',
    assignee: { name: 'Emma Wilson', avatar: 'EW' },
    customer: 'Startup Hub',
    createdAt: '1 day ago',
  },
];

const priorityConfig = {
  critical: { color: '#FF6B35', bg: '#FFF5F0', label: 'Critical' },
  high: { color: '#FF8C42', bg: '#FFF8F3', label: 'High' },
  medium: { color: '#0EA5E9', bg: '#F0F9FF', label: 'Medium' },
  low: { color: '#06B6D4', bg: '#F0FAFB', label: 'Low' },
};

const statusConfig = {
  open: { icon: AlertCircle, color: '#FF8C42', label: 'Open' },
  'in-progress': { icon: Clock, color: '#0EA5E9', label: 'In Progress' },
  resolved: { icon: CheckCircle, color: '#10B981', label: 'Resolved' },
  closed: { icon: CheckCircle, color: '#6B7280', label: 'Closed' },
};

export default function Tickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = !selectedPriority || ticket.priority === selectedPriority;
    const matchesStatus = !selectedStatus || ticket.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground mb-2">Support Tickets</h1>
        <p className="text-muted-foreground">Manage and respond to customer support requests.</p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-4 space-y-4 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by ticket ID or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter size={16} />
            <span>Priority:</span>
          </div>
          {Object.entries(priorityConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedPriority(selectedPriority === key ? null : key)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedPriority === key
                  ? 'text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              style={{
                backgroundColor: selectedPriority === key ? config.color : undefined,
              }}
            >
              {config.label}
            </button>
          ))}

          <div className="w-px bg-border mx-2" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Status:</span>
          </div>
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(selectedStatus === key ? null : key)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedStatus === key
                  ? 'text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              style={{
                backgroundColor: selectedStatus === key ? config.color : undefined,
              }}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3 animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket, idx) => {
            const StatusIcon = statusConfig[ticket.status as keyof typeof statusConfig].icon;
            const priorityInfo = priorityConfig[ticket.priority as keyof typeof priorityConfig];

            return (
              <a
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="glass-card p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer group"
                style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="px-3 py-1 rounded-full text-sm font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: priorityInfo.color }}
                      >
                        {priorityInfo.label}
                      </div>
                      <span className="text-sm font-mono text-muted-foreground flex-shrink-0">{ticket.id}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors truncate">
                      {ticket.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{ticket.customer}</span>
                      <span>•</span>
                      <span>{ticket.createdAt}</span>
                      {ticket.responseTime && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Responded {ticket.responseTime}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {/* Status Icon */}
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        size={18}
                        color={statusConfig[ticket.status as keyof typeof statusConfig].color}
                      />
                      <span className="text-sm font-medium text-foreground hidden sm:inline">
                        {statusConfig[ticket.status as keyof typeof statusConfig].label}
                      </span>
                    </div>

                    {/* Assignee Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                      {ticket.assignee.avatar}
                    </div>

                    {/* Chevron */}
                    <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                  </div>
                </div>
              </a>
            );
          })
        ) : (
          <div className="glass-card p-12 text-center">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-foreground font-medium mb-1">No tickets found</p>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
