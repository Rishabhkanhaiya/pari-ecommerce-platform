import React from 'react'
import Link from 'next/link'

interface LogoProps {
  variant?: 'default' | 'white' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  showSubtitle?: boolean
  className?: string
}

export default function Logo({
  variant = 'default',
  size = 'md',
  showSubtitle = true,
  className = '',
}: LogoProps) {
  const isWhite = variant === 'white'

  // Icon dimensions
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const fontSizes = {
    sm: {
      title: 'text-lg',
      sub: 'text-[9px]',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      title: 'text-2xl',
      sub: 'text-[10px]',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      title: 'text-3xl',
      sub: 'text-xs',
      badge: 'text-xs px-2.5 py-1',
    },
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* ─── BESPOKE MODERN LOGO EMBLEM (SVG) ─── */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-sm"
        >
          <defs>
            {/* Tomato Red to Ruby Gradient */}
            <linearGradient id="pariBrandGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF383C" />
              <stop offset="0.55" stopColor="#E8272A" />
              <stop offset="1" stopColor="#B30E12" />
            </linearGradient>

            {/* Warm Gold Accent Gradient */}
            <linearGradient id="pariGoldGrad" x1="16" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            {/* Soft Shadow Filter for Monogram */}
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#700508" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Squircle Background Base */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="14"
            fill="url(#pariBrandGrad)"
          />

          {/* Subtle Inner Highlight Border */}
          <rect
            x="2.75"
            y="2.75"
            width="42.5"
            height="42.5"
            rx="13.25"
            stroke="white"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />

          {/* Stylized Modern Monogram 'P' with Ribbon/Wings Motif */}
          <g filter="url(#subtleGlow)">
            {/* Vertical Stem of P */}
            <path
              d="M15 13C15 11.8954 15.8954 11 17 11H20C21.1046 11 22 11.8954 22 13V35C22 36.1046 21.1046 37 20 37H17C15.8954 37 15 36.1046 15 35V13Z"
              fill="white"
            />

            {/* Flowing Upper Loop of P (Modern Ribbon Curve) */}
            <path
              d="M20 11H27.5C32.7467 11 37 15.2533 37 20.5C37 25.7467 32.7467 30 27.5 30H20V23.5H27.2C28.8569 23.5 30.2 22.1569 30.2 20.5C30.2 18.8431 28.8569 17.5 27.2 17.5H20V11Z"
              fill="white"
            />

            {/* Elegant Golden Sparkle / Gift Accent (Top Right) */}
            <path
              d="M34.5 11.5L35.7 14.3L38.5 15.5L35.7 16.7L34.5 19.5L33.3 16.7L30.5 15.5L33.3 14.3L34.5 11.5Z"
              fill="url(#pariGoldGrad)"
            />

            {/* Small subtle lower accent dot */}
            <circle cx="27" cy="20.5" r="2" fill="url(#pariBrandGrad)" />
          </g>
        </svg>
      </div>

      {/* ─── WORDMARK & TYPOGRAPHY ─── */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-2">
          <span
            className={`font-display font-black tracking-tight ${fontSizes[size].title} ${
              isWhite ? 'text-white' : 'text-gray-950'
            }`}
          >
            Pari
          </span>

          {/* Premium Store Badge */}
          <span
            className={`font-extrabold uppercase tracking-wider rounded-md font-sans border ${
              fontSizes[size].badge
            } ${
              isWhite
                ? 'bg-white/15 text-white border-white/25'
                : 'bg-gradient-to-r from-red-50 to-rose-50 text-[#E8272A] border-red-200/80 shadow-2xs'
            }`}
          >
            STORE
          </span>
        </div>

        {showSubtitle && variant !== 'compact' && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`font-semibold tracking-[0.16em] uppercase ${fontSizes[size].sub} ${
                isWhite ? 'text-white/80' : 'text-gray-500'
              }`}
            >
              Gift Center & Fashion Hub
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
