import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accentColor?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'var(--primary-light)',
  trend,
  trendLabel,
  accentColor,
  delay = 0,
}: Props) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);

  // Animate numeric values
  useEffect(() => {
    const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (!isNaN(numVal)) {
      let start = 0;
      const duration = 900;
      const step = (numVal / duration) * 16;
      let raf: number;
      const animate = () => {
        start += step;
        if (start >= numVal) {
          setDisplayValue(value);
        } else {
          setDisplayValue(
            typeof value === 'string'
              ? value.replace(/[\d.]+/, start.toFixed(0))
              : Math.floor(start)
          );
          raf = requestAnimationFrame(animate);
        }
      };
      const timer = setTimeout(() => { raf = requestAnimationFrame(animate); }, delay);
      return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
    } else {
      setDisplayValue(value);
    }
  }, [value, delay]);

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'var(--success)'
      : trend === 'down'
      ? 'var(--danger)'
      : 'var(--text-muted)';

  return (
    <div
      className="card animate-fade-in"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent bar */}
      {accentColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: accentColor,
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: accentColor
              ? `${accentColor}18`
              : 'rgba(124,58,237,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: 8,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayValue}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {trend && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              color: trendColor,
              fontSize: '0.78rem',
            }}
          >
            <TrendIcon size={13} />
            {trendLabel}
          </span>
        )}
        {subtitle && !trend && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
