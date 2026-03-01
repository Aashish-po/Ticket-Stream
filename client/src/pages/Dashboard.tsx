import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Dashboard Page
 * Design: Gradient Elegance - Glassmorphic cards with metrics, charts, and data visualization
 * Features: KPI cards, ticket trend chart, priority distribution, recent activity
 */

const chartData = [
  { day: 'Mon', tickets: 45, resolved: 32 },
  { day: 'Tue', tickets: 52, resolved: 38 },
  { day: 'Wed', tickets: 48, resolved: 35 },
  { day: 'Thu', tickets: 61, resolved: 45 },
  { day: 'Fri', tickets: 55, resolved: 42 },
  { day: 'Sat', tickets: 38, resolved: 28 },
  { day: 'Sun', tickets: 42, resolved: 31 },
];

const priorityData = [
  { name: 'Critical', value: 12, color: '#FF6B35' },
  { name: 'High', value: 28, color: '#FF8C42' },
  { name: 'Medium', value: 45, color: '#0EA5E9' },
  { name: 'Low', value: 35, color: '#06B6D4' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your support overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
        {/* Total Tickets */}
        <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Total Tickets</p>
              <p className="text-3xl font-bold text-foreground">1,248</p>
              <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-cyan-400/20 flex items-center justify-center">
              <AlertCircle className="text-primary" size={24} />
            </div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Avg Response Time</p>
              <p className="text-3xl font-bold text-foreground">2.4h</p>
              <p className="text-xs text-green-600 mt-2">↓ 15% improvement</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-400/20 flex items-center justify-center">
              <Clock className="text-cyan-600" size={24} />
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Resolution Rate</p>
              <p className="text-3xl font-bold text-foreground">94%</p>
              <p className="text-xs text-green-600 mt-2">↑ 3% from last month</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-400/20 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">CSAT Score</p>
              <p className="text-3xl font-bold text-foreground">4.6/5</p>
              <p className="text-xs text-green-600 mt-2">↑ 0.2 points</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
        {/* Ticket Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Ticket Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{ fill: '#0EA5E9', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: '#06B6D4', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Priority Distribution</h2>
          <div className="space-y-4">
            {priorityData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / 120) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 animate-slide-in-top" style={{ animationDelay: '0.3s' }}>
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Ticket #1247 resolved', time: '2 hours ago', type: 'resolved' },
            { action: 'New ticket #1248 created', time: '1 hour ago', type: 'new' },
            { action: 'Ticket #1246 assigned to Sarah', time: '45 minutes ago', type: 'assigned' },
            { action: 'Knowledge base article updated', time: '30 minutes ago', type: 'update' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.type === 'resolved'
                      ? 'bg-green-500'
                      : item.type === 'new'
                        ? 'bg-primary'
                        : item.type === 'assigned'
                          ? 'bg-cyan-500'
                          : 'bg-accent'
                  }`}
                />
                <p className="text-sm text-foreground">{item.action}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
