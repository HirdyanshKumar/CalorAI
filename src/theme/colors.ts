export const Colors = {
  // ── Core Brand ──────────────────────────────────────
  green: '#4BD883',                        // CalorAI Green (primary accent)
  greenDim: 'rgba(75,216,131,0.18)',       // green at low opacity for backgrounds
  greenBorder: 'rgba(75,216,131,0.35)',    // green border tint

  // ── Backgrounds ─────────────────────────────────────
  bg: '#0d0d0d',                           // pure near-black app background
  bgCard: '#333333',                       // card solid background (dark cards)
  bgGradient: ['#0d0d0d','#0f1a0f','#0a0a0a'] as const,

  // ── Glass surfaces ──────────────────────────────────
  glassPrimary: 'rgba(120,120,128,0.36)',  // Fills-Primary #7878805C
  glassWhite: 'rgba(255,255,255,0.50)',    // #FFFFFF80
  glassLight: '#F7F7F7',                  // light glass variant
  glassDark: '#333333',                   // dark glass card bg

  // ── Labels / Text ───────────────────────────────────
  textPrimary: '#FFFFFF',                  // Labels-Vibrant-Primary
  textSecondary: '#D9D9D9',               // Labels-Vibrant-Controls-Tertiary
  textMuted: 'rgba(255,255,255,0.38)',

  // ── Gradients ───────────────────────────────────────
  gradientPurpleBlue: ['#7843FF','#4CC6FF'] as const, // 180deg top→bottom
  
  // ── Actions ─────────────────────────────────────────
  like: '#4BD883',
  dislike: '#FF3B30',
  notSure: '#8E8E93',
  superLike: '#4CC6FF',

  // ── Dividers / Borders ──────────────────────────────
  border: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.22)',
  divider: 'rgba(255,255,255,0.08)',

  // ── Compatibility Aliases ───────────────────────────
  white: '#FFFFFF',
  accent: '#4BD883',
  blue: '#3b82f6',
}
