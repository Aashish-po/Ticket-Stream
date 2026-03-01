import { useState } from 'react';
import { Search, Eye, ThumbsUp, ChevronRight, BookOpen, Tag } from 'lucide-react';

/**
 * Knowledge Base Page
 * Design: Gradient Elegance - Article browser with search, categories, and featured articles
 * Features: Article search, category filtering, view counts, helpful votes
 */

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  views: number;
  helpful: number;
  tags: string[];
  updatedAt: string;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'How to reset your password',
    excerpt: 'Step-by-step guide to reset your password if you\'ve forgotten it.',
    category: 'Account',
    views: 2541,
    helpful: 89,
    tags: ['password', 'account', 'security'],
    updatedAt: '2 weeks ago',
  },
  {
    id: '2',
    title: 'API authentication guide',
    excerpt: 'Learn how to authenticate your API requests using OAuth 2.0.',
    category: 'Developer',
    views: 1823,
    helpful: 156,
    tags: ['api', 'authentication', 'oauth'],
    updatedAt: '1 month ago',
  },
  {
    id: '3',
    title: 'Troubleshooting login issues',
    excerpt: 'Common login problems and their solutions.',
    category: 'Troubleshooting',
    views: 3421,
    helpful: 234,
    tags: ['login', 'troubleshooting', 'account'],
    updatedAt: '1 week ago',
  },
  {
    id: '4',
    title: 'Setting up integrations',
    excerpt: 'Connect TicketStream with your favorite tools.',
    category: 'Integration',
    views: 1205,
    helpful: 87,
    tags: ['integration', 'setup', 'tools'],
    updatedAt: '3 weeks ago',
  },
  {
    id: '5',
    title: 'Understanding ticket priorities',
    excerpt: 'How we prioritize and handle support tickets.',
    category: 'Getting Started',
    views: 892,
    helpful: 45,
    tags: ['tickets', 'priority', 'support'],
    updatedAt: '2 months ago',
  },
  {
    id: '6',
    title: 'Advanced search operators',
    excerpt: 'Use advanced search to find exactly what you need.',
    category: 'Features',
    views: 654,
    helpful: 32,
    tags: ['search', 'features', 'tips'],
    updatedAt: '1 month ago',
  },
];

const categories = [
  'All',
  'Getting Started',
  'Account',
  'Troubleshooting',
  'Developer',
  'Integration',
  'Features',
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">Find answers and learn how to use TicketStream.</p>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-6 animate-slide-in-top" style={{ animationDelay: '0.1s' }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-base"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 animate-slide-in-top" style={{ animationDelay: '0.15s' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-primary to-cyan-400 text-white shadow-lg'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-border'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Articles Section */}
      {searchQuery === '' && selectedCategory === 'All' && (
        <div className="animate-slide-in-top" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-foreground mb-4">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockArticles.slice(0, 2).map((article, idx) => (
              <a
                key={article.id}
                href={`/knowledge-base/${article.id}`}
                className="glass-card p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-primary/20 to-cyan-400/20 text-primary rounded-full text-xs font-bold">
                    {article.category}
                  </span>
                  <Eye className="text-muted-foreground" size={16} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{article.views.toLocaleString()} views</span>
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <div className="space-y-3 animate-slide-in-top" style={{ animationDelay: '0.25s' }}>
        <h2 className="text-xl font-bold text-foreground">
          {searchQuery || selectedCategory !== 'All' ? 'Search Results' : 'All Articles'}
        </h2>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, idx) => (
            <a
              key={article.id}
              href={`/knowledge-base/${article.id}`}
              className="glass-card p-5 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer group"
              style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-secondary text-muted-foreground rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{article.updatedAt}</span>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{article.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-primary rounded text-xs font-medium"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-muted-foreground mb-1">
                      <Eye size={16} />
                      <span className="text-sm">{article.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end text-green-600">
                      <ThumbsUp size={16} />
                      <span className="text-sm">{article.helpful}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-foreground font-medium mb-1">No articles found</p>
            <p className="text-muted-foreground">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
