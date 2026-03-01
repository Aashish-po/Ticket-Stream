import { useState } from 'react';
import { Star, Send, X, ThumbsUp, MessageSquare } from 'lucide-react';

/**
 * Customer Satisfaction Survey Component
 * Design: Gradient Elegance - Modal survey with star rating, feedback options, and comments
 * Features: 5-star rating, sentiment selection, optional comments, submission tracking
 */

interface SatisfactionSurveyProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
  onSubmit: (surveyData: SurveyData) => void;
}

export interface SurveyData {
  ticketId: string;
  rating: number;
  sentiment: 'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | null;
  comment: string;
  submittedAt: string;
}

export default function SatisfactionSurvey({ isOpen, ticketId, onClose, onSubmit }: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [sentiment, setSentiment] = useState<'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const surveyData: SurveyData = {
      ticketId,
      rating,
      sentiment,
      comment,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(surveyData);
    setIsSubmitted(true);

    // Close modal after showing success message
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setSentiment(null);
    setComment('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl animate-slide-in-top">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">How was your experience?</h2>
              <p className="text-sm text-muted-foreground mt-1">Help us improve our support</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isSubmitted ? (
              // Success State
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto animate-scale-in">
                  <ThumbsUp className="text-white" size={32} />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground mb-1">Thank you!</p>
                  <p className="text-sm text-muted-foreground">Your feedback helps us serve you better.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Star Rating */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Rate your experience</label>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform duration-200 hover:scale-110"
                      >
                        <Star
                          size={40}
                          className={`transition-all duration-200 ${
                            star <= (hoveredRating || rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center text-sm text-muted-foreground">
                      {rating === 1 && 'Very dissatisfied'}
                      {rating === 2 && 'Dissatisfied'}
                      {rating === 3 && 'Neutral'}
                      {rating === 4 && 'Satisfied'}
                      {rating === 5 && 'Very satisfied'}
                    </p>
                  )}
                </div>

                {/* Sentiment Selection */}
                {rating > 0 && (
                  <div className="space-y-3 animate-fade-in">
                    <label className="text-sm font-medium text-foreground">What was the main reason?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'very_satisfied' as const, label: 'Issue Resolved', icon: '✓' },
                        { value: 'satisfied' as const, label: 'Helpful Support', icon: '👍' },
                        { value: 'neutral' as const, label: 'Okay Response', icon: '→' },
                        { value: 'dissatisfied' as const, label: 'Not Helpful', icon: '✗' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSentiment(option.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                            sentiment === option.value
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-white hover:border-primary/50'
                          }`}
                        >
                          <span className="block text-lg mb-1">{option.icon}</span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comment Section */}
                {rating > 0 && (
                  <div className="space-y-3 animate-fade-in">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MessageSquare size={16} />
                      Additional feedback (optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      className="w-full p-3 rounded-lg bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">{comment.length}/500</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!isSubmitted && (
            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={handleClose}
                className="flex-1 py-2 px-4 rounded-lg bg-secondary text-foreground font-medium hover:bg-border transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-cyan-400 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
