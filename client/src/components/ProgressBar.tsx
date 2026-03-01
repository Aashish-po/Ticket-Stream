import { useMemo } from 'react';

/**
 * ProgressBar Component
 * Design: Gradient Elegance - Animated progress bar with percentage display
 * Features: Smooth animations, gradient fills, percentage labels, size variants
 */

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'error' | 'warning';
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  animated = true,
  className = '',
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  // Determine colors based on variant
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50',
          fill: 'from-green-400 to-emerald-500',
          text: 'text-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          fill: 'from-red-400 to-rose-500',
          text: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          fill: 'from-yellow-400 to-orange-500',
          text: 'text-yellow-700',
        };
      default:
        return {
          bg: 'bg-secondary',
          fill: 'from-primary to-cyan-400',
          text: 'text-primary',
        };
    }
  }, [variant]);

  // Determine size styles
  const sizeStyles = useMemo(() => {
    switch (size) {
      case 'sm':
        return {
          height: 'h-1.5',
          textSize: 'text-xs',
          padding: 'px-2 py-0.5',
        };
      case 'lg':
        return {
          height: 'h-3',
          textSize: 'text-sm',
          padding: 'px-3 py-1',
        };
      default:
        return {
          height: 'h-2',
          textSize: 'text-xs',
          padding: 'px-2 py-0.5',
        };
    }
  }, [size]);

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label and Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <span className={`text-xs font-semibold ${variantStyles.text}`}>
              {clampedProgress}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={`w-full ${variantStyles.bg} rounded-full overflow-hidden ${sizeStyles.height}`}>
        {/* Progress Fill */}
        <div
          className={`h-full bg-gradient-to-r ${variantStyles.fill} rounded-full transition-all duration-500 ease-out ${
            animated && clampedProgress > 0 ? 'shadow-lg' : ''
          }`}
          style={{
            width: `${clampedProgress}%`,
          }}
        >
          {/* Shimmer Effect for Active Uploads */}
          {animated && clampedProgress > 0 && clampedProgress < 100 && (
            <div
              className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
              style={{
                animation: 'shimmer 2s infinite',
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
