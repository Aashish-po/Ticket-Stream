# TicketStream

> Modern helpdesk SaaS platform with intelligent ticket management, real-time chat, and self-service knowledge base.

![GitHub](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue)
![React](https://img.shields.io/badge/react-18%2B-61dafb)

## 🎯 Overview

TicketStream is a full-featured customer support platform designed for teams that need scalable, efficient ticket management. Features intelligent queue routing, real-time live chat, comprehensive knowledge base, and analytics to track support metrics.

### Key Features

✨ **Smart Ticket Management**
- Intelligent queue assignment and prioritization
- Automated routing based on customer priority and agent expertise
- SLA tracking and escalation alerts

💬 **Live Chat & Communication**
- Real-time customer-agent messaging
- Chat history and transcript management
- Mobile-friendly chat interface

📚 **Knowledge Base**
- Self-service article search and discovery
- Content authoring and versioning
- AI-powered article suggestions for agents

📊 **Analytics & Reporting**
- Customer satisfaction metrics (CSAT)
- Response time tracking and optimization
- Agent performance dashboards

🔐 **Enterprise Ready**
- Multi-tenant architecture with data isolation
- Role-based access control (RBAC)
- SSO integration support

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **Real-time**: Socket.io Client
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.io
- **Queue**: Bull (job processing)
- **Authentication**: JWT + OAuth 2.0

### Infrastructure
- **Hosting**: Docker + Docker Compose (development)
- **Payments**: Stripe API integration
- **Email**: SendGrid / nodemailer
- **Storage**: AWS S3 (for attachments)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis (for job queue)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/Aashish-po/ticketstream.git
cd ticketstream

# Install dependencies (root + workspace packages)
pnpm install

# Setup environment variables
cp .env.example .env.local

# Run migrations
pnpm db:migrate

# Seed sample data (optional)
pnpm db:seed

# Start development server
pnpm dev

# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ticketstream

# JWT & Security
JWT_SECRET=your_secret_key_here
SESSION_SECRET=your_session_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG.xxx

# Redis (Job Queue)
REDIS_URL=redis://localhost:6379

# OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
```

## 📁 Project Structure

```
ticketstream/
├── apps/
│   ├── frontend/              # Next.js / React frontend
│   │   ├── app/              # Routes & pages
│   │   ├── components/       # UI components
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # API clients, utilities
│   │
│   └── backend/              # Express.js API server
│       ├── routes/           # API endpoints
│       ├── controllers/      # Request handlers
│       ├── services/         # Business logic
│       ├── models/           # Database models
│       ├── middleware/       # Auth, logging, etc.
│       └── queue/            # Job processing (Bull)
│
├── packages/
│   ├── database/             # Prisma schema & migrations
│   ├── shared-types/         # TypeScript types (shared)
│   └── ui/                   # shadcn/ui components
│
├── docker-compose.yml        # Local dev environment
└── pnpm-workspace.yaml       # Monorepo config

```

## 🔧 Development

### Running Tests

```bash
# Run all tests
pnpm test

# Frontend tests
pnpm -F frontend test

# Backend tests
pnpm -F backend test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Linting & Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

### Database Management

```bash
# Create migration
pnpm db:migrate:dev --name migration_name

# Reset database (dev only)
pnpm db:reset

# Open Prisma Studio
pnpm db:studio
```

## 📦 Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🎓 API Examples

### Create a Support Ticket

```bash
curl -X POST http://localhost:4000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cannot reset password",
    "description": "I am unable to reset my password",
    "priority": "high",
    "category": "account"
  }'
```

### Send Live Chat Message

```javascript
// Frontend - Real-time chat via Socket.io
const socket = io('http://localhost:4000');

socket.emit('chat:message', {
  conversationId: 'conv_123',
  message: 'Hello, I need help with my order',
  senderId: 'user_456'
});

socket.on('chat:message', (data) => {
  console.log('Agent replied:', data.message);
});
```

### Search Knowledge Base

```bash
curl -X GET "http://localhost:4000/api/kb/search?q=billing&limit=10"
```

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│   (TypeScript + shadcn/ui)          │
└──────────────────┬──────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    REST API   Socket.io   GraphQL
        │          │          │
┌───────▼──────────▼──────────▼───────┐
│      Express.js API Server          │
│   (Node.js + TypeScript)            │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │  Controllers & Services       │  │
│  │  - Ticket Management          │  │
│  │  - Chat & Messaging           │  │
│  │  - Knowledge Base             │  │
│  │  - Analytics                  │  │
│  └───────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │
    ┌──────────┼──────────────┐
    │          │              │
┌───▼────┐ ┌──▼────┐  ┌──────▼─────┐
│PostgreSQL│ Redis │  │  External   │
│ (Data)   │(Queue)│  │  Services   │
└──────────┴───────┘  │ (Stripe,    │
                      │  SendGrid)  │
                      └─────────────┘
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U user -h localhost -d ticketstream

# Verify DATABASE_URL in .env.local
# Format: postgresql://user:password@host:port/database
```

### Socket.io Connection Issues
- Ensure Redis is running (`redis-cli ping`)
- Check firewall rules for port 4000
- Verify `CORS_ORIGIN` in backend env

### Job Queue Not Processing
```bash
# Check Bull board at http://localhost:4000/admin/queues
# Restart worker: pnpm -F backend dev
```

## 📈 Performance Optimization

- Database query optimization with Prisma's query caching
- Redis for session management and caching
- Bull queue for async job processing (email, analytics)
- CDN integration for static assets
- API rate limiting and request throttling

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing (bcrypt)
- SQL injection prevention (Prisma)
- CORS configuration for API access
- Rate limiting on sensitive endpoints
- HTTPS enforcement in production
- Data encryption for sensitive fields

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` and `SESSION_SECRET`
- [ ] Configure Stripe webhook endpoints
- [ ] Enable HTTPS and set secure cookies
- [ ] Set up database backups
- [ ] Configure email service (SendGrid, etc.)
- [ ] Enable logging and monitoring
- [ ] Test disaster recovery procedures

### Deploy to Production

```bash
# Build
pnpm build

# Start production server
NODE_ENV=production pnpm start
```

## 📚 Documentation

- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

## 🙋 Support & Feedback

- **Issues**: [GitHub Issues](https://github.com/Aashish-po/ticketstream/issues)
- **Email**: poudelashish572@gmail.com
- **Discussions**: [GitHub Discussions](https://github.com/Aashish-po/ticketstream/discussions)

## 🔮 Roadmap

- [ ] Advanced AI-powered ticket categorization
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and business intelligence
- [ ] Integration marketplace (Slack, Teams, etc.)
- [ ] Chatbot builder for customer automation

---

**Built with ❤️ by [Aashish Paudel](https://github.com/Aashish-po)**

*Enterprise support platform | Open Source | MIT License*
